import React from "react";
import { motion } from "framer-motion";
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
} from "recharts";

const data = [
	{ name: "Mon", sales: 4000, purchases: 2400 },
	{ name: "Tue", sales: 3000, purchases: 1398 },
	{ name: "Wed", sales: 2000, purchases: 9800 },
	{ name: "Thu", sales: 2780, purchases: 3908 },
	{ name: "Fri", sales: 1890, purchases: 4800 },
	{ name: "Sat", sales: 2390, purchases: 3800 },
	{ name: "Sun", sales: 3490, purchases: 4300 },
];

export const SalesChart: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.4 }}
			className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
		>
			<div className="flex items-center justify-between mb-6">
				<div>
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
						Sales vs Purchases
					</h3>
					<p className="text-sm text-gray-600 dark:text-gray-400">
						Last 7 days performance
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<div className="flex items-center">
						<div className="w-3 h-3 mr-2 bg-blue-500 rounded-full"></div>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Sales
						</span>
					</div>
					<div className="flex items-center">
						<div className="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
						<span className="text-sm text-gray-600 dark:text-gray-400">
							Purchases
						</span>
					</div>
				</div>
			</div>
			<div className="h-80">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart data={data}>
						<CartesianGrid strokeDasharray="3 3" className="opacity-30" />
						<XAxis
							dataKey="name"
							className="text-gray-600 dark:text-gray-400"
						/>
						<YAxis className="text-gray-600 dark:text-gray-400" />
						<Tooltip
							contentStyle={{
								backgroundColor: "rgba(255, 255, 255, 0.95)",
								border: "1px solid #e5e7eb",
								borderRadius: "8px",
							}}
						/>
						<Line
							type="monotone"
							dataKey="sales"
							stroke="#3b82f6"
							strokeWidth={2}
							dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
						/>
						<Line
							type="monotone"
							dataKey="purchases"
							stroke="#10b981"
							strokeWidth={2}
							dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</div>
		</motion.div>
	);
};
