import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Download,
  Calendar,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const salesData = [
  { month: "Jan", sales: 12000, purchases: 8000, profit: 4000 },
  { month: "Feb", sales: 15000, purchases: 9500, profit: 5500 },
  { month: "Mar", sales: 18000, purchases: 11000, profit: 7000 },
  { month: "Apr", sales: 22000, purchases: 13000, profit: 9000 },
  { month: "May", sales: 25000, purchases: 15000, profit: 10000 },
  { month: "Jun", sales: 28000, purchases: 16500, profit: 11500 },
];
const reports = [
  {
    title: "Sales Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/sales",
  },
  {
    title: "Purchase Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/purchase",
  },
  {
    title: "SaleWise Profit Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/saleWiseProfit",
  },
  {
    title: "Product Wise Profit Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/productWiseProfit",
  },
  {
    title: "Expense Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/expense",
  },
  {
    title: "Supplier Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/supplier",
  },
  {
    title: "Customer Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/customer",
  },
  {
    title: "Customer Due Report ",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/customerDue",
  },
  {
    title: "Mobile Book",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/mobileBook",
  },
  {
    title: "Cash Book",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/cashBook",
  },
  {
    title: "Due Payment Report",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/duePayment",
  },
  {
    title: "Bank Book",
    value: "$120,000",
    icon: DollarSign,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
    href: "/reports/bankBook",
  },
  {
    title: "Total Sales",
    value: "1,247",
    change: "+8.2%",
    trend: "up",
    icon: ShoppingCart,
    color: "text-blue-600",
    bgColor: "bg-blue-100 dark:bg-blue-900/20",
    href: "/system/category",
  },
  {
    title: "Products Sold",
    value: "3,456",
    change: "+15.3%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    href: "/system/category",
  },
  {
    title: "Active Customers",
    value: "892",
    change: "-2.1%",
    trend: "down",
    icon: Users,
    color: "text-orange-600",
    bgColor: "bg-orange-100 dark:bg-orange-900/20",
    href: "/system/category",
  },
  {
    title: "Stock Report",
    value: "3,456",
    change: "+15.3%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    href: "/reports/stocks",
  },
  {
    title: "Purchase Return Report",
    value: "3,456",
    change: "+15.3%",
    trend: "up",
    icon: Package,
    color: "text-purple-600",
    bgColor: "bg-purple-100 dark:bg-purple-900/20",
    href: "/reports/purchaseReturn",
  },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#3B82F6" },
  { name: "Clothing", value: 25, color: "#10B981" },
  { name: "Books", value: 20, color: "#F59E0B" },
  { name: "Home & Garden", value: 15, color: "#EF4444" },
  { name: "Sports", value: 5, color: "#8B5CF6" },
];

const topProducts = [
  { name: "iPhone 15 Pro", sales: 150, revenue: 149850 },
  { name: "Samsung Galaxy S24", sales: 120, revenue: 107988 },
  { name: "MacBook Air M3", sales: 85, revenue: 110499 },
  { name: 'iPad Pro 12.9"', sales: 95, revenue: 94905 },
  { name: "AirPods Pro", sales: 200, revenue: 49800 },
];

export const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState("6months");
  const [reportType, setReportType] = useState("overview");
  const navigate = useNavigate();
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
            Reports & Analytics
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive business insights and performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </button>
          <button className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </button>
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
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="overview">Business Overview</option>
              <option value="sales">Sales Report</option>
              <option value="purchases">Purchase Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="financial">Financial Report</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Time Period
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="3months">Last 3 Months</option>
              <option value="6months">Last 6 Months</option>
              <option value="1year">Last Year</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
              <Filter className="w-4 h-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Revenue",
            value: "$120,000",
            change: "+12.5%",
            trend: "up",
            icon: DollarSign,
            color: "text-green-600",
            bgColor: "bg-green-100 dark:bg-green-900/20",
          },
          {
            title: "Total Sales",
            value: "1,247",
            change: "+8.2%",
            trend: "up",
            icon: ShoppingCart,
            color: "text-blue-600",
            bgColor: "bg-blue-100 dark:bg-blue-900/20",
          },
          {
            title: "Products Sold",
            value: "3,456",
            change: "+15.3%",
            trend: "up",
            icon: Package,
            color: "text-purple-600",
            bgColor: "bg-purple-100 dark:bg-purple-900/20",
          },
          {
            title: "Active Customers",
            value: "892",
            change: "-2.1%",
            trend: "down",
            icon: Users,
            color: "text-orange-600",
            bgColor: "bg-orange-100 dark:bg-orange-900/20",
          },
        ].map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </p>
                <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
            <div className="flex items-center mt-4">
              {kpi.trend === "up" ? (
                <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
              )}
              <span
                className={`text-sm font-medium ${
                  kpi.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {kpi.change}
              </span>
              <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                vs last period
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {reports?.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
            onClick={() => navigate(kpi?.href)}
            className="p-6 bg-white border border-gray-200 shadow-sm cursor-pointer dark:bg-gray-800 rounded-xl dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {kpi.title}
                </p>
                <p className="mt-1 font-bold text-gray-900 text-md dark:text-white">
                  {kpi.value}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sales vs Purchases Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales vs Purchases
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly comparison over 6 months
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
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
                <Bar dataKey="sales" fill="#3B82F6" name="Sales" />
                <Bar dataKey="purchases" fill="#10B981" name="Purchases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Profit Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Profit Trend
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Monthly profit analysis
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="month"
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
                  dataKey="profit"
                  stroke="#F59E0B"
                  strokeWidth={3}
                  dot={{ fill: "#F59E0B", strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Category Distribution and Top Products */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Category Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Sales by Category
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Product category distribution
              </p>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Top Selling Products
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Best performing products by revenue
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full dark:bg-blue-900/20">
                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {product.sales} units sold
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900 dark:text-white">
                    ${product.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Revenue
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

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
              Monthly Summary
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed breakdown by month
            </p>
          </div>
          <button className="flex items-center px-4 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Month
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Sales
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Purchases
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Profit
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Margin
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {salesData.map((data, index) => (
                <tr
                  key={data.month}
                  className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {data.month} 2024
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    ${data.sales.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    ${data.purchases.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap dark:text-green-400">
                    ${data.profit.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    {((data.profit / data.sales) * 100).toFixed(1)}%
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
