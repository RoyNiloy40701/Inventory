import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { useDropdowns } from "../../contexts/DropDownContext";
import { useAuth } from "../../contexts/AuthContext";
import axios from "axios";

// ✅ Validation schema
const schema = yup.object({
  productId: yup.string().required("Product selection is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .required("Quantity is required"),
});

type FormData = yup.InferType<typeof schema>;

const ProductStock: React.FC = () => {
  const navigate = useNavigate();
  const { product } = useDropdowns();
  const { user  } = useAuth();
  


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: { productId: "", quantity: 0 },
  });

const onSubmit = async (data: FormData) => {
  const payload: any = {
    compid: user?.compId, 
    quantity: data.quantity,
    productID: data.productId,
    regby:user?.role,
  };

  console.log("Updating stock:", payload);

  try {
    const token = localStorage.getItem("token"); 
    const res = await axios.post(
      "http://localhost:5000/api/stocks/in",
      payload,
      {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
      }
    );
    if (res.status === 200) {
      console.log("Stock updated:", res.data);
      reset();
      navigate("/products");
    }
  } catch (error: any) {
    console.error("Error updating stock:", error.response?.data || error.message);
  }
};

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
          onClick={() => navigate("/products")}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Update Product Stock
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Select a product and enter stock adjustment
          </p>
        </div>
      </motion.div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Stock Information
          </h2>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Product Dropdown */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Product *
              </label>
              <select
                {...register("productId")}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">-- Select a Product --</option>
                {product?.map((p: any) => (
                  <option key={p._id} value={p._id}>
                    {p.productName}
                  </option>
                ))}
              </select>
              {errors.productId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.productId.message}
                </p>
              )}
            </div>

            {/* Quantity Input */}
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Quantity *
              </label>
              <input
                {...register("quantity")}
                type="number"
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter quantity"
              />
              {errors.quantity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.quantity.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate("/products")}
            className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : null}
            Update Stock
          </button>
        </motion.div>
      </form>
    </div>
  );
};

export default ProductStock;
