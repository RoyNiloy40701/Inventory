import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Package } from "lucide-react";

const lowStockItems = [
	{ id: 1, name: "iPhone 15 Pro", sku: "IP15P-128", stock: 5, minStock: 10 },
	{
		id: 2,
		name: "Samsung Galaxy S24",
		sku: "SGS24-256",
		stock: 3,
		minStock: 8,
	},
	{ id: 3, name: "MacBook Air M3", sku: "MBA-M3-512", stock: 2, minStock: 5 },
	{ id: 4, name: 'iPad Pro 12.9"', sku: "IPP-129-1TB", stock: 1, minStock: 4 },
];

export const LowStockAlert: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.7 }}
			className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
		>
			<div className="flex items-center mb-4">
				<AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
				<h3 className="text-lg font-semibold text-gray-900 dark:text-white">
					Low Stock Alert
				</h3>
			</div>
			<div className="space-y-4">
				{lowStockItems.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: 0.8 + index * 0.1 }}
						className="flex items-center justify-between p-3 border border-red-200 rounded-lg bg-red-50 dark:bg-red-900/20 dark:border-red-800"
					>
						<div className="flex items-center">
							<Package className="w-4 h-4 mr-3 text-red-500" />
							<div>
								<p className="font-medium text-gray-900 dark:text-white">
									{item.name}
								</p>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									SKU: {item.sku}
								</p>
							</div>
						</div>
						<div className="text-right">
							<p className="text-sm font-semibold text-red-600 dark:text-red-400">
								{item.stock} left
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400">
								Min: {item.minStock}
							</p>
						</div>
					</motion.div>
				))}
			</div>
			<button className="w-full px-4 py-2 mt-4 font-medium text-white transition-colors bg-red-600 rounded-lg hover:bg-red-700">
				Reorder All
			</button>
		</motion.div>
	);
};
