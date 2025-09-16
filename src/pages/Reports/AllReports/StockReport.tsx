import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDropdowns } from "../../../contexts/DropDownContext";

const StockReport: React.FC = () => {
  const [stocks, setStocks] = useState<any[]>([]);
  const [search, setSearch] = useState("");
    const { product } = useDropdowns();

useEffect(() => {
  const fetchStocks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/stocks", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      setStocks(res.data);
    } catch (err) {
      console.error("Error fetching stocks:", err);
    }
  };
  fetchStocks();
}, []);


  const filteredStocks = stocks.filter(
    (s) =>
      s.productID?.toLowerCase().includes(search.toLowerCase()) ||
      s.compid?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inventory Stock Report</h1>

      <input
        type="text"
        placeholder="Search by ProductID or CompanyID..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-4 px-3 py-2 border rounded-lg w-full md:w-1/3"
      />

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 rounded-lg">
          <thead className="bg-gray-100">
            <tr className="text-center">
              <th className="p-2 border">#SN</th>
              <th className="p-2 border">ProductID</th>
              <th className="p-2 border">CompanyID</th>
              <th className="p-2 border">Total Pices</th>
              <th className="p-2 border">Damaged</th>
              <th className="p-2 border"> Stock In</th>
              <th className="p-2 border">Available Stock</th>



            </tr>
          </thead>
<tbody>
  {filteredStocks.map((stock, index) => {
    const productName = product?.find(p => p._id === stock.productID)?.productName || stock.productID;

    return (
      <tr key={stock._id} className="text-center border-t">
        <td className="p-2 border">{index + 1}</td>
        <td className="p-2 border">{productName}</td>
        <td className="p-2 border">{stock.compid}</td>
        <td className="p-2 border">{stock.totalPices}</td>
        <td className="p-2 border">{stock.dtquantity || 0}</td>
        <td className="p-2 border">{stock.stockIn || 0}</td>
        <td className="p-2 border">
          {stock.totalPices - (stock.dtquantity || 0)}
        </td>
      </tr>
    );
  })}
</tbody>

        </table>
      </div>
    </div>
  );
};

export default StockReport;
