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
	ArrowLeft,
} from "lucide-react";
import { api } from "../../api";
import { formatDateTime } from "../../utils/dateFormatter";

const fetchDepartment = async () => {
	try {
		const response = await fetch(api.allDepartment, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch departments");
		}

		const result = await response.json();
		return result.data;
	} catch (error) {
		console.error("Error fetching departments:", error);
		return [];
	}
};

export const DepartmentList: React.FC = () => {
	const navigate = useNavigate();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [departments, setDepartments] = useState<any[]>([]);

	const deleteDepartment = async (id: number) => {
		try {
			const response = await fetch(`${api.department}/${id}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			});

			if (!response.ok) throw new Error("Delete failed");
			setDepartments((prevDepartments) =>
				prevDepartments.filter((department) => department._id !== id)
			);
		} catch (error) {
			console.error("Error deleting department:", error);
			alert("Error deleting department");
		}
	};

	useEffect(() => {
		const loadDepartments = async () => {
			const data = await fetchDepartment();
			setDepartments(data);
		};
		loadDepartments();
	}, []);

	const filteredDepartments = departments.filter((department) => {
		const term = searchTerm.toLowerCase();
		const matchesSearch =
			department.dept_name?.toLowerCase().includes(term) ||
			department.status?.toLowerCase().includes(term);

		const matchesCategory =
			selectedCategory === "all" ||
			department.status?.toLowerCase() === selectedCategory.toLowerCase();

		return matchesSearch && matchesCategory;
	});

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center justify-between"
			>
				<div className="flex items-center space-x-4">
					<button
						onClick={() => navigate("/system")}
						className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						<ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</button>
					<div>
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
							Department
						</h1>
						<p className="text-gray-600 dark:text-gray-400">
							Manage your department List
						</p>
					</div>
				</div>

				<button
					onClick={() => navigate("/department/new")}
					className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					<Plus className="w-4 h-4 mr-2" />
					Add Department
				</button>
			</motion.div>

			{/* Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.1 }}
				className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="flex flex-col gap-4 md:flex-row">
					<div className="flex-1">
						<div className="relative">
							<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
							<input
								type="text"
								placeholder="Search department..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							/>
						</div>
					</div>
					<div className="flex gap-4">
						<select
							value={selectedCategory}
							onChange={(e) => setSelectedCategory(e.target.value)}
							className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="all">All Categories</option>
							<option value="Active">Active</option>
							<option value="InActive">InActive</option>
						</select>
						<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
							<Filter className="w-4 h-4 mr-2" />
							Filter
						</button>
					</div>
				</div>
			</motion.div>

			{/* Unit Table */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.2 }}
				className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
			>
				<div className="overflow-x-auto">
					<table className="w-full">
						<thead className="bg-gray-50 dark:bg-gray-700">
							<tr>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Name
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Status
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Created At
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
									Updated At
								</th>
								<th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200 dark:divide-gray-700">
							{filteredDepartments?.map((department, index) => (
								<motion.tr
									key={department._id}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
									className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
								>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div>
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													{department?.dept_name}
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<span className="inline-flex px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded-full dark:bg-green-900/20 dark:text-green-400">
											{department?.status}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div>
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													<span style={{ whiteSpace: "pre-line" }}>
														{formatDateTime(department?.regdate)}
													</span>
												</div>
											</div>
										</div>
									</td>
									<td className="px-6 py-4 whitespace-nowrap">
										<div className="flex items-center">
											<div>
												<div className="text-sm font-medium text-gray-900 dark:text-white">
													<span style={{ whiteSpace: "pre-line" }}>
														{formatDateTime(department?.update)}
													</span>
												</div>
											</div>
										</div>
									</td>

									<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
										<div className="flex items-center justify-end space-x-2">
											<button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
												<Eye className="w-4 h-4" />
											</button>
											<button
												onClick={() =>
													navigate(`/department/${department?._id}/edit`)
												}
												className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
											>
												<Edit className="w-4 h-4" />
											</button>
											<button
												onClick={() => deleteDepartment(department?._id)}
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
