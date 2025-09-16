import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const cards = [
	{ id: "unit1", value: "Category", href: "/system/category" },
	{ id: "unit2", value: "Unit", href: "/system/unit" },
	{ id: "unit3", value: "Expense Type", href: "/system/expense" },
	{ id: "unit4", value: "Department", href: "/system/department" },
	{ id: "unit5", value: "Cash Account", href: "/system/cashAccount" },
	{ id: "unit6", value: "Mobile Account", href: "/system/mobileAccount" },
	{ id: "unit7", value: "Bank Account", href: "/system/bankAccount" },
	{ id: "unit8", value: "Company", href: "/system/company" },
	{ id: "unit9", value: "Supplier", href: "/system/supplier" },
	{ id: "unit10", value: "Role", href: "/system/role" },
	{ id: "unit11", value: "Customer", href: "/system/customer" },
];

export const SystemSettings: React.FC = () => {
	const navigate = useNavigate();

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						System Setup Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage all website setup
					</p>
				</div>
				<button
					onClick={() => navigate("/salary/new")}
					className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					<Plus className="w-4 h-4 mr-2" />
					Process Salary
				</button>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				{cards.map((stat, index) => (
					<motion.div
						key={stat.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						onClick={() => navigate(stat.href)}
						className="p-6 transition bg-white border border-gray-200 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl dark:border-gray-700 hover:shadow-md"
					>
						<p className="text-xl font-bold text-gray-600 dark:text-gray-200">
							{stat.value}
						</p>
					</motion.div>
				))}
			</div>
		</div>
	);
};
