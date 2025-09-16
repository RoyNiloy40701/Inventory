import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calculator, Search } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useDropdowns } from "../../contexts/DropDownContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object().shape({
  returnDate: yup.date().required("Return Date is required"),
  items: yup.array().of(
    yup.object().shape({
      productID: yup.string().required(),
      quantity: yup
        .number()
        .min(0, "Invalid qty")
        .required("Return quantity is required"),
      unitPrice: yup.number().positive().required(),
      subtotal: yup.number(),
      maxQty: yup.number(),
    })
  ),
  note: yup.string().nullable(),
  totalAmount: yup.number(),
});

export const PurchaseReturnForm: React.FC = () => {
  const navigate = useNavigate();
  const [challanNo, setChallanNo] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [purchase, setPurchase] = useState<any>(null);

  const { product, mobileAccounts, bankAccounts, cashAccounts } =
    useDropdowns();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      returnDate: new Date().toISOString().slice(0, 10),
      items: [],
      totalAmount: 0,
      note: "",
    },
  });

  const { fields } = useFieldArray({ control, name: "items" });
  const watchItems = watch("items") || [];

  // Determine account name based on purchase type
  const getAccountName = () => {
    if (!purchase) return "";

    let accounts: any[] = [];
    switch (purchase.accountType) {
      case "Cash":
        accounts = cashAccounts;
        break;
      case "Bank":
        accounts = bankAccounts;
        break;
      case "Mobile":
        accounts = mobileAccounts;
        break;
      default:
        return purchase.accountNo || "";
    }

    const matched = accounts.find((acc) => acc._id === purchase.accountNo);
    return matched ? matched.accountName : purchase.accountNo || "";
  };

  // Auto-calc subtotal & total
  useEffect(() => {
    let total = 0;
    watchItems.forEach((item, idx) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const subtotal = qty * price;
      total += subtotal;
      setValue(`items.${idx}.subtotal`, subtotal, { shouldValidate: true });
    });
    setValue("totalAmount", total, { shouldValidate: true });
  }, [JSON.stringify(watchItems), setValue]);

  // Fetch purchase by challan
  const handleSearch = async () => {
    setLoading(true);
    setSearchError("");
    const token = localStorage.getItem("auth_token");

    try {
      const res = await fetch(
        `http://localhost:5000/api/purchaseReturn/search?challanNo=${encodeURIComponent(
          challanNo
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      if (!json.data) {
        setSearchError("Purchase not found!");
        setPurchase(null);
      } else {
        setPurchase(json.data);

        const items = json.data.products.map((p: any) => {
          const alreadyReturned = json.data.purchaseReturns?.reduce(
            (sum: number, r: any) =>
              sum +
              r.products.reduce(
                (rpSum: number, rp: any) =>
                  rp.productID === p.productID ? rpSum + rp.quantity : rpSum,
                0
              ),
            0
          );

          const remainingQty = p.quantity - alreadyReturned;

          return {
            productID: p.productID,
            quantity: 0,
            unitPrice: p.productPrice,
            subtotal: 0,
            maxQty: remainingQty < 0 ? 0 : remainingQty,
          };
        });

        setValue("items", items);
      }
    } catch (err) {
      console.error(err);
      setSearchError("Error fetching purchase!");
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const onSubmit = async (data: any) => {
    if (!purchase) return;

    const purchaseReturn = {
      compid: purchase.compid,
      sup_id: purchase.supplier,
      rid: null,
      invoice: purchase.challanNo,
      totalPrice: data?.totalAmount,
      paidAmount: purchase.paidAmount,
      scharge: "0",
      sctype: "None",
      scAmount: 0,
      accountType: purchase.accountType || null,
      accountNo: purchase.accountNo || null,
      note: purchase.note || null,
      status: "Active",
      regby: purchase.regby,
      upby: purchase.upby,
      returnDate: data.returnDate || new Date(),
    };

    const rawReturnProducts = data.items
      .filter((item: any) => item.quantity > 0)
      .map((item: any) => ({
        productID: item.productID,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
        maxQty: item.maxQty - item.quantity,
      }));

    try {
      const response = await fetch(
        "http://localhost:5000/api/purchaseReturn/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(purchaseReturn),
        }
      );

      const result = await response.json();
      if (!response.ok)
        throw new Error(result.message || "Failed to create purchase return");

      const purchaseReturnID = result.purchase._id;

      const returnProducts = rawReturnProducts.map((product: any) => ({
        ...product,
        purchaseReturnID,
      }));

      const productsResponse = await fetch(
        "http://localhost:5000/api/purchaseReturnProduct/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(returnProducts),
        }
      );

      const productsResult = await productsResponse.json();
      if (!productsResponse.ok)
        throw new Error(
          productsResult.message || "Failed to create return products"
        );

      // Update stock for each returned product
      await Promise.all(
        returnProducts.map(async (product: any) => {
          const stockPayload = {
            compid: user?.compId,
            productID: product.productID,
            quantity: product.quantity,
            regby: user?.role,
          };

          const stockRes = await fetch("http://localhost:5000/api/stocks/out", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify(stockPayload),
          });

          const stockResult = await stockRes.json();
          if (!stockRes.ok)
            throw new Error(stockResult.message || "Failed to update stock");

          console.log(
            `✅ Stock updated for product ${product.productID}:`,
            stockResult
          );
        })
      );

      // ✅ Navigate after successful submission
      navigate("/purchase-return");
    } catch (error: any) {
      console.error("❌ Error:", error.message || error);
    }
  };

  return (
    <motion.div
      className="p-6 bg-white"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-xl font-bold">Purchase Return</h2>

      {/* Search Section */}
      <div className="flex items-center gap-2 mb-4 ">
        <input
          className="flex-1 p-2 border rounded"
          type="text"
          placeholder="Challan No (e.g. Inv-INF00002)"
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

      {loading && <p>Loading...</p>}
      {searchError && <p className="text-red-500">{searchError}</p>}

      {purchase && (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Supplier Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label>Supplier</label>
              <input
                className="w-full p-2 border rounded"
                value={purchase.sCompany}
                disabled
              />
            </div>
            <div>
              <label>Challan No</label>
              <input
                className="w-full p-2 border rounded"
                value={purchase.challanNo}
                disabled
              />
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label>Return Date</label>
            <input
              type="date"
              {...register("returnDate")}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-red-500">{errors.returnDate?.message}</p>
          </div>

          {/* Products Table */}
          <div>
            <h3 className="mb-2 font-semibold">Products</h3>
            <table className="w-full border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">Product</th>
                  <th className="p-2 border">Return Qty</th>
                  <th className="p-2 border">Unit Price</th>
                  <th className="p-2 border">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {fields.map((field, idx) => {
                  const matchedProduct = product.find(
                    (p: any) => p._id === field.productID
                  );

                  return (
                    <tr key={field.id}>
                      <td className="border p-2">
                        {matchedProduct
                          ? `${matchedProduct.productName} (${matchedProduct.productcode})`
                          : field.productID}
                      </td>
                      <td className="border p-2">
                        {watchItems[idx]?.maxQty === 0 ? (
                          <span className="text-red-500 text-sm">
                            Max return reached
                          </span>
                        ) : (
                          <input
                            type="number"
                            {...register(`items.${idx}.quantity`, {
                              valueAsNumber: true,
                              min: 0,
                              max: watchItems[idx]?.maxQty || 0,
                            })}
                            className="w-20 border p-1 rounded"
                            min={0}
                            max={watchItems[idx]?.maxQty || 0}
                          />
                        )}
                        <span className="ml-2 text-xs text-gray-500">
                          / {watchItems[idx]?.maxQty}
                        </span>
                      </td>
                      <td className="border p-2">
                        <input
                          type="number"
                          {...register(`items.${idx}.unitPrice`)}
                          className="w-24 border p-1 rounded"
                          disabled
                        />
                      </td>
                      <td className="border p-2">
                        {Number(watchItems[idx]?.subtotal || 0).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Total Amount */}
          <div>
            <label>Total Amount</label>
            <input
              {...register("totalAmount")}
              className="w-full p-2 border rounded"
              disabled
              value={Number(watch("totalAmount") || 0).toFixed(2)}
            />
          </div>

          {/* Account Info */}
          <div className="grid grid-cols-2 gap-4 mt-2">
            <div>
              <label>Payment Method</label>
              <input
                className="w-full p-2 border rounded"
                value={purchase.accountType}
                disabled
              />
            </div>
            <div>
              <label>Account Name</label>
              <input
                className="w-full p-2 border rounded"
                value={getAccountName()}
                disabled
              />
            </div>
          </div>

          {/* Note */}
          <div>
            <label>Note</label>
            <textarea
              {...register("note")}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className={`w-full flex items-center justify-center p-2 rounded text-white ${
              watchItems.every((item) => item.maxQty === 0)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={watchItems.every((item) => item.maxQty === 0)}
          >
            <Calculator className="mr-2" /> Submit Return
          </button>
        </form>
      )}
    </motion.div>
  );
};
