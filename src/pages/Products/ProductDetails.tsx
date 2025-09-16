import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { ArrowLeft } from "lucide-react";
import axiosInstance from "../../axiosInstance";

interface Product {
	productID: string;
	productName: string;
	productcode: string;
	categoryID: string;
	categoryName?: string;
	compid: string;
	supplier: string;
	scid: string | null;
	unit: string;
	unitName?: string;
	pprice: string;
	sprice: string;
	warranty: string;
	status: string;
	image: string;
	fpshow: string;
	regby: string;
	regdate: string;
	upby: string | null;
	update: string;
	totalPices?: string;
}

const ProductDetails: React.FC = () => {
	const { id } = useParams<{ id: string }>();
	const navigate = useNavigate();
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id) return;

		const fetchProduct = async () => {
			try {
				setLoading(true);
				const res = await axiosInstance.get(`/product/product/${id}`);
				setProduct(res.data.data);
				console.log("Fetched product:", res.data.data);
				setError(null);
			} catch (err: any) {
				setError(err.message || "Failed to fetch product details");
			} finally {
				setLoading(false);
			}
		};

		fetchProduct();
	}, [id]);

	if (loading)
		return (
			<p className="p-8 text-center text-gray-600 dark:text-gray-300">
				Loading product details...
			</p>
		);
	if (error)
		return (
			<p className="p-8 text-center text-red-600 dark:text-red-400">
				Error: {error}
			</p>
		);
	if (!product) return <p className="p-8 text-center">Product not found.</p>;

	// Helper formatters
	const formatPrice = (price: string) => {
		const num = Number(price);
		return isNaN(num) ? "N/A" : `৳${num.toFixed(2)}`;
	};

	const formatDate = (dateStr: string | null) => {
		if (!dateStr) return "N/A";
		const d = new Date(dateStr);
		return isNaN(d.getTime()) ? "N/A" : d.toLocaleDateString();
	};

	const displayValue = (val: string | null | undefined) =>
		val === null || val === undefined || val === "" ? "N/A" : val;

	return (
		<motion.div
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4 }}
			className="max-w-5xl p-6 mx-auto bg-white shadow-lg dark:bg-gray-900 rounded-xl"
		>
			{/* Back Button */}
			<button
				onClick={() => navigate(-1)}
				className="inline-flex items-center px-4 py-2 mb-6 text-gray-700 transition bg-gray-100 rounded-md dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-300"
			>
				<ArrowLeft className="w-5 h-5 mr-2" />
				Back to Products
			</button>

			<div className="flex flex-col gap-8 md:flex-row">
				{/* Image */}
				<div className="flex-shrink-0 w-full overflow-hidden border border-gray-200 rounded-lg shadow-md md:w-1/3 dark:border-gray-700">
					<img
						src={"http://localhost:5000" + product.image}
						alt={product.productName}
						className="object-cover w-full h-full"
						loading="lazy"
					/>
				</div>
				{/* Details */}
				<div className="flex flex-col justify-between flex-1">
					{/* Title and Category */}
					<div>
						<h1 className="mb-2 text-4xl font-extrabold text-gray-900 dark:text-white">
							{product.productName}
						</h1>
						<p className="mb-6 text-gray-500 dark:text-gray-400">
							Category:{" "}
							<span className="font-semibold text-gray-700 dark:text-gray-300">
								{product.categoryName ?? product.categoryID}
							</span>
						</p>

						{/* Grid with info */}
						<div className="grid grid-cols-1 gap-6 text-gray-700 sm:grid-cols-2 md:grid-cols-3 dark:text-gray-300">
							<InfoRow label="Product Code" value={product.productcode} />
							<InfoRow label="Company ID" value={product.compid} />
							<InfoRow
								label="Supplier"
								value={displayValue(product.supplier)}
							/>
							<InfoRow
								label="Subcategory ID"
								value={displayValue(product.scid)}
							/>
							<InfoRow
								label="Unit"
								value={
									product.unitName
										? `${product.unitName} (${product.unit})`
										: product.unit
								}
							/>
							<InfoRow label="Warranty" value={product.warranty} />
							<InfoRow
								label="Show on Front Page"
								value={product.fpshow === "1" ? "Yes" : "No"}
							/>
							<InfoRow label="Registered By (ID)" value={product.regby} />
							<InfoRow
								label="Registration Date"
								value={formatDate(product.regdate)}
							/>
							<InfoRow
								label="Updated By (ID)"
								value={displayValue(product.upby)}
							/>
							<InfoRow label="Last Update" value={formatDate(product.update)} />
							<InfoRow
								label="Total Pieces"
								value={displayValue(product.totalPices)}
							/>
						</div>
					</div>

					{/* Pricing and Status */}
					<div className="flex flex-wrap items-center gap-6 pt-6 mt-8 border-t border-gray-200 dark:border-gray-700">
						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Purchase Price
							</p>
							<p className="text-xl font-semibold text-green-700 dark:text-green-400">
								{formatPrice(product.pprice)}
							</p>
						</div>

						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								Sale Price
							</p>
							<p className="text-xl font-semibold text-blue-700 dark:text-blue-400">
								{formatPrice(product.sprice)}
							</p>
						</div>

						<div>
							<p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
							<span
								className={`inline-block px-3 py-1 rounded-full font-semibold text-xs ${
									product.status.toLowerCase() === "active"
										? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
										: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
								}`}
							>
								{product.status}
							</span>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({
	label,
	value,
}) => (
	<div>
		<p className="mb-1 text-xs tracking-wide text-gray-500 uppercase dark:text-gray-400">
			{label}
		</p>
		<p className="text-lg font-medium text-gray-900 dark:text-white">{value}</p>
	</div>
);

export default ProductDetails;
