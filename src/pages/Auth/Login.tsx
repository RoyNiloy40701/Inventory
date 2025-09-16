import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { Package, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object({
	email: yup.string().email("Invalid email").required("Email is required"),
	password: yup
		.string()
		.min(6, "Password must be at least 6 characters")
		.required("Password is required"),
});

type FormData = yup.InferType<typeof schema>;

export const Login: React.FC = () => {
	const { user, login, isLoading } = useAuth();
	const [showPassword, setShowPassword] = useState(false);
	const [loginError, setLoginError] = useState("");

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
	});

	if (user) {
		return <Navigate to="/dashboard" replace />;
	}

	const onSubmit = async (data: FormData) => {
		try {
			setLoginError("");
			await login(data.email, data.password);
		} catch (error) {
			setLoginError("Invalid email or password");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="w-full max-w-md p-8 bg-white shadow-xl dark:bg-gray-800 rounded-xl"
			>
				{/* Logo */}
				<div className="mb-8 text-center">
					<div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-blue-600 rounded-xl">
						<Package className="w-8 h-8 text-white" />
					</div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">
						InventoryPro
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Sign in to your account
					</p>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					{loginError && (
						<div className="px-4 py-3 text-sm text-red-600 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
							{loginError}
						</div>
					)}

					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Email Address
						</label>
						<input
							{...register("email")}
							type="email"
							className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							placeholder="Enter your email"
						/>
						{errors.email && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Password
						</label>
						<div className="relative">
							<input
								{...register("password")}
								type={showPassword ? "text" : "password"}
								className="w-full px-3 py-2 pr-10 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter your password"
							/>
							<button
								type="button"
								onClick={() => setShowPassword(!showPassword)}
								className="absolute text-gray-400 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-600"
							>
								{showPassword ? (
									<EyeOff className="w-4 h-4" />
								) : (
									<Eye className="w-4 h-4" />
								)}
							</button>
						</div>
						{errors.password && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.password.message}
							</p>
						)}
					</div>

					<button
						type="submit"
						disabled={isLoading}
						className="flex items-center justify-center w-full px-4 py-2 font-medium text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
					>
						{isLoading ? (
							<div className="w-5 h-5 border-b-2 border-white rounded-full animate-spin"></div>
						) : (
							"Sign In"
						)}
					</button>
				</form>

				{/* Demo credentials */}
				<div className="p-4 mt-6 rounded-lg bg-gray-50 dark:bg-gray-700">
					<p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
						Demo credentials:
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-500">
						Email: admin@gmail.com
					</p>
					<p className="text-xs text-gray-500 dark:text-gray-500">
						Password: 123456
					</p>
				</div>
			</motion.div>
		</div>
	);
};
