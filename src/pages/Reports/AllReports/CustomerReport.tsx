import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download, Calendar, Filter, Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useDropdowns } from "../../../contexts/DropDownContext";
import { api } from "../../../api";
import { formatDateTime } from "../../../utils/dateFormatter";
import { ReportExport } from "../../../components/Report/ReportExport";

const months = [
    { id: 1, month: "January" },
    { id: 2, month: "February" },
    { id: 3, month: "March" },
    { id: 4, month: "April" },
    { id: 5, month: "May" },
    { id: 6, month: "June" },
    { id: 7, month: "July" },
    { id: 8, month: "August" },
    { id: 9, month: "September" },
    { id: 10, month: "October" },
    { id: 11, month: "November" },
    { id: 12, month: "December" },
];

const years = [
    { id: 1, year: 2020 },
    { id: 2, year: 2021 },
    { id: 3, year: 2022 },
    { id: 4, year: 2023 },
    { id: 5, year: 2024 },
    { id: 6, year: 2025 },
    { id: 7, year: 2026 },
    { id: 8, year: 2027 },
    { id: 9, year: 2028 },
    { id: 10, year: 2029 },
    { id: 11, year: 2030 },
];



const fetchPurchase = async (filters: any) => {
    try {
        const queryParams = new URLSearchParams(filters).toString();

        const response = await fetch(`${api.allCustomer}?${queryParams}`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
        });

        if (!response.ok) throw new Error("Failed to fetch customer report");

        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(error);
        return [];
    }
};

const schema = yup.object({
    reportType: yup.string().required("Report type is required"),
    month: yup.string().required("Month type is required"),
    year: yup.string().required("Year type is required"),
    startDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .typeError("Date must be a valid date")
        .required("Date is required"),
    endDate: yup
        .date()
        .transform((value, originalValue) => (originalValue === "" ? null : value))
        .typeError("Date must be a valid date")
        .required("Date is required"),

    accountId: yup.string().required("Account No is required"),
    customerName: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const CustomerReport: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [purchase, setPurchase] = useState<any[]>([]);
    const [filteredPurchase, setFilteredPurchase] = useState<any[]>([]);

    const {
        register,
        handleSubmit,
        watch,
        reset,
        control,

        formState: { errors, isSubmitting },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            reportType: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
            customerName: "",
            
        },
    });
    const reportType = watch("reportType");
    const startDate = watch("startDate");
    const endDate = watch("endDate");
    const month = watch("month");
    const year = watch("year");

    useEffect(() => {
        const filtered = purchase.filter((p) => {
            // Search filter
            const search = searchTerm.toLowerCase();
            const matchesSearch =
                !search ||
                p.customerName?.toLowerCase().includes(search) ||
                p.mobile?.toLowerCase().includes(search)

            return matchesSearch;
        });

        setFilteredPurchase(filtered);
    }, [searchTerm, purchase]);

    useEffect(() => {
        const fetchFilteredSuppliers = async () => {
            if (!reportType) return; // nothing selected

            const filters: any = { reportType };
            if (reportType === "daily") {
                filters.startDate = startDate;
                filters.endDate = endDate;
            }
            if (reportType === "monthly") {
                filters.month = month;
                filters.year = year;
            }
            if (reportType === "yearly") {
                filters.year = year;
            }

            const data = await fetchPurchase(filters);
            setPurchase(data);
        };

        fetchFilteredSuppliers();
    }, [reportType, startDate, endDate, month, year]);
    // re-run whenever any watched field changes

    useEffect(() => {
        const loadPurchase = async () => {
            const data = await fetchPurchase();
            setPurchase(data);
        };
        loadPurchase();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="flex items-center space-x-4"
            >
                <button
                    onClick={() => navigate("/reports")}
                    className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                       Customer Reports
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Comprehensive business insights and performance metrics
                    </p>
                </div>
            </motion.div>

            {/* Filters */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
                <div className="flex flex-col gap-4 md:flex-row">
                    <div className="flex flex-col gap-2">
                        <span className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                            Report Type
                        </span>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="daily"
                                    {...register("reportType")}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                Daily Report
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="monthly"
                                    {...register("reportType")}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                Monthly Report
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    value="yearly"
                                    {...register("reportType")}
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                Yearly Report
                            </label>
                        </div>
                        {errors.reportType && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.reportType.message}
                            </p>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-6 mt-5 md:grid-cols-3">
                    {reportType === "daily" && (
                        <>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Start Date *
                                </label>
                                <input
                                    {...register("startDate")}
                                    type="date"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                {errors.startDate && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.startDate.message}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    End Date *
                                </label>
                                <input
                                    {...register("endDate")}
                                    type="date"
                                    className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                                />
                                {errors.endDate && (
                                    <p className="mt-1 text-sm text-red-600">
                                        {errors.endDate.message}
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                    {reportType === "monthly" && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Month *
                            </label>
                            <select
                                {...register("month")}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select month </option>
                                {months?.map((month) => (
                                    <option key={month?.id} value={month?.id}>
                                        {month?.month}
                                    </option>
                                ))}
                            </select>
                            {errors.month && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.month.message}
                                </p>
                            )}
                        </div>
                    )}
                    {(reportType === "monthly" || reportType === "yearly") && (
                        <div>
                            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Year*
                            </label>
                            <select
                                {...register("year")}
                                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                            >
                                <option value="">Select year</option>
                                {years?.map((year) => (
                                    <option key={year?.id} value={year?.year}>
                                        {year?.year}
                                    </option>
                                ))}
                            </select>
                            {errors.year && (
                                <p className="mt-1 text-sm text-red-600">
                                    {errors.year.message}
                                </p>
                            )}
                        </div>
                    )}
                </div>
                {/* Form Actions */}
                {(reportType === "monthly" ||
                    reportType === "yearly" ||
                    reportType === "daily") && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="flex items-center justify-end mt-4 space-x-4"
                    >
                        <button
                            type="button"
                            onClick={() => reset()}
                            className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                            Reset
                        </button>
                    </motion.div>
                )}
            </motion.div>

            {/* Summary Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 }}
                className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            Summary
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Detailed breakdown
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <div className="relative">
                            <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <ReportExport fileName="purchase-report" tableId="purchaseTable" />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table id="purchaseTable" className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    #SN
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Name
                                </th>
                                
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Mobile
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Opening
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Sales
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Paid
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Payment
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Return
                                </th>
                                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                                    Due
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredPurchase?.map((data, index) => (
                                <tr
                                    key={index}
                                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                        {index + 1}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.customerName}
                                    </td>
                                    
                                    <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap dark:text-green-400">
                                        {data?.mobile}
                                    </td>
                                    
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.openingBalance.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.totalSales.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.paidAmount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.totalPaidFromVoucher.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.totalPaidFromVoucher.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                                        {data?.totalDue.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};
