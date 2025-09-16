import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import {
	LayoutDashboard,
	Package,
	Boxes,
	Users,
	ShoppingCart,
	ShoppingBag,
	Receipt,
	DollarSign,
	ArrowLeftRight,
	BarChart3,
	UserCog,
	Settings,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface SidebarProps {
	isOpen: boolean;
	onToggle: () => void;
}

const navigation = [
	{ name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ name: "Products", href: "/products", icon: Package },
	{ name: "Category", href: "/category", icon: Boxes },
	{ name: "Parties", href: "/parties", icon: Users },
	{ name: "Supplier", href: "/supplier", icon: Users },
	{ name: "Sales", href: "/sales", icon: ShoppingCart },
	{ name: "Sales Return", href: "/sales-return", icon: ShoppingCart },
	{ name: "Purchases", href: "/purchases", icon: ShoppingBag },
	{ name: "purchase Return", href: "/purchase-return", icon: ShoppingCart },
	{ name: "Vouchers", href: "/vouchers", icon: Receipt },
	{ name: "Department", href: "/department", icon: Boxes },
	{ name: "Salary", href: "/salary", icon: DollarSign },
	{ name: "Balance Transfer", href: "/balance-transfer", icon: ArrowLeftRight },
	{ name: "Reports", href: "/reports", icon: BarChart3 },
	{ name: "System Setup", href: "/system", icon: Settings },
	{ name: "Users", href: "/users", icon: UserCog },
	{ name: "Settings", href: "/settings", icon: Settings },
	{ name: "Quotation", href: "/quotation", icon: ShoppingBag },
];

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
	return (
		<motion.div
			initial={{ width: isOpen ? 256 : 64 }}
			animate={{ width: isOpen ? 256 : 64 }}
			transition={{ duration: 0.3 }}
			className="fixed top-0 left-0 z-40 h-full bg-white border-r border-gray-200 shadow-lg dark:bg-gray-800 dark:border-gray-700"
		>
			{/* Header */}
			<div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
				{isOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="flex items-center space-x-2"
					>
						<div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-lg">
							<Package className="w-5 h-5 text-white" />
						</div>
						<span className="text-xl font-bold text-gray-900 dark:text-white">
							Inflame Inventory
						</span>
					</motion.div>
				)}
				<button
					onClick={onToggle}
					className="p-1 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
				>
					{isOpen ? (
						<ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					) : (
						<ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					)}
				</button>
			</div>

			{/* Navigation */}
			<nav className="p-4 space-y-2 overflow-y-auto h-[calc(100%-85px)] scrollbar-hidden">
				{navigation.map((item) => (
					<NavLink
						key={item.name}
						to={item.href}
						className={({ isActive }) =>
							`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
								isActive
									? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
									: "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
							}`
						}
						ref={(node) => {
							if (node && node.classList.contains("bg-blue-50")) {
								// 👇 auto-scroll to active item
								node.scrollIntoView({ behavior: "smooth", block: "center" });
							}
						}}
					>
						<item.icon className="flex-shrink-0 w-5 h-5" />
						{isOpen && (
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="font-medium"
							>
								{item.name}
							</motion.span>
						)}
					</NavLink>
				))}
			</nav>
		</motion.div>
	);
};
