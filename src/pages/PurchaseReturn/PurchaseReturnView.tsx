import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useDropdowns } from "../../contexts/DropDownContext";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PurchaseReturnPDF } from "./PurchaseReturnPDF";

export const PurchaseReturnView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [returnData, setReturnData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { product, supplier } = useDropdowns();

  useEffect(() => {
    const fetchReturn = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        const res = await fetch(
          `http://localhost:5000/api/purchaseReturn/with-products/${id}`,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
        if (!res.ok) throw new Error("Failed to fetch return");
        const data = await res.json();
        setReturnData(data);
      } catch (err) {
        console.error("Error fetching return:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReturn();
  }, [id]);

  if (loading) return <p className="py-12 text-center">Loading...</p>;
  if (!returnData)
    return <p className="py-12 text-center text-red-500">Return not found.</p>;

  const formatCurrency = (value: number) => `$${value?.toFixed(2)}`;
  const matchedSupplier = supplier.find(
    (s: any) => s._id === returnData.sup_id
  );

  return (
    <div className="px-6 py-6 ">
      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Purchase Return Invoice
        </h1>

        {/* Right-side buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center px-4 py-2 text-gray-700 transition border border-gray-300 rounded-lg dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="inline-block w-4 h-4 mr-2" /> Back
          </button>

          <PDFDownloadLink
            document={
              <PurchaseReturnPDF
                returnData={returnData}
                product={product}
                supplier={supplier}
                formatCurrency={(val) => `$${val?.toFixed(2)}`}
              />
            }
            fileName={`purchase_return_${returnData._id}.pdf`}
            className="flex items-center px-4 py-2 text-green-700 transition border border-green-500 rounded-lg hover:bg-green-50"
          >
            Download PDF
          </PDFDownloadLink>
        </div>
      </div>

      {/* Invoice Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-white border border-gray-200 shadow-lg dark:bg-gray-900 rounded-xl dark:border-gray-700"
      >
        {/* Top 3 Columns */}
        <div className="grid grid-cols-1 gap-6 pb-4 mb-8 border-b border-gray-300 md:grid-cols-3 dark:border-gray-600">
          {/* Company Info */}
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Company Info
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              ABC Solutions Ltd.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              House-12 Rd 15, Dhaka 1212
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Bashundhara Residential Area
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: info@example.com
            </p>
          </div>

          {/* Return Details */}
          <div className="pl-4 border-l border-gray-300 dark:border-gray-600">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Return Details
            </h2>
            <DetailItem label="Return ID" value={returnData._id} />
            <DetailItem label="Invoice No" value={returnData.invoice || "—"} />
            <DetailItem
              label="Return Date"
              value={new Date(returnData.returnDate).toLocaleDateString()}
            />
          </div>

          {/* Supplier Info */}
          <div className="pl-4 border-l border-gray-300 dark:border-gray-600">
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white">
              Supplier Info
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              {matchedSupplier?.compName || returnData.sup_id}
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              {matchedSupplier?.supplierName || returnData.sup_id}
            </p>
            {matchedSupplier?.email && (
              <p className="text-gray-600 dark:text-gray-400">
                Email: {matchedSupplier.email}
              </p>
            )}
            {matchedSupplier?.mobile && (
              <p className="text-gray-600 dark:text-gray-400">
                Phone: {matchedSupplier.mobile}
              </p>
            )}
          </div>
        </div>

        {/* Products Table with Totals */}
        <div className="mb-8 overflow-x-auto">
          <table className="w-full overflow-hidden text-sm border border-gray-200 rounded-lg dark:border-gray-600">
            <thead className="text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
              <tr>
                <th className="px-4 py-2 text-left border">#</th>
                <th className="px-4 py-2 text-left border">Product</th>
                <th className="px-4 py-2 text-left border">Quantity</th>
                <th className="px-4 py-2 text-left border">Unit Price</th>
                <th className="px-4 py-2 text-left border">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {returnData.products.map((item: any, idx: number) => {
                const matchedProduct = product.find(
                  (p: any) => p._id === item.productID
                );
                return (
                  <tr
                    key={item._id}
                    className="transition-colors border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-4 py-2 border">{idx + 1}</td>
                    <td className="px-4 py-2 border">
                      {matchedProduct
                        ? `${matchedProduct.productName} (${matchedProduct.productcode})`
                        : item.productID || "—"}
                    </td>
                    <td className="px-4 py-2 border">{item.quantity}</td>
                    <td className="px-4 py-2 border">
                      {formatCurrency(item.unitPrice)}
                    </td>
                    <td className="px-4 py-2 border">
                      {formatCurrency(item.quantity * item.unitPrice)}
                    </td>
                  </tr>
                );
              })}

              {/* Totals Rows */}
              <tr className="font-semibold border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                <td colSpan={2} className="px-4 py-2 text-right border">
                  Total:
                </td>
                <td className="px-4 py-2 border">
                  {returnData.products.reduce(
                    (sum: number, item: any) => sum + item.quantity,
                    0
                  )}
                </td>
                <td className="px-4 py-2 border"></td>
                <td className="px-4 py-2 border">
                  {formatCurrency(returnData.totalPrice)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Signatures & Return Info */}
        <div className="grid grid-cols-1 gap-6 mt-8 md:grid-cols-3">
          {/* Signature 1 */}
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="w-32 mb-1 text-gray-700 border-b border-gray-700 dark:text-gray-300"></span>{" "}
            {/* Signature line */}
            <span className="mt-2 font-medium text-gray-900 dark:text-white">
              Checked By
            </span>
          </div>

          {/* Signature 2 */}
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="w-32 mb-1 text-gray-700 border-b border-gray-700 dark:text-gray-300"></span>
            <span className="mt-2 font-medium text-gray-900 dark:text-white">
              Prepared By
            </span>
          </div>

          {/* Signature 3 */}
          <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="w-32 mb-1 text-gray-700 border-b border-gray-700 dark:text-gray-300"></span>
            <span className="mt-2 font-medium text-gray-900 dark:text-white">
              Approved By
            </span>
          </div>
        </div>

        {/* Optional third signature row can be added below if needed */}
      </motion.div>
    </div>
  );
};

// Utility component
const DetailItem: React.FC<{ label: string; value: string | number }> = ({
  label,
  value,
}) => (
  <div className="mb-2">
    <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-base font-medium text-gray-900 dark:text-white">
      {value}
    </p>
  </div>
);
