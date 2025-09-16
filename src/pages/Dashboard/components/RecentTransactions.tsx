import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const transactions = [
	{
		id: 1,
		type: "sale",
		customer: "John Doe",
		amount: 1250.0,
		date: "2024-01-15",
		status: "completed",
	},
	{
		id: 2,
		type: "purchase",
		supplier: "ABC Suppliers",
		amount: 850.0,
		date: "2024-01-15",
		status: "pending",
	},
	{
		id: 3,
		type: "sale",
		customer: "Jane Smith",
		amount: 675.5,
		date: "2024-01-14",
		status: "completed",
	},
	{
		id: 4,
		type: "purchase",
		supplier: "XYZ Corp",
		amount: 2100.0,
		date: "2024-01-14",
		status: "completed",
	},
];

export const RecentTransactions: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.6 }}
			className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
		>
			<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
				Recent Transactions
			</h3>
			<div className="space-y-4">
				{transactions.map((transaction, index) => (
					<motion.div
						key={transaction.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}
						className="flex items-center justify-between p-3 transition-colors rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<div className="flex items-center">
							<div
								className={`p-2 rounded-lg mr-3 ${
									transaction.type === "sale"
										? "bg-green-100 dark:bg-green-900/20"
										: "bg-blue-100 dark:bg-blue-900/20"
								}`}
							>
								{transaction.type === "sale" ? (
									<ArrowUpRight className="w-4 h-4 text-green-600 dark:text-green-400" />
								) : (
									<ArrowDownLeft className="w-4 h-4 text-blue-600 dark:text-blue-400" />
								)}
							</div>
							<div>
								<p className="font-medium text-gray-900 dark:text-white">
									{transaction.type === "sale"
										? transaction.customer
										: transaction.supplier}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{transaction.type === "sale" ? "Sale" : "Purchase"} •{" "}
									{transaction.date}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p
								className={`font-semibold ${
									transaction.type === "sale"
										? "text-green-600 dark:text-green-400"
										: "text-blue-600 dark:text-blue-400"
								}`}
							>
								${transaction.amount.toFixed(2)}
							</p>
							<span
								className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
									transaction.status === "completed"
										? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
										: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
								}`}
							>
								{transaction.status}
							</span>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	);
};
