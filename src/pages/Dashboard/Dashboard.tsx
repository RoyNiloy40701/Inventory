import React from "react";
import { motion } from "framer-motion";
import { DashboardStats } from "./components/DashboardStats";
import { SalesChart } from "./components/SalesChart";
import { RecentTransactions } from "./components/RecentTransactions";
import { LowStockAlert } from "./components/LowStockAlert";
import { QuickActions } from "./components/QuickActions";

export const Dashboard: React.FC = () => {
	return (
		<div className="space-y-6">
			{/* Page Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
			>
				<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
					Dashboard
				</h1>
				<p className="text-gray-600 dark:text-gray-400">
					Welcome back! Here's what's happening with your inventory.
				</p>
			</motion.div>

			{/* Stats Cards */}
			<DashboardStats />

			{/* Charts and Quick Actions */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				<div className="lg:col-span-2">
					<SalesChart />
				</div>
				<div>
					<QuickActions />
				</div>
			</div>

			{/* Recent Activity */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<RecentTransactions />
				<LowStockAlert />
			</div>
		</div>
	);
};
