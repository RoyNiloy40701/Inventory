import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
	Plus,
	Search,
	Filter,
	Edit,
	Trash2,
	Eye,
	Download,
} from "lucide-react";
import { api } from "../../api";
import { formatDateTime } from "../../utils/dateFormatter";

const fetchVoucher = async () => {
	try {
		const response = await fetch(api.allVoucher, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch vouchers");
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error("Error fetching vouchers:", error);
		return [];
	}
};

export const VouchersList: React.FC = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedType, setSelectedType] = useState("all");
	const [selectedStatus, setSelectedStatus] = useState("all");
	const [vouchers, setVouchers] = useState<any[]>([]);

	const deleteVoucher = async (id: number) => {
		try {
			const response = await fetch(`${api.voucher}/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			});
			if (!response.ok) throw new Error("Delete failed");
			setVouchers((prevVoucher) =>
				prevVoucher.filter((voucher) => voucher._id !== id)
			);
		} catch (error) {
			console.error("Error deleting voucher:", error);
		}
	};

	useEffect(() => {
		const loadVoucher = async () => {
			const data = await fetchVoucher();
			setVouchers(data);
		};
		loadVoucher();
	}, []);

	const filteredVouchers = vouchers?.filter((voucher) => {
		const matchesSearch = "abc";
		// voucher?.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
		// voucher?.voucherType.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesType = selectedType === "all" || voucher.type === selectedType;
		const matchesStatus =
			selectedStatus === "all" || voucher.status === selectedStatus;
		return matchesSearch && matchesType && matchesStatus;
	});

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "rejected":
				return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
		}
	};

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
						Vouchers
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage payment, receipt, and journal vouchers
					</p>
				</div>
				<button
					onClick={() => navigate("/vouchers/new")}
					className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					<Plus className="w-4 h-4 mr-2" />
					New Voucher
				</button>
			</motion.div>

			{/* Stats Cards */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-4">
				{[
					{
						label: "Total Vouchers",
						value: "3",
						change: "This month",
						color: "text-blue-600",
					},
					{
						label: "Payments",
						value: "$2,500.00",
						change: "1 voucher",
						color: "text-red-600",
					},
					{
						label: "Receipts",
						value: "$1,325.00",
						change: "1 voucher",
						color: "text-green-600",
					},
					{
						label: "Pending",
						value: "1",
						change: "Needs approval",
						color: "text-yellow-600",
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
								placeholder="Search vouchers..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div className="flex gap-4">
						<select
							value={selectedType}
							onChange={(e) => setSelectedType(e.target.value)}
							className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Types</option>
							<option value="payment">Payment</option>
							<option value="receipt">Receipt</option>
							<option value="journal">Journal</option>
						</select>
						<select
							value={selectedStatus}
							onChange={(e) => setSelectedStatus(e.target.value)}
							className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Status</option>
							<option value="approved">Approved</option>
							<option value="pending">Pending</option>
							<option value="rejected">Rejected</option>
						</select>
						<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</button>
					</div>
				</div>
			</motion.div>

			{/* Vouchers Table */}
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
									Voucher No
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Voucher Type
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Employee
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Reference
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Amount
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Status
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Date
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredVouchers?.map((voucher, index) => (
								<motion.tr
									key={voucher._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
									className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{voucher?.invoice}
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{voucher?.voucherType === "credit"
												? "Credit Voucher"
												: voucher?.voucherType === "supplier"
												? "Supplier Pay"
												: voucher?.voucherType === "debit"
												? "Debit Voucher"
												: voucher?.voucherType}
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											{voucher?.employeeName}
										</div>
									</td>
									<td className="max-w-xs px-6 py-4 text-sm text-gray-500 truncate dark:text-gray-400">
										<span style={{ whiteSpace: "pre-line" }}>
											{voucher?.reference}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											<span style={{ whiteSpace: "pre-line" }}>
												{voucher?.totalAmount}
											</span>
										</div>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<span
											className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
												voucher?.status
											)}`}
										>
											{voucher?.status}
										</span>
									</td>

									<td className="px-6 py-4 whitespace-nowrap">
										<div className="text-sm font-medium text-gray-900 dark:text-white">
											<span style={{ whiteSpace: "pre-line" }}>
												{formatDateTime(voucher?.voucherDate)}
											</span>
										</div>
									</td>

									<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
										<div className="flex items-center justify-end space-x-2">
											<button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
												<Eye className="w-4 h-4" />
											</button>
											<button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
												<Download className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													navigate(`/vouchers/${voucher._id}/edit`)
												}
												className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
											>
												<Edit className="w-4 h-4" />
											</button>
											<button
												onClick={() => deleteVoucher(voucher?._id)}
												className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
											>
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
