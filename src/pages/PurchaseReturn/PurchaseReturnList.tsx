import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Eye, Trash2, Search } from "lucide-react";
import { useDropdowns } from "../../contexts/DropDownContext";

export const PurchaseReturnList: React.FC = () => {
  const navigate = useNavigate();
  const [returns, setReturns] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedSupplier, setSelectedSupplier] = useState("all");
  const { supplier } = useDropdowns();
  const [selectedDate, setSelectedDate] = useState("");

  useEffect(() => {
    const fetchReturns = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch("http://localhost:5000/api/purchaseReturn", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();

        const mapped = data.map((r: any) => {
          const supplierObj = supplier.find((s: any) => s._id === r.sup_id);
          return {
            _id: r._id,
            returnNo: r.rid || "—",
            sup_id: r.sup_id || "—",
            sup_name: supplierObj ? supplierObj.compName : "—",
            returnDate: r.returnDate,
            totalAmount: r.totalPrice,
            invoice: r.invoice,
            status: r.status.toLowerCase(),
          };
        });

        setReturns(mapped);
      } catch (err) {
        console.error("Error fetching purchase returns:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReturns();
  }, [supplier]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this return?")) return;
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch(
        `http://localhost:5000/api/purchaseReturn/delete/${id}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );
      if (res.ok) {
        setReturns((prev) => prev.filter((r) => r._id !== id));
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete return.");
      }
    } catch (err) {
      alert("Error deleting return.");
      console.error(err);
    }
  };

  const filteredReturns = returns.filter((r) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      r._id.toLowerCase().includes(term) ||
      r.invoice.toLowerCase().includes(term) ||
      r.sup_name.toLowerCase().includes(term);

    const matchesStatus =
      selectedStatus === "all" || r.status === selectedStatus.toLowerCase();

    const matchesSupplier =
      selectedSupplier === "all" || r.sup_id === selectedSupplier;

    const matchesDate =
      !selectedDate ||
      new Date(r.returnDate).toLocaleDateString() ===
        new Date(selectedDate).toLocaleDateString();

    return matchesSearch && matchesStatus && matchesSupplier && matchesDate;
  });

	const getStatusColor = (status: string) => {
		switch (status?.toLowerCase()) {
			case "paid":
				return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
			case "pending":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
			case "overdue":
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
						Purchase Returns
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage purchase return invoices
					</p>
				</div>
				<button
					onClick={() => navigate("/purchase-return/new")}
					className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
				>
					New Return
				</button>
			</motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search returns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Status & Supplier Filters */}
          <div className="flex gap-4 flex-wrap">
            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>

            {/* Supplier Filter */}
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Suppliers</option>
              {supplier.map((s: any) => (
                <option key={s._id} value={s._id}>
                  {s.compName}
                </option>
              ))}
            </select>

            {/* Date Filter */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </motion.div>

      {/* Returns Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
      >
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-center py-12">Loading...</p>
          ) : filteredReturns.length === 0 ? (
            <p className="text-center py-12 text-gray-400">No returns found.</p>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Invoice No
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Supplier
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredReturns.map((r, index) => (
                  <motion.tr
                    key={`${r._id}-${index}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 * index }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">{r.invoice}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.sup_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {r.returnDate
                        ? new Date(r.returnDate).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${r.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                      <button
                        onClick={() => navigate(`/purchase-return/${r._id}`)}
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
};
