import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../api";

const schema = yup.object({
	name: yup.string().required("Mobile Account name is required"),
	address: yup.string().required(" Address  is required"),
	email: yup.string().required("Email is required"),
	contactNo: yup.string().required("Account No is required"),
	vat_reg: yup.string().required("vat_reg number is required"),
});

type FormData = yup.InferType<typeof schema>;

export const CompanyForm: React.FC = () => {
	const { user } = useAuth();
	const navigate = useNavigate();
	const { id } = useParams();
	const isEdit = Boolean(id);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: {
			name: "",
			email: "",
			address: "",
			contactNo: "",
			vat_reg: "",
		},
	});

	useEffect(() => {
		if (isEdit && id) {
			const fetchUnit = async () => {
				try {
					const response = await fetch(`${api.company}/${id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						},
					});

					const result = await response.json();
					if (result?.data) {
						reset({
							name: result?.data?.com_name,
							email: result?.data?.com_email,
							address: result?.data?.com_address,
							contactNo: result?.data?.com_mobile,
							vat_reg: result?.data?.com_vat,
						});
					}
				} catch (error) {
					console.error("Failed to fetch company:", error);
				}
			};

			fetchUnit();
		}
	}, [isEdit, id, reset]);

	const onSubmit = async (data: FormData) => {
		try {
			const payload: any = {
				com_name: data?.name,
				com_email: data?.email,
				com_mobile: data?.contactNo,
				com_address: data?.address,
				com_vat: data?.vat_reg,
			};

			// Add regby if adding, upby if editing
			if (isEdit) {
				payload.upby = user?.id;
			} else {
				payload.regby = user?.id;
			}

			const url = isEdit ? `${api.company}/${id}` : api.company;
			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error("Failed to save company");

			const result = await response.json();
			console.log("Response:", result);

			navigate("/system/company");
		} catch (error) {
			console.error("Error saving company:", error);
		}
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center space-x-4"
			>
				<button
					onClick={() => navigate("/system/company")}
					className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{isEdit ? "Edit Company Type" : "Add Company Type"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{isEdit
							? "Update company information"
							: "Enter company details to add"}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Basic Information
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Company Name *
							</label>
							<input
								{...register("name")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter cash account name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.name.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Contact No *
							</label>
							<input
								{...register("contactNo")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter mobile account no"
							/>
							{errors.contactNo && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.contactNo.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Email *
							</label>
							<input
								{...register("email")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter account owner name"
							/>
							{errors.email && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.email.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Address
							</label>
							<input
								{...register("address")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter balance amount"
							/>
							{errors.address && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.address.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Vat Reg. Number
							</label>
							<input
								{...register("vat_reg")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter balance amount"
							/>
							{errors.vat_reg && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.vat_reg.message}
								</p>
							)}
						</div>
					</div>
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
						onClick={() => navigate("/system/company")}
						className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						Cancel
					</button>
					<button
						type="submit"
						disabled={isSubmitting}
						className="flex items-center px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
					>
						{isSubmitting ? (
							<div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
						) : null}
						{isEdit ? "Update" : "Add"}
					</button>
				</motion.div>
			</form>
		</div>
	);
};
