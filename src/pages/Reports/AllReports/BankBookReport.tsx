import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api";
import { ReportExport } from "../../../components/Report/ReportExport";

const fetchPurchase = async (filters: any) => {
  try {
    const response = await fetch(`${api.allBankAccount}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch suppliers");

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const BankBookReport: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [purchase, setPurchase] = useState<any[]>([]);
  const [filteredPurchase, setFilteredPurchase] = useState<any[]>([]);

  useEffect(() => {
    const filtered = purchase.filter((p) => {
      const search = searchTerm.toLowerCase();
  
      const accountNameMatch = p.accountName?.toLowerCase().includes(search);
      const accountNoMatch = p.accountNo ? String(p.accountNo).toLowerCase().includes(search) : false;
  
      return !search || accountNameMatch || accountNoMatch;
    });
  
    setFilteredPurchase(filtered);
  }, [searchTerm, purchase]);

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
           Bank Book Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive business insights and performance metrics
          </p>
        </div>
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
             Bank Account Summary
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
                  Account No
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                  Balance
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
                    {data?.accountName}
                  </td>

                  <td className="px-6 py-4 text-sm font-medium text-green-600 whitespace-nowrap dark:text-green-400">
                    {data?.accountNo}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap dark:text-white">
                    {data?.balance.toFixed(2)}
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
