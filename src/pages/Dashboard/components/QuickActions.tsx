import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, ShoppingCart, Package, Users } from "lucide-react";

const actions = [
	{
		name: "New Sale",
		description: "Create a new sales invoice",
		icon: ShoppingCart,
		href: "/sales/new",
		color: "bg-blue-500 hover:bg-blue-600",
	},
	{
		name: "Add Product",
		description: "Add new product to inventory",
		icon: Package,
		href: "/products/new",
		color: "bg-green-500 hover:bg-green-600",
	},
	{
		name: "New Purchase",
		description: "Record a new purchase",
		icon: Plus,
		href: "/purchases/new",
		color: "bg-purple-500 hover:bg-purple-600",
	},
	{
		name: "Add Party",
		description: "Add customer or supplier",
		icon: Users,
		href: "/parties/new",
		color: "bg-orange-500 hover:bg-orange-600",
	},
];

export const QuickActions: React.FC = () => {
	const navigate = useNavigate();

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.5 }}
			className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
		>
			<h3 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
				Quick Actions
			</h3>
			<div className="space-y-3">
				{actions.map((action, index) => (
					<motion.button
						key={action.name}
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
						onClick={() => navigate(action.href)}
						className={`w-full flex items-center p-4 rounded-lg text-white transition-colors ${action.color}`}
					>
						<action.icon className="w-5 h-5 mr-3" />
						<div className="text-left">
							<p className="font-medium">{action.name}</p>
							<p className="text-sm opacity-90">{action.description}</p>
						</div>
					</motion.button>
				))}
			</div>
		</motion.div>
	);
};
