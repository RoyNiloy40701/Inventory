import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Filter, Edit, Trash2, Eye } from "lucide-react";
import { api } from "../../api";
import axios from "axios";
export interface Product {
  _id: string;
  productName: string;
  productcode: string;
  quantity: string;
  categoryID: number;
  pprice: number;
  sprice: number;
  warranty: string;
  status: string;
  image: string;
}
interface Category {
	_id: string;
	categoryName: string;
	// Add other fields if needed
}

export const ProductList: React.FC = () => {
	const navigate = useNavigate();

	const [products, setProducts] = useState<Product[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [searchTerm, setSearchTerm] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("all");
	const [categories, setCategories] = useState<Category[]>([]);

	const token = localStorage?.getItem("auth_token");
	const axiosInstance = axios.create({
		baseURL: "http://localhost:5000/api/",
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});

	useEffect(() => {
		const delayDebounce = setTimeout(() => {
			const fetchProducts = async () => {
				try {
					setLoading(true);
					let query = "";
					if (searchTerm) {
						query += `?search=${encodeURIComponent(searchTerm)}`;
					}

					const res = await axiosInstance.get(api.allProduct + query);
					setProducts(res.data);
					setError(null);
				} catch (err: any) {
					setError(err.message || "Unknown error");
				} finally {
					setLoading(false);
				}
			};

			fetchProducts();
		}, 500);

		return () => clearTimeout(delayDebounce);
	}, [searchTerm]);

	const handleDelete = async (id: string) => {
		const confirmDelete = window.confirm(
			"Are you sure you want to delete this product?"
		);
		if (!confirmDelete) return;

		try {
			await axiosInstance.delete(`product/product/${id}`);
			alert("✅ Product deleted successfully");
			setProducts((prev) => prev.filter((product) => product._id !== id));
		} catch (error) {
			console.error("❌ Error deleting product:", error);
			alert("Failed to delete product. Please try again.");
		}
	};

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const res = await axiosInstance.get("category/all_category");
				// Fix: Use res.data.data for categories array
				setCategories(res.data.data);
			} catch (err: any) {
				console.error("Category fetch error:", err.message);
			}
		};

		fetchCategories();
	}, []);

	const filteredProducts = products.filter((product) => {
		const matchesSearch =
			product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			product.productcode.toLowerCase().includes(searchTerm.toLowerCase());

		const productCategory = categories.find(
			(cat) => cat._id === String(product.categoryID)
		);

		const matchesCategory =
			selectedCategory === "all" ||
			productCategory?.categoryName.toLowerCase() ===
				selectedCategory.toLowerCase();

		return matchesSearch && matchesCategory;
	});

  return (
    <div className="p-4 space-y-6">
{/* Header */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="flex items-center justify-between"
>
  <div>
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Products
    </h1>
    <p className="text-gray-600 dark:text-gray-400">
      Manage your product inventory
    </p>
  </div>

  {/* Button group */}
  <div className="flex space-x-2">
    <button
      onClick={() => navigate("/products/new")}
      className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Product
    </button>

    <button
      onClick={() => navigate("/productStock")}
      className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Store Product
    </button>
        <button
      onClick={() => navigate("/productDamage")}
      className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
    >
      <Plus className="w-4 h-4 mr-2" />
      Damage Product
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
					<div className="relative flex-1">
						<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
						<input
							type="text"
							placeholder="Search by name or code..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
					<select
						value={selectedCategory}
						onChange={(e) => setSelectedCategory(e.target.value)}
						className="px-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
					>
						<option value="all">All Categories</option>
						{categories.map((cat) => (
							<option key={cat._id} value={cat.categoryName.toLowerCase()}>
								{cat.categoryName}
							</option>
						))}
					</select>

					<button className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
						<Filter className="w-4 h-4 mr-2" />
						Filter
					</button>
				</div>
			</motion.div>

			{/* Loading/Error */}
			{loading && (
				<p className="text-center text-gray-600 dark:text-gray-300">
					Loading products...
				</p>
			)}
			{error && (
				<p className="text-center text-red-600 dark:text-red-400">
					Error: {error}
				</p>
			)}

      {/* Products Table */}
      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="overflow-hidden bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Product
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Code
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    quantity
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Category
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Purchase Price
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Sale Price
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-xs font-medium tracking-wider text-right text-gray-500 uppercase dark:text-gray-400">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredProducts.map((product, index) => (
                  <motion.tr
                    key={product._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="transition-colors hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={
                            "http://localhost:5000" + product.image ||
                            "https://via.placeholder.com/40"
                          }
                          alt={product.productName}
                          className="object-cover w-10 h-10 mr-3 rounded-lg"
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {product.productName}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Warranty: {product.warranty}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {product.productcode}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {product.quantity}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap dark:text-gray-400">
                      {categories.find(
                        (cat) => cat._id === String(product.categoryID)
                      )?.categoryName || "Unknown"}
                    </td>

										<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
											${product.pprice.toFixed(2)}
										</td>
										<td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap dark:text-white">
											${product.sprice.toFixed(2)}
										</td>
										<td className="px-6 py-4 whitespace-nowrap">
											<span
												className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
													product.status.toLowerCase() === "active"
														? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
														: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
												}`}
											>
												{product.status}
											</span>
										</td>
										<td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
											<div className="flex items-center justify-end space-x-2">
												<button
													onClick={() => navigate(`/products/${product._id}`)}
													className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
													title="View"
												>
													<Eye className="w-4 h-4" />
												</button>

												<button
													onClick={() =>
														navigate(`/products/${product._id}/edit`)
													}
													className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
													title="Edit"
												>
													<Edit className="w-4 h-4" />
												</button>
												<button
													type="button"
													onClick={() => handleDelete(product._id)}
													className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
													title="Delete"
												>
													<Trash2 className="w-4 h-4" />
												</button>
											</div>
										</td>
									</motion.tr>
								))}

								{filteredProducts.length === 0 && (
									<tr>
										<td
											colSpan={7}
											className="py-4 text-center text-gray-500 dark:text-gray-400"
										>
											No products found.
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</motion.div>
			)}
		</div>
	);
};
