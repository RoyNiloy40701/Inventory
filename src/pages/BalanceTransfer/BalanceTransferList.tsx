import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	Search,
	Filter,
	Edit,
	Trash2,
	Eye,
	ArrowRightLeft,
} from "lucide-react";

const mockTransfers = [
	{
		id: 1,
		transferNumber: "BT-2024-001",
		date: "2024-01-15",
		fromAccount: "Cash Account",
		toAccount: "Bank Account - Main",
		amount: 5000.0,
		description: "Cash deposit to bank",
		reference: "DEP001",
		status: "completed",
		processedBy: "John Doe",
	},
	{
		id: 2,
		transferNumber: "BT-2024-002",
		date: "2024-01-14",
		fromAccount: "Bank Account - Main",
		toAccount: "Petty Cash",
		amount: 500.0,
		description: "Petty cash replenishment",
		reference: "PC002",
		status: "pending",
		processedBy: "Jane Smith",
	},
	{
		id: 3,
		transferNumber: "BT-2024-003",
		date: "2024-01-13",
		fromAccount: "Savings Account",
		toAccount: "Bank Account - Main",
		amount: 10000.0,
		description: "Transfer from savings for operations",
		reference: "SAV003",
		status: "completed",
		processedBy: "Mike Johnson",
	},
];

export const BalanceTransferList: React.FC = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedStatus, setSelectedStatus] = useState("all");

	const filteredTransfers = mockTransfers.filter((transfer) => {
		const matchesSearch =
			transfer.transferNumber
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			transfer.fromAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transfer.toAccount.toLowerCase().includes(searchTerm.toLowerCase()) ||
			transfer.description.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesStatus =
			selectedStatus === "all" || transfer.status === selectedStatus;
		return matchesSearch && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "completed":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "cancelled":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

	const totalTransfers = filteredTransfers.reduce(
		(sum, transfer) => sum + transfer.amount,
		0
	);
	const completedTransfers = filteredTransfers
		.filter((t) => t.status === "completed")
		.reduce((sum, transfer) => sum + transfer.amount, 0);
	const pendingTransfers = filteredTransfers
		.filter((t) => t.status === "pending")
		.reduce((sum, transfer) => sum + transfer.amount, 0);

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
						Balance Transfers
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage account-to-account transfers
					</p>
				</div>
				<button
					onClick={() => navigate("/balance-transfer/new")}
					className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					<Plus className="w-4 h-4 mr-2" />
					New Transfer
				</button>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				{[
					{
						label: "Total Transfers",
						value: `$${totalTransfers.toFixed(2)}`,
						change: "This month",
						color: "text-blue-600",
					},
					{
						label: "Completed",
						value: `$${completedTransfers.toFixed(2)}`,
						change: `${
							filteredTransfers.filter((t) => t.status === "completed").length
						} transfers`,
						color: "text-green-600",
					},
					{
						label: "Pending",
						value: `$${pendingTransfers.toFixed(2)}`,
						change: `${
							filteredTransfers.filter((t) => t.status === "pending").length
						} transfers`,
						color: "text-yellow-600",
					},
					{
						label: "Total Count",
						value: filteredTransfers.length.toString(),
						change: "All time",
						color: "text-purple-600",
					},
				].map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
					>
						<p className="text-sm text-gray-600 dark:text-gray-400">
							{stat.label}
						</p>
						<p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
							{stat.value}
						</p>
						<p className={`text-sm ${stat.color} mt-1`}>{stat.change}</p>
					</motion.div>
				))}
			</div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
							<input
								type="text"
								placeholder="Search transfers..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div className="flex gap-4">
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Status</option>
							<option value="completed">Completed</option>
							<option value="pending">Pending</option>
							<option value="cancelled">Cancelled</option>
						</select>
						<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</button>
					</div>
				</div>
			</motion.div>

			{/* Transfers Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.5 }}
				className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Transfer
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Accounts
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Amount
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Description
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Status
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Processed By
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredTransfers.map((transfer, index) => (
								<motion.tr
									key={transfer.id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
									className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div>
											<div className="text-sm font-medium text-gray-900 dark:text-white">
												{transfer.transferNumber}
											</div>
											<div className="text-sm text-gray-500 dark:text-gray-400">
												{transfer.date}
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center space-x-2">
											<div className="text-sm text-gray-900 dark:text-white">
												<div className="font-medium">
													{transfer.fromAccount}
												</div>
												<div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
													<ArrowRightLeft className="w-3 h-3 mr-1" />
													<span className="text-xs">{transfer.toAccount}</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-bold text-gray-900 dark:text-white">
											${transfer.amount.toFixed(2)}
										</div>
										{transfer.reference && (
											<div className="text-sm text-gray-500 dark:text-gray-400">
												Ref: {transfer.reference}
											</div>
										)}
									</td>
									<td className="max-w-xs px-6 py-4 text-sm text-gray-500 truncate dark:text-gray-400">
										{transfer.description}
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
												transfer.status
											)}`}
										>
											{transfer.status}
										</span>
									</td>
									<td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
										{transfer.processedBy}
									</td>
									<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
										<div className="flex items-center justify-end space-x-2">
											<button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
												<Eye className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													navigate(`/balance-transfer/${transfer.id}/edit`)
												}
												className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
											>
												<Edit className="w-4 h-4" />
											</button>
											<button className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
												<Trash2 className="w-4 h-4" />
											</button>
										</div>
									</td>
								</motion.tr>
							))}
						</tbody>
					</table>
				</div>
			</motion.div>
		</div>
	);
};
