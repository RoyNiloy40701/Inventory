import React from "react";
import { motion } from "framer-motion";
import { Star, Smartphone, Download } from "lucide-react";

// Fixed bottom strip that displays app ratings and download buttons to encourage user engagement
export const CTAStrip: React.FC = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 50 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay: 0.8 }}
			className="fixed bottom-0 left-0 right-0 z-40 p-4 transition-colors duration-300 border-t bg-light-surface/95 dark:bg-dark-surface/95 backdrop-blur-glass border-light-border dark:border-dark-border"
		>
			<div className="flex items-center justify-between mx-auto max-w-7xl">
				{/* Left: Tagline */}
				<div className="flex items-center space-x-6">
					<motion.h3
						initial={{ x: -20, opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						transition={{ duration: 0.5, delay: 0.9 }}
						className="text-xl font-bold text-lime-accent font-editorial"
					>
						Send smarter. Spend globally.
					</motion.h3>

					{/* Ratings */}
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ duration: 0.5, delay: 1.0 }}
						className="flex items-center space-x-4"
					>
						<div className="flex items-center px-3 py-2 space-x-2 transition-colors duration-300 rounded-full bg-light-glass dark:bg-dark-glass">
							<div className="flex items-center">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-4 h-4 fill-current text-lime-accent"
									/>
								))}
							</div>
							<span className="text-sm font-medium text-light-text dark:text-dark-text">
								4.9
							</span>
						</div>
						<span className="text-sm text-light-text-secondary dark:text-dark-text-secondary">
							App Store & Play Store
						</span>
					</motion.div>
				</div>

				{/* Right: Download buttons */}
				<motion.div
					initial={{ x: 20, opacity: 0 }}
					animate={{ x: 0, opacity: 1 }}
					transition={{ duration: 0.5, delay: 1.1 }}
					className="flex items-center space-x-4"
				>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center px-4 py-2 space-x-2 transition-all duration-300 border bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30"
					>
						<Smartphone className="w-5 h-5 text-light-text dark:text-dark-text" />
						<span className="text-sm text-light-text dark:text-dark-text">
							Download App
						</span>
					</motion.button>

					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="flex items-center px-4 py-2 space-x-2 font-medium transition-all bg-lime-accent text-light-base dark:text-dark-base rounded-xl hover:shadow-glow"
					>
						<Download className="w-5 h-5" />
						<span className="text-sm">Get Started</span>
					</motion.button>

					{/* QR Code placeholder */}
					<div className="flex items-center justify-center w-12 h-12 transition-colors duration-300 border rounded-lg bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border">
						<div className="flex items-center justify-center w-8 h-8 rounded-sm bg-lime-accent/20">
							<div className="w-4 h-4 bg-lime-accent rounded-xs"></div>
						</div>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};
