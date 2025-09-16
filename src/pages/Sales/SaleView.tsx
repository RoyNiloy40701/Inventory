import  { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { ArrowLeft } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import SalePDF from "./SalePDF";

const SaleView = () => {
  const { id } = useParams<{ id: string }>();
  const [sale, setSale] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
		console.log(id)
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/sale/sale/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      })
      .then((res) => {
        setSale(res.data.data);
        setProducts(res.data.data.products || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!sale) return <div>Sale not found</div>;

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button
        onClick={() => navigate("/sales")}
        className="flex items-center gap-2 p-2 mb-4 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <span>Back</span>
      </button>

      {/* Invoice Card */}
      <div className="p-8 space-y-8 bg-white border border-gray-200 shadow-xl dark:bg-gray-900 rounded-2xl dark:border-gray-700">
        {/* Header */}
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Invoice #{sale.invoice_no}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Date: {new Date(sale.saleDate).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Company Name
            </h2>
            <p className="text-gray-600 dark:text-gray-400">Company Address</p>
            <p className="text-gray-600 dark:text-gray-400">+880123456789</p>
          </div>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              Bill To:
            </h2>
            <p className="font-medium">{sale.customerName}</p>
            <p>{sale.cMobile}</p>
            <p>{sale.cAddress}</p>
          </div>
          <div className="text-right">
            <p>
              <strong>Status:</strong>{" "}
              <span className="px-2 py-1 text-sm font-medium text-white bg-green-600 rounded-md">
                {sale.sstatus ?? "Pending"}
              </span>
            </p>
          </div>
        </div>

        {/* Products Table */}
        <div>
          <table className="w-full text-sm border border-collapse border-gray-300 dark:border-gray-700">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr className="text-left">
                <th className="px-3 py-2 border">#</th>
                <th className="px-3 py-2 border">Product</th>
                <th className="px-3 py-2 border">Warranty</th>
                <th className="px-3 py-2 border text-right">Unit Price</th>
                <th className="px-3 py-2 border text-center">Qty</th>
                <th className="px-3 py-2 border text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, index) => (
                <tr key={p._id} className="border-b dark:border-gray-700">
                  <td className="px-3 py-2 border">{index + 1}</td>
                  <td className="px-3 py-2 border">{p.productName}</td>
                  <td className="px-3 py-2 border">{p.warranty || "N/A"}</td>
                  <td className="px-3 py-2 border text-right">{p.sPrice}</td>
                  <td className="px-3 py-2 border text-center">{p.quantity}</td>
                  <td className="px-3 py-2 border text-right">{p.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex justify-end">
          <div className="w-1/3 p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div className="flex justify-between mb-2">
              <span>Subtotal:</span>
              <span>{sale.totalAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>VAT:</span>
              <span>{sale.vAmount}</span>
            </div>
			<div className="flex justify-between mb-2">
              <span>Discount:</span>
              <span>{sale.discountAmount}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span>Paid:</span>
              <span>{sale.pAmount}</span>
            </div>
            <div className="flex justify-between text-lg font-bold">
              <span>Due:</span>
              <span>{sale.dueAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end">
        {sale && (
          <PDFDownloadLink
            document={<SalePDF sale={sale} products={products} />}
            fileName={`Sale-${sale.invoice_no}.pdf`}
          >
            {({ loading }) => (
              <button className="px-6 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700">
                {loading ? "Generating PDF..." : "Download Invoice"}
              </button>
            )}
          </PDFDownloadLink>
        )}
      </div>
    </div>
  );
};

export default SaleView;
