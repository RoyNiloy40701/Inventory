import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, RefreshCw } from "lucide-react";

// Displays live currency exchange rates with bank comparisons and a quick exchange calculator
const exchangeRates = [
	{
		pair: "EUR/USD",
		rate: 1.0892,
		change: +0.0023,
		changePercent: +0.21,
		high: 1.0895,
		low: 1.0871,
		bankRate: 1.085,
		spread: 0.0042,
	},
	{
		pair: "GBP/USD",
		rate: 1.2634,
		change: -0.0018,
		changePercent: -0.14,
		high: 1.2651,
		low: 1.2618,
		bankRate: 1.259,
		spread: 0.0044,
	},
	{
		pair: "USD/JPY",
		rate: 149.82,
		change: +0.45,
		changePercent: +0.3,
		high: 149.95,
		low: 149.21,
		bankRate: 149.2,
		spread: 0.62,
	},
	{
		pair: "EUR/GBP",
		rate: 0.8621,
		change: +0.0008,
		changePercent: +0.09,
		high: 0.8628,
		low: 0.8615,
		bankRate: 0.8605,
		spread: 0.0016,
	},
];

export const ExchangeRates: React.FC = () => {
	const [lastUpdate, setLastUpdate] = React.useState(new Date());

	const handleRefresh = () => {
		setLastUpdate(new Date());
	};

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5 }}
				className="flex items-center justify-between"
			>
				<div>
					<h2 className="text-3xl font-bold text-light-text dark:text-dark-text font-editorial">
						Live Exchange Rates
					</h2>
					<p className="mt-1 text-light-text-secondary dark:text-dark-text-secondary">
						Real-time rates vs major banks
					</p>
				</div>
				<motion.button
					whileHover={{ scale: 1.05, rotate: 180 }}
					whileTap={{ scale: 0.95 }}
					onClick={handleRefresh}
					className="p-3 transition-colors duration-300 rounded-full bg-light-glass dark:bg-dark-glass hover:bg-lime-accent/10"
				>
					<RefreshCw className="w-5 h-5 text-light-text dark:text-dark-text" />
				</motion.button>
			</motion.div>

			{/* Rates Grid */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{exchangeRates.map((rate, index) => (
					<motion.div
						key={rate.pair}
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						whileHover={{ scale: 1.02 }}
						className="p-6 transition-all duration-300 border bg-light-surface/50 dark:bg-dark-surface/50 backdrop-blur-sm border-light-border dark:border-dark-border rounded-xl hover:border-lime-accent/30 hover:shadow-glow"
					>
						{/* Pair Header */}
						<div className="flex items-center justify-between mb-4">
							<div>
								<h3 className="text-xl font-bold text-light-text dark:text-dark-text font-editorial">
									{rate.pair}
								</h3>
								<p className="text-xs text-light-text-secondary dark:text-dark-text-secondary">
									Last update: {lastUpdate.toLocaleTimeString()}
								</p>
							</div>
							<div
								className={`flex items-center space-x-1 ${
									rate.change >= 0 ? "text-lime-accent" : "text-red-400"
								}`}
							>
								{rate.change >= 0 ? (
									<TrendingUp className="w-5 h-5" />
								) : (
									<TrendingDown className="w-5 h-5" />
								)}
								<span className="font-medium">
									{rate.changePercent > 0 ? "+" : ""}
									{rate.changePercent}%
								</span>
							</div>
						</div>

						{/* Rate Display */}
						<div className="space-y-3">
							<div className="flex items-baseline space-x-2">
								<motion.span
									initial={{ scale: 0.8 }}
									animate={{ scale: 1 }}
									transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
									className="text-3xl font-bold text-lime-accent font-editorial"
								>
									{rate.rate.toFixed(4)}
								</motion.span>
								<span
									className={`text-sm ${
										rate.change >= 0 ? "text-lime-accent" : "text-red-400"
									}`}
								>
									{rate.change > 0 ? "+" : ""}
									{rate.change.toFixed(4)}
								</span>
							</div>

							{/* High/Low */}
							<div className="flex justify-between text-sm">
								<div>
									<span className="text-light-text-secondary dark:text-dark-text-secondary">
										High:{" "}
									</span>
									<span className="font-medium text-light-text dark:text-dark-text">
										{rate.high.toFixed(4)}
									</span>
								</div>
								<div>
									<span className="text-light-text-secondary dark:text-dark-text-secondary">
										Low:{" "}
									</span>
									<span className="font-medium text-light-text dark:text-dark-text">
										{rate.low.toFixed(4)}
									</span>
								</div>
							</div>

							{/* Bank Comparison */}
							<div className="pt-3 border-t border-dark-border">
								<div className="pt-3 border-t border-light-border dark:border-dark-border">
									<div className="flex justify-between mb-2 text-sm">
										<span className="text-light-text-secondary dark:text-dark-text-secondary">
											Bank Rate:
										</span>
										<span className="text-light-text dark:text-dark-text">
											{rate.bankRate.toFixed(4)}
										</span>
									</div>
									<div className="flex justify-between text-sm">
										<span className="text-light-text-secondary dark:text-dark-text-secondary">
											Our Advantage:
										</span>
										<span className="font-medium text-lime-accent">
											+{rate.spread.toFixed(4)}
										</span>
									</div>
								</div>

								{/* Progress Bar */}
								<div className="w-full h-1 rounded-full bg-light-glass dark:bg-dark-glass">
									<motion.div
										initial={{ width: 0 }}
										animate={{
											width: `${Math.min(
												((rate.rate - rate.low) / (rate.high - rate.low)) * 100,
												100
											)}%`,
										}}
										transition={{ duration: 1, delay: index * 0.1 + 0.4 }}
										className="h-1 rounded-full bg-lime-accent opacity-70"
									/>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>

			{/* Quick Exchange */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.5, delay: 0.4 }}
				className="p-6 transition-colors duration-300 border bg-gradient-to-r from-light-surface/80 to-light-glass dark:from-dark-surface/80 dark:to-dark-glass border-light-border dark:border-dark-border rounded-2xl shadow-glass"
			>
				<h3 className="mb-4 text-xl font-bold text-light-text dark:text-dark-text font-editorial">
					Quick Exchange
				</h3>
				<div className="grid items-end grid-cols-1 gap-4 md:grid-cols-3">
					<div>
						<label className="block mb-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
							From
						</label>
						<div className="flex">
							<select className="px-3 py-2 transition-colors duration-300 border bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border rounded-l-xl text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50">
								<option>USD</option>
								<option>EUR</option>
								<option>GBP</option>
								<option>JPY</option>
							</select>
							<input
								type="number"
								placeholder="1000"
								className="flex-1 px-3 py-2 transition-colors duration-300 border border-l-0 bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border rounded-r-xl text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50"
							/>
						</div>
					</div>
					<div>
						<label className="block mb-2 text-sm text-light-text-secondary dark:text-dark-text-secondary">
							To
						</label>
						<div className="flex">
							<select className="px-3 py-2 transition-colors duration-300 border bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border rounded-l-xl text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50">
								<option>EUR</option>
								<option>USD</option>
								<option>GBP</option>
								<option>JPY</option>
							</select>
							<input
								type="number"
								placeholder="892.30"
								className="flex-1 px-3 py-2 transition-colors duration-300 border border-l-0 bg-light-glass dark:bg-dark-glass border-light-border dark:border-dark-border rounded-r-xl text-light-text dark:text-dark-text focus:outline-none focus:border-lime-accent/50"
								readOnly
							/>
						</div>
					</div>
					<motion.button
						whileHover={{ scale: 1.05 }}
						whileTap={{ scale: 0.95 }}
						className="px-6 py-3 font-medium transition-all bg-lime-accent text-light-base dark:text-dark-base rounded-xl hover:shadow-glow"
					>
						Exchange Now
					</motion.button>
				</div>
			</motion.div>
		</div>
	);
};
