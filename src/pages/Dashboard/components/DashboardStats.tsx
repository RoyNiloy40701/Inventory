import React from "react";
import { motion } from "framer-motion";
import {
	Package,
	ShoppingCart,
	DollarSign,
	TrendingUp,
	TrendingDown,
} from "lucide-react";

const stats = [
	{
		name: "Total Products",
		value: "2,847",
		change: "+12%",
		changeType: "increase",
		icon: Package,
		color: "bg-blue-500",
	},
	{
		name: "Today's Sales",
		value: "$12,847",
		change: "+8.2%",
		changeType: "increase",
		icon: ShoppingCart,
		color: "bg-green-500",
	},
	{
		name: "Total Revenue",
		value: "$284,750",
		change: "+15.3%",
		changeType: "increase",
		icon: DollarSign,
		color: "bg-purple-500",
	},
	{
		name: "Low Stock Items",
		value: "23",
		change: "-5%",
		changeType: "decrease",
		icon: Package,
		color: "bg-red-500",
	},
];

export const DashboardStats: React.FC = () => {
	return (
		<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
			{stats.map((stat, index) => (
				<motion.div
					key={stat.name}
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: index * 0.1 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<div className="flex items-center justify-between">
						<div>
							<p className="text-sm font-medium text-gray-600 dark:text-gray-400">
								{stat.name}
							</p>
							<p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
								{stat.value}
							</p>
						</div>
						<div className={`p-3 rounded-lg ${stat.color}`}>
							<stat.icon className="w-6 h-6 text-white" />
						</div>
					</div>
					<div className="flex items-center mt-4">
						{stat.changeType === "increase" ? (
							<TrendingUp className="w-4 h-4 mr-1 text-green-500" />
						) : (
							<TrendingDown className="w-4 h-4 mr-1 text-red-500" />
						)}
						<span
							className={`text-sm font-medium ${
								stat.changeType === "increase"
									? "text-green-600"
									: "text-red-600"
							}`}
						>
							{stat.change}
						</span>
						<span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
							from last month
						</span>
					</div>
				</motion.div>
			))}
		</div>
	);
};
