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

  if (loading) return <p className="text-center py-12">Loading...</p>;
  if (!returnData)
    return <p className="text-center py-12 text-red-500">Return not found.</p>;

  const formatCurrency = (value: number) => `$${value?.toFixed(2)}`;
  const matchedSupplier = supplier.find(
    (s: any) => s._id === returnData.sup_id
  );

  return (
    <div className=" px-6 py-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Purchase Return Invoice
        </h1>

        {/* Right-side buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition flex items-center"
          >
            <ArrowLeft className="w-4 h-4 inline-block mr-2" /> Back
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
            className="px-4 py-2 border border-green-500 text-green-700 rounded-lg hover:bg-green-50 transition flex items-center"
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
        className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
      >
        {/* Top 3 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b border-gray-300 dark:border-gray-600 pb-4">
          {/* Company Info */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
              Company Info
            </h2>
            <p className="text-gray-700 dark:text-gray-300">
              Inflame Solutions Ltd.
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              House-16 Rd 101, Dhaka 1212
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Gulshan Pink City Shopping Complex
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              Email: info@example.com
            </p>
          </div>

          {/* Return Details */}
          <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
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
          <div className="border-l border-gray-300 dark:border-gray-600 pl-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
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
        <div className="overflow-x-auto mb-8">
          <table className="w-full text-sm border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
            <thead className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
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
                    className="border-t dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
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
              <tr className="border-t dark:border-gray-700 font-semibold bg-gray-50 dark:bg-gray-800">
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
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Signature 1 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="text-gray-700 dark:text-gray-300 mb-1 border-b border-gray-700 w-32"></span>{" "}
            {/* Signature line */}
            <span className="text-gray-900 dark:text-white font-medium mt-2">
              Checked By
            </span>
          </div>

          {/* Signature 2 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="text-gray-700 dark:text-gray-300 mb-1 border-b border-gray-700 w-32"></span>
            <span className="text-gray-900 dark:text-white font-medium mt-2">
              Prepared By
            </span>
          </div>

          {/* Signature 3 */}
          <div className="flex flex-col items-center bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <span className="mb-8"></span> {/* Gap for signature */}
            <span className="text-gray-700 dark:text-gray-300 mb-1 border-b border-gray-700 w-32"></span>
            <span className="text-gray-900 dark:text-white font-medium mt-2">
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
