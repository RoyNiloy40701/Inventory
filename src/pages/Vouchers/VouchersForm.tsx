import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { api } from "../../api";
import { useAuth } from "../../contexts/AuthContext";
import { useDropdowns } from "../../contexts/DropDownContext";

interface Account {
	_id: string;
	accountName: string;
	accountNo?: string;
	status?: string;
}

interface UserItem {
	_id: string;
	displayName: string;
	status?: string;
}

const schema = yup.object({
	voucherType: yup.string().required("Voucher type is required"),
	date: yup
		.date()
		.transform((value, originalValue) => (originalValue === "" ? null : value))
		.typeError("Date must be a valid date")
		.required("Date is required"),
	supplierName: yup.string(),
	amount: yup.number().positive("Amount must be positive"),
	paymentMethod: yup.string().required("Payment method is required"),
	reference: yup.string(),
	accountId: yup.string().required("Account No is required"),
	status: yup.string().required("Status is required"),
	customerName: yup.string(),
	expenseType: yup.string(),
	particularName: yup.string(),
	particulars: yup
		.array()
		.of(
			yup.object({
				particularName: yup.string().nullable(),
				amount: yup
					.number()
					.typeError("Amount must be a number")
					.positive("Amount must be positive"),
			})
		)
		.min(1, "At least one particular is required"),
});

type FormData = yup.InferType<typeof schema>;

export const VouchersForm: React.FC = () => {
	const { company, user: authUser } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);
	const {
		customers,
		mobileAccounts,
		bankAccounts,
		cashAccounts,
		expenseTypes,
		supplier,
		loading,
	} = useDropdowns();
	const [accounts, setAccounts] = useState<Account[]>([]);
	const [user, setUser] = useState<UserItem[]>([]);

	const {
		register,
		handleSubmit,
		watch,
		reset,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			voucherType: "",
			date: new Date().toISOString().split("T")[0],
			supplierName: "",
			paymentMethod: "",
			reference: "",
			accountId: "",
			status: "",
			expenseType: "",
			customerName: "",
			particulars: [{ particularName: "", amount: 0 }],
		},
	});

	const { fields, append, remove } = useFieldArray({
		control,
		name: "particulars",
	});

	const voucherType = watch("voucherType");
	const paymentMethod = watch("paymentMethod");

	useEffect(() => {
		let activeAccounts: any[] = [];

		switch (paymentMethod) {
			case "Cash":
				activeAccounts = cashAccounts.filter((acc) => acc.status === "active");
				break;
			case "Bank":
				activeAccounts = bankAccounts.filter((acc) => acc.status === "active");
				break;
			case "Mobile":
				activeAccounts = mobileAccounts.filter(
					(acc) => acc.status === "active"
				);
				break;
			default:
				activeAccounts = [];
		}

		setAccounts(activeAccounts);
	}, [paymentMethod, cashAccounts, bankAccounts, mobileAccounts]);

	useEffect(() => {
		if (!voucherType) {
			setUser([]);
			return;
		}

		let activeUsers: any[] = [];

		switch (voucherType) {
			case "credit":
				activeUsers = customers
					.filter((c) => c.status?.toLowerCase() === "active")
					.map((c) => ({ ...c, displayName: c.customerName || "Unnamed" }));
				console.log(voucherType, activeUsers);
				break;
			case "debit":
				activeUsers = expenseTypes
					.filter((e) => e.status?.toLowerCase() === "active")
					.map((e) => ({ ...e, displayName: e.costName || "Unnamed" }));
				console.log(voucherType, activeUsers);
				break;
			case "supplier":
				activeUsers = supplier
					.filter((s) => s.status?.toLowerCase() === "active")
					.map((s) => ({ ...s, displayName: s.supplierName || "Unnamed" }));
				console.log(voucherType, activeUsers);
				break;
			default:
				activeUsers = [];
		}

		setUser(activeUsers);
	}, [voucherType, customers, expenseTypes, supplier]);

	useEffect(() => {
		if (isEdit && id) {
			const fetchVoucher = async () => {
				try {
					const res = await fetch(`${api.voucher}/${id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						},
					});
					const result = await res.json();
					const data = result.data;

					if (data) {
						// Reset form values
						reset({
							voucherType: data?.voucherType,
							date: data?.voucherDate.split("T")[0],
							supplierName: data?.supplier || "",
							paymentMethod: data?.accountType,
							reference: data?.reference || "",
							accountId: data?.accountNo,
							status: data?.status,
							expenseType: data?.costType || "",
							customerName: data?.customerID || "",
							particulars: data?.voucher?.map((p: any) => ({
								particularName: p.particularName,
								amount: p.amount,
							})) || [{ particularName: "", amount: 0 }],
						});

						// Update accounts dropdown based on paymentMethod
						let activeAccounts: Account[] = [];
						switch (data.accountType) {
							case "Cash":
								activeAccounts = cashAccounts.filter(
									(acc) => acc.status === "active"
								);
								break;
							case "Bank":
								activeAccounts = bankAccounts.filter(
									(acc) => acc.status === "active"
								);
								break;
							case "Mobile":
								activeAccounts = mobileAccounts.filter(
									(acc) => acc.status === "active"
								);
								break;
						}
						setAccounts(activeAccounts);

						// Update user dropdown based on voucherType
						let activeUsers: UserItem[] = [];
						switch (data.voucherType) {
							case "credit":
								activeUsers = customers
									.filter((c) => c.status === "active")
									.map((c) => ({
										...c,
										displayName: c.customerName || "Unnamed",
									}));
								break;
							case "debit":
								activeUsers = expenseTypes
									.filter((e) => e.status === "active")
									.map((e) => ({ ...e, displayName: e.costName || "Unnamed" }));
								break;
							case "supplier":
								activeUsers = supplier
									.filter((s) => s.status === "active")
									.map((s) => ({
										...s,
										displayName: s.supplierName || "Unnamed",
									}));
								break;
						}
						setUser(activeUsers);
					}
				} catch (err) {
					console.error("Failed to fetch voucher:", err);
				}
			};
			fetchVoucher();
		}
	}, [
		isEdit,
		id,
		reset,
		cashAccounts,
		bankAccounts,
		mobileAccounts,
		customers,
		expenseTypes,
		supplier,
	]);

	const onSubmit = async (data: FormData) => {
		try {
			const particulars = (data.particulars || []).map((item) => ({
				...item,
				amount: Number(item.amount || 0),
			}));
			const totalAmount = particulars.reduce((sum, p) => sum + p.amount, 0);

			const voucherPayload: any = {
				voucherType: data?.voucherType,
				accountType: data?.paymentMethod,
				accountNo: data?.accountId,
				supplier: data?.supplierName,
				costType: data?.expenseType,
				compid: company?.id.toString(),
				voucherDate: data?.date,
				totalAmount: totalAmount,
				status: data?.status,
				empid: authUser?.id,
				customerID:data?.customerName,
			};

			if (isEdit) {
				voucherPayload.upby = authUser?.id;
			} else {
				voucherPayload.regby = authUser?.id;
			}

			const url = isEdit ? `${api.voucher}/${id}` : api.voucher;
			const method = isEdit ? "PUT" : "POST";

			const voucherRes = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
				body: JSON.stringify(voucherPayload),
			});

			const voucherResult = await voucherRes.json();
			if (!voucherRes.ok)
				throw new Error(voucherResult.message || "Failed to save voucher");

			// Handle particulars properly in edit mode
			if (particulars.length) {
				// Add all particulars
				for (const item of particulars) {
					await fetch(api.particularVoucher, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						},
						body: JSON.stringify({
							...item,
							vuid: voucherResult.data._id,
							regby: authUser?.id,
						}),
					});
				}
			}

			navigate("/vouchers");
		} catch (error: any) {
			console.error("Error saving voucher:", error.message);
		}
	};

	const getPaymentMethods = () => ["Cash", "Mobile", "Bank"];
	return (
		<div className="space-y-6">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center space-x-4"
			>
				<button
					onClick={() => navigate("/vouchers")}
					className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{isEdit ? "Edit Voucher" : "New Voucher"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{isEdit
							? "Update voucher information"
							: "Create a new voucher entry"}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Voucher Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Voucher Information
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-3">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Voucher Type *
							</label>
							<select
								{...register("voucherType")}
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
							>
								<option value="">Select type</option>
								<option value="credit">Credit Voucher</option>
								<option value="debit">Debit Voucher</option>
								<option value="supplier">Supplier Pay</option>
							</select>
							{errors.voucherType && (
								<p className="mt-1 text-sm text-red-600">
									{errors.voucherType.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Date *
							</label>
							<input
								{...register("date")}
								type="date"
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
							/>
							{errors.date && (
								<p className="mt-1 text-sm text-red-600">
									{errors.date.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Status *
							</label>
							<select
								{...register("status")}
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
							>
								<option value="">Select status</option>
								<option value="pending">Pending</option>
								<option value="approved">Approved</option>
								<option value="rejected">Rejected</option>
							</select>
							{errors.status && (
								<p className="mt-1 text-sm text-red-600">
									{errors.status.message}
								</p>
							)}
						</div>
					</div>
				</motion.div>

				{/* Transaction Details */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Transaction Details
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{voucherType === "debit" && (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:col-span-2">
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
										Expense *
									</label>
									<select
										{...register("expenseType")}
										className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
									>
										<option value="">Select expense type</option>
										{user.map((expense) => (
											<option key={expense._id} value={expense._id}>
												{expense.displayName}
											</option>
										))}
									</select>
									{errors.expenseType && (
										<p className="mt-1 text-sm text-red-600">
											{errors.expenseType.message}
										</p>
									)}
								</div>
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
										Reference Number
									</label>
									<input
										{...register("reference")}
										type="text"
										className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
										placeholder="Enter reference number"
									/>
								</div>
							</div>
						)}

						<div
							className={`grid grid-cols-1 gap-6 md:col-span-2 ${
								["credit", "supplier"].includes(voucherType)
									? "md:grid-cols-3"
									: "md:grid-cols-2"
							}`}
						>
							{voucherType === "credit" && (
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
										Customer Name *
									</label>
									<select
										{...register("customerName")}
										className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
									>
										<option value="">Select customer</option>
										{user.map((customer) => (
											<option key={customer._id} value={customer._id}>
												{customer.displayName}
											</option>
										))}
									</select>
									{errors.customerName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.customerName.message}
										</p>
									)}
								</div>
							)}

							{voucherType === "supplier" && (
								<div>
									<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
										Supplier *
									</label>
									<select
										{...register("supplierName")}
										className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
									>
										<option value="">Select Supplier</option>
										{user.map((supplier) => (
											<option key={supplier._id} value={supplier._id}>
												{supplier.displayName}
											</option>
										))}
									</select>
									{errors.supplierName && (
										<p className="mt-1 text-sm text-red-600">
											{errors.supplierName.message}
										</p>
									)}
								</div>
							)}

							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									Payment Method *
								</label>
								<select
									{...register("paymentMethod")}
									className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
								>
									<option value="">Select payment method</option>
									{getPaymentMethods().map((method) => (
										<option key={method} value={method}>
											{method}
										</option>
									))}
								</select>
								{errors.paymentMethod && (
									<p className="mt-1 text-sm text-red-600">
										{errors.paymentMethod.message}
									</p>
								)}
							</div>

							<div>
								<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
									Account No *
								</label>
								<select
									{...register("accountId")}
									className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
								>
									<option value="">Select account no</option>
									{accounts.map((account) => (
										<option key={account._id} value={account._id}>
											{account.accountName}
											{paymentMethod === "Cash"
												? ""
												: ` (${account.accountNo})`}
										</option>
									))}
								</select>
								{errors.accountId && (
									<p className="mt-1 text-sm text-red-600">
										{errors.accountId.message}
									</p>
								)}
							</div>
						</div>
					</div>
				</motion.div>

				{/* Particulars */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<div className="flex items-center justify-between mb-4">
						<h2 className="text-lg font-semibold text-gray-900 dark:text-white">
							Particulars Information
						</h2>
						<button
							type="button"
							onClick={() => append({ particularName: "", amount: 0 })}
							className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700"
						>
							<Plus size={16} /> Add
						</button>
					</div>

					{fields.map((field, index) => (
						<div
							key={field.id}
							className="grid items-center grid-cols-1 gap-4 mb-4 md:grid-cols-2"
						>
							<textarea
								{...register(`particulars.${index}.particularName`)}
								rows={3}
								className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
								placeholder="Enter any additional particularName ..."
							/>

							<div className="flex items-center gap-2">
								<input
									{...register(`particulars.${index}.amount`)}
									type="number"
									step="0.01"
									className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
									placeholder="0.00"
								/>
								{index > 0 && (
									<button
										type="button"
										onClick={() => remove(index)}
										className="flex items-center gap-1 px-3 py-2 text-sm text-white bg-red-600 rounded-lg hover:bg-red-800"
									>
										<Minus size={16} /> Remove
									</button>
								)}
							</div>
						</div>
					))}
					{errors.particulars && (
						<p className="mt-1 text-sm text-red-600">
							{errors.particulars.message as string}
						</p>
					)}
				</motion.div>

				{/* Form Actions */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.5 }}
					className="flex items-center justify-end space-x-4"
				>
					<button
						type="button"
						onClick={() => navigate("/vouchers")}
						className="px-6 py-2 font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 dark:text-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="px-6 py-2 font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
					>
						{isEdit ? "Update Voucher" : "Create Voucher"}
					</button>
				</motion.div>
			</form>
		</div>
	);
};
