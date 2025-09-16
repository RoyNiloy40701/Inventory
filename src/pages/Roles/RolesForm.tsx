import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../api";

const schema = yup.object({
	name: yup.string().required("Unit name is required"),
	status: yup.string().required("Status is required"),
	companyName: yup.string().required("Company Name is required"),
});

type FormData = yup.InferType<typeof schema>;

export const RolesForm: React.FC = () => {
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
			status: "",
			companyName: "",
		},
	});

	const [companies, setCompanies] = useState<
		{ _id: string; com_name: string }[]
	>([]);

	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const response = await fetch(`${api.allCompany}`, {
					headers: {
						Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
					},
				});
				const result = await response.json();
				if (result?.data) {
					setCompanies(result.data);
				}
			} catch (error) {
				console.error("Failed to fetch companies:", error);
			}
		};

		fetchCompanies();
	}, []);

	useEffect(() => {
		if (isEdit && id) {
			const fetchUnit = async () => {
				try {
					const response = await fetch(`${api.role}/${id}`, {
						headers: {
							Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
						},
					});

					const result = await response.json();
					if (result?.data) {
						reset({
							name: result?.data?.levelName,
							status: result?.data?.status.toLowerCase(),
							companyName: result?.data?.compid,
						});
					}
				} catch (error) {
					console.error("Failed to fetch role:", error);
				}
			};

			fetchUnit();
		}
	}, [isEdit, id, reset]);

	const onSubmit = async (data: FormData) => {
		console.log("onsubmit", data);

		try {
			const payload: any = {
				//compid: company?.id.toString(),
				levelName: data?.name,
				status: data?.status,
				compid: data?.companyName,
			};
			// Add regby if adding, upby if editing
			if (isEdit) {
				payload.upby = user?.id;
			} else {
				payload.regby = user?.id;
			}

			const url = isEdit ? `${api.role}/${id}` : api.role;
			const method = isEdit ? "PUT" : "POST";

			const response = await fetch(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
				body: JSON.stringify(payload),
			});

			if (!response.ok) throw new Error("Failed to save role");

			const result = await response.json();
			console.log("Response:", result);

			navigate("/system/role");
		} catch (error) {
			console.error("Error saving role:", error);
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
					onClick={() => navigate("/system/role")}
					className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
				</button>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						{isEdit ? "Edit Role" : "Add New Role"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{isEdit ? "Update role information" : "Enter role details to add"}
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
								Role Name *
							</label>
							<input
								{...register("name")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter role name"
							/>
							{errors.name && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.name.message}
								</p>
							)}
						</div>

						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Company Name *
							</label>
							<select
								{...register("companyName")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select Company Name</option>
								{companies?.map((comp) => {
									return (
										<option key={comp?._id} value={comp?._id}>
											{comp?.com_name}
										</option>
									);
								})}
							</select>
							{errors.companyName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.companyName.message}
								</p>
							)}
						</div>
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Status *
							</label>
							<select
								{...register("status")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select status</option>
								<option value="active">Active</option>
								<option value="inactive">Inactive</option>
							</select>
							{errors.status && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.status.message}
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
						onClick={() => navigate("/system/role")}
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
