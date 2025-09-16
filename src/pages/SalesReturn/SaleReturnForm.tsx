import React, { useState } from "react";
import { Search } from "lucide-react";

export default function SaleReturnSearch() {
  const [challanNo, setChallanNo] = useState("");
  const [saleData, setSaleData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!challanNo) {
      alert("Please enter invoice number");
      return;
    }

    setLoading(true);
    setError("");
    setSaleData(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/salesReturn/search?invoice=${encodeURIComponent(
          challanNo
        )}`
      );
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong");
      } else {
        setSaleData(data.data);
      }
    } catch (err) {
      setError("Error fetching invoice: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      {/* Search Input */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          placeholder="Invoice No (e.g. Inv-INF00002)"
          value={challanNo}
          onChange={(e) => setChallanNo(e.target.value)}
        />
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <Search size={18} className="mr-2" /> Search
        </button>
      </div>

      {/* Loading/Error */}
      {loading && <p className="mt-4 text-gray-500">Searching...</p>}
      {error && <p className="mt-4 text-red-500">{error}</p>}

      {/* Sale Details */}
      {saleData && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50">
          <h2 className="text-lg font-semibold mb-2">
            Invoice: {saleData.invoice_no}
          </h2>
          <p><strong>Date:</strong> {new Date(saleData.saleDate).toLocaleDateString()}</p>
          <p><strong>Customer:</strong> {saleData.customerName} ({saleData.cMobile})</p>
          <p><strong>Address:</strong> {saleData.cAddress}</p>
          <p><strong>Total Amount:</strong> {saleData.totalAmount}</p>
          <p><strong>Paid:</strong> {saleData.paidAmount}</p>
          <p><strong>Due:</strong> {saleData.dueAmount}</p>

          {/* Products */}
          <h3 className="text-md font-semibold mt-4">Products</h3>
          <table className="w-full mt-2 border">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="p-2 border">Product ID</th>
                <th className="p-2 border">Price</th>
                <th className="p-2 border">Qty</th>
                <th className="p-2 border">Total</th>
              </tr>
            </thead>
            <tbody>
              {saleData.products.map((prod) => (
                <tr key={prod._id} className="border-b">
                  <td className="p-2 border">{prod.productID}</td>
                  <td className="p-2 border">{prod.sPrice}</td>
                  <td className="p-2 border">{prod.quantity}</td>
                  <td className="p-2 border">{prod.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
