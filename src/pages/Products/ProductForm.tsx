import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Upload } from "lucide-react";
import axiosInstance from "../../axiosInstance";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object({
	productName: yup
		.string()
		.max(50, "Product Name must be at most 50 characters")
		.required("Product Name is required"),

	productcode: yup
		.string()
		.max(30, "Product Code must be at most 30 characters")
		.nullable(),

	supplier: yup.string().required("Supplier is required"),
	categoryID: yup.string().nullable(),

	scid: yup.number().typeError("Subcategory ID must be a number").nullable(),

	unit: yup.string().nullable(),

	pprice: yup
		.number()
		.typeError("Purchase Price must be a number")
		.required("Purchase Price is required"),

	sprice: yup.number().typeError("Selling Price must be a number").nullable(),

	warranty: yup
		.string()
		.max(50, "Warranty must be at most 50 characters")
		.nullable(),

	status: yup
		.string()
		.max(10, "Status must be at most 10 characters")
		.required("Status is required"),

	image: yup
		.string()
		.max(500, "Image path must be at most 500 characters")
		.nullable(),

	regby: yup.string().nullable(),

	regdate: yup.date().default(() => new Date()),

	upby: yup.string().nullable(),

	update: yup.date().default(() => new Date()),
});

type FormData = yup.InferType<typeof schema>;

export const ProductForm: React.FC = () => {
	const navigate = useNavigate();
	const { id } = useParams();

	const isEdit = Boolean(id);
	const [selectedImages, setSelectedImages] = useState<File[]>([]);
	const { user } = useAuth();
	const [categories, setCategories] = useState<
		{ _id: string; categoryName: string }[]
	>([]);
	const [suppliers, setSuppliers] = useState<
		{ _id: number; sup_id: string; supplierName: string }[]
	>([]);
	const [units, setUnits] = useState<{ _id: string; unitName: string }[]>([]);

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const { data } = await axiosInstance.get("category/all_category");
				setCategories(data.data || []);
			} catch (error) {
				console.error("Error fetching categories:", error);
			}
		};

		const fetchSuppliers = async () => {
			try {
				const { data } = await axiosInstance.get("supplier/all_supplier");
				setSuppliers(data.data || []);
			} catch (error) {
				console.error("Error fetching suppliers:", error);
			}
		};

		const fetchUnits = async () => {
			try {
				const { data } = await axiosInstance.get("unit/all_units");
				setUnits(data.data || []);
			} catch (error) {
				console.error("Error fetching units:", error);
			}
		};

		fetchCategories();
		fetchSuppliers();
		fetchUnits();
	}, []);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: yupResolver(schema),
		defaultValues: isEdit
			? {
					productName: "iPhone 15 Pro",
					productcode: "IP15P-128",
					categoryID: "1", // string or null
					supplier: 101, // number
					scid: null, // optional subcategory
					unit: 1, // number
					pprice: 750.0, // number
					sprice: 999.99, // number or null
					warranty: "1 year", // string or null
					status: "active", // string, required
					image: "https://example.com/iphone15pro.jpg", // string or null
					regby: null, // string or null
					regdate: new Date(), // auto default
					upby: null,
					update: new Date(),
			  }
			: {},
	});
	useEffect(() => {
		const fetchProductData = async () => {
			if (!isEdit || !id) return;

			try {
				const response = await axiosInstance.get(`/product/product/${id}`);
				const product = response.data?.data;

				if (product) {
					reset({
						productName: product.productName || "",
						productcode: product.productcode || "",
						categoryID: product.categoryID || "",
						supplier: product.supplier || "",
						scid: product.scid ?? null,
						unit: product.unit || "",
						pprice: product.pprice || 0,
						sprice: product.sprice ?? null,
						warranty: product.warranty ?? null,
						status: product.status || "inactive",
						image: product.image || "",
						regby: product.regby || null,
						upby: product.upby || null,
					});
				}
			} catch (error) {
				console.error("Failed to fetch product for editing:", error);
			}
		};

		fetchProductData();
	}, [id, isEdit, reset]);

	const onSubmit = async (data: FormData) => {
		try {
			const formData = new FormData();
			const excludedKeys = ["regby", "upby"];

			Object.entries(data).forEach(([key, value]) => {
				if (
					value !== null &&
					value !== undefined &&
					!excludedKeys.includes(key)
				) {
					formData.append(key, value.toString());
				}
			});
			if (user?.compId) {
				formData.append("compid", user.compId.toString());
			}
			if (!isEdit && user?.id) {
				formData.append("regby", user.id);
			}
			if (user?.id) {
				formData.set("upby", user.id);
			}
			if (selectedImages.length > 0) {
				formData.append("image", selectedImages[0]);
			}

			const url = isEdit ? `product/product/${id}` : "product/product";
			const method = isEdit ? "put" : "post";

			const response = await axiosInstance({
				method,
				url,
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			});

			console.log("Response:", response.data);
			navigate("/products");
		} catch (error: any) {
			console.error("Submit error:", error.response?.data || error.message);
		}
	};

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		setSelectedImages((prev) => [...prev, ...files]);
	};

	const removeImage = (index: number) => {
		setSelectedImages((prev) => prev.filter((_, i) => i !== index));
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
						{isEdit ? "Edit Product" : "Add New Product"}
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						{isEdit
							? "Update product information"
							: "Enter product details to add to inventory"}
					</p>
				</div>
			</motion.div>

			<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
				{/* Basic Information */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Basic Information
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						{/* productName */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Product Name *
							</label>
							<input
								{...register("productName")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter product name"
							/>
							{errors.productName && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.productName.message}
								</p>
							)}
						</div>

						{/* productcode */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Product Code
							</label>
							<input
								{...register("productcode")}
								type="text"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="Enter product code"
							/>
							{errors.productcode && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.productcode.message}
								</p>
							)}
						</div>

						{/* categoryID */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Category
							</label>
							<select
								{...register("categoryID")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select category</option>
								{categories.map((cat) => (
									<option key={cat._id} value={cat._id}>
										{cat?.categoryName}
									</option>
								))}
							</select>
							{errors.categoryID && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.categoryID.message}
								</p>
							)}
						</div>

						{/* supplier */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Supplier *
							</label>
							<select
								{...register("supplier")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select supplier</option>
								{suppliers.map((sup) => (
									<option key={sup._id} value={sup.sup_id}>
										{sup.supplierName}
									</option>
								))}
							</select>
							{errors.supplier && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.supplier.message}
								</p>
							)}
						</div>
					</div>
				</motion.div>

				{/* Pricing & Inventory */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Pricing & Inventory
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
						{/* sprice */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Selling Price
							</label>
							<input
								{...register("sprice")}
								type="number"
								step="0.01"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="0.00"
							/>
							{errors.sprice && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.sprice.message}
								</p>
							)}
						</div>

						{/* pprice */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Purchase Price *
							</label>
							<input
								{...register("pprice")}
								type="number"
								step="0.01"
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
								placeholder="0.00"
							/>
							{errors.pprice && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.pprice.message}
								</p>
							)}
						</div>

						{/* unit */}
						<div>
							<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
								Unit
							</label>
							<select
								{...register("unit")}
								className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
							>
								<option value="">Select unit</option>
								{units.map((unit) => (
									<option key={unit._id} value={unit._id}>
										{unit.unitName}
									</option>
								))}
							</select>
							{errors.unit && (
								<p className="mt-1 text-sm text-red-600 dark:text-red-400">
									{errors.unit.message}
								</p>
							)}
						</div>
					</div>
				</motion.div>

				{/* Status */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.3 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<div>
						<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
							Status *
						</label>
						<select
							{...register("status")}
							className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						>
							<option value="">Select status</option>
							<option value="active">Active</option>
							<option value="inactive">Inactive</option>
						</select>
						{errors.status && (
							<p className="mt-1 text-sm text-red-600 dark:text-red-400">
								{errors.status.message}
							</p>
						)}
					</div>
				</motion.div>

				{/* Images */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.4 }}
					className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
				>
					<h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
						Product Images
					</h2>
					<div className="p-6 text-center border-2 border-gray-300 border-dashed rounded-lg dark:border-gray-600">
						<Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
						<p className="mb-2 text-gray-600 dark:text-gray-400">
							Drag and drop images here, or click to select
						</p>
						<input
							type="file"
							multiple
							accept="image/*"
							onChange={handleImageUpload}
							className=""
							id="image-upload"
						/>
						<label
							htmlFor="image-upload"
							className="inline-flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-700"
						>
							Select Images
						</label>
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
						{isSubmitting && (
							<div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
						)}
						{isEdit ? "Update Product" : "Submit Product"}
					</button>
				</motion.div>
			</form>
		</div>
	);
};
