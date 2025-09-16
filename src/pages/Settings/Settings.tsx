import React, { useState } from "react";
import { motion } from "framer-motion";
import {
	Settings as SettingsIcon,
	User,
	Bell,
	Shield,
	Database,
	Palette,
	Globe,
	Download,
	Upload,
	Save,
	RefreshCw,
} from "lucide-react";

export const Settings: React.FC = () => {
	const [activeTab, setActiveTab] = useState("general");
	const [settings, setSettings] = useState({
		// General Settings
		companyName: "InventoryPro",
		companyEmail: "admin@inventorypro.com",
		companyPhone: "+1 (555) 123-4567",
		companyAddress: "123 Business Street, New York, NY 10001",
		timezone: "America/New_York",
		dateFormat: "MM/DD/YYYY",
		currency: "USD",

		// Notifications
		emailNotifications: true,
		smsNotifications: false,
		lowStockAlerts: true,
		salesNotifications: true,
		systemUpdates: true,

		// Security
		twoFactorAuth: false,
		sessionTimeout: 30,
		passwordExpiry: 90,
		loginAttempts: 5,

		// Backup
		autoBackup: true,
		backupFrequency: "daily",
		backupRetention: 30,

		// Appearance
		theme: "system",
		language: "en",
		sidebarCollapsed: false,
	});

	const tabs = [
		{ id: "general", name: "General", icon: SettingsIcon },
		{ id: "notifications", name: "Notifications", icon: Bell },
		{ id: "security", name: "Security", icon: Shield },
		{ id: "backup", name: "Backup", icon: Database },
		{ id: "appearance", name: "Appearance", icon: Palette },
	];

	const handleSettingChange = (key: string, value: any) => {
		setSettings((prev) => ({ ...prev, [key]: value }));
	};

	const handleSave = () => {
		// Simulate saving settings
		console.log("Saving settings:", settings);
		// Show success message
	};

	const handleExportSettings = () => {
		const dataStr = JSON.stringify(settings, null, 2);
		const dataBlob = new Blob([dataStr], { type: "application/json" });
		const url = URL.createObjectURL(dataBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = "settings.json";
		link.click();
	};

	const handleImportSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				try {
					const importedSettings = JSON.parse(e.target?.result as string);
					setSettings(importedSettings);
				} catch (error) {
					console.error("Error importing settings:", error);
				}
			};
			reader.readAsText(file);
		}
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
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Settings
					</h1>
					<p className="text-gray-600 dark:text-gray-400">
						Manage your application preferences and configuration
					</p>
				</div>
				<div className="flex items-center space-x-4">
					<input
						type="file"
						accept=".json"
						onChange={handleImportSettings}
						className="hidden"
						id="import-settings"
					/>
					<label
						htmlFor="import-settings"
						className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg cursor-pointer dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<Upload className="w-4 h-4 mr-2" />
						Import
					</label>
					<button
						onClick={handleExportSettings}
						className="flex items-center px-4 py-2 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
					>
						<Download className="w-4 h-4 mr-2" />
						Export
					</button>
					<button
						onClick={handleSave}
						className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
					>
						<Save className="w-4 h-4 mr-2" />
						Save Changes
					</button>
				</div>
			</motion.div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
				{/* Sidebar */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.5, delay: 0.1 }}
					className="lg:col-span-1"
				>
					<div className="p-4 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
						<nav className="space-y-2">
							{tabs.map((tab) => (
								<button
									key={tab.id}
									onClick={() => setActiveTab(tab.id)}
									className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
										activeTab === tab.id
											? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
											: "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
									}`}
								>
									<tab.icon className="w-5 h-5" />
									<span className="font-medium">{tab.name}</span>
								</button>
							))}
						</nav>
					</div>
				</motion.div>

				{/* Content */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, delay: 0.2 }}
					className="lg:col-span-3"
				>
					<div className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700">
						{/* General Settings */}
						{activeTab === "general" && (
							<div className="space-y-6">
								<div>
									<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
										General Settings
									</h2>
									<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Company Name
											</label>
											<input
												type="text"
												value={settings.companyName}
												onChange={(e) =>
													handleSettingChange("companyName", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Company Email
											</label>
											<input
												type="email"
												value={settings.companyEmail}
												onChange={(e) =>
													handleSettingChange("companyEmail", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Phone Number
											</label>
											<input
												type="tel"
												value={settings.companyPhone}
												onChange={(e) =>
													handleSettingChange("companyPhone", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Timezone
											</label>
											<select
												value={settings.timezone}
												onChange={(e) =>
													handleSettingChange("timezone", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="America/New_York">Eastern Time</option>
												<option value="America/Chicago">Central Time</option>
												<option value="America/Denver">Mountain Time</option>
												<option value="America/Los_Angeles">
													Pacific Time
												</option>
											</select>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Date Format
											</label>
											<select
												value={settings.dateFormat}
												onChange={(e) =>
													handleSettingChange("dateFormat", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="MM/DD/YYYY">MM/DD/YYYY</option>
												<option value="DD/MM/YYYY">DD/MM/YYYY</option>
												<option value="YYYY-MM-DD">YYYY-MM-DD</option>
											</select>
										</div>
										<div>
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Currency
											</label>
											<select
												value={settings.currency}
												onChange={(e) =>
													handleSettingChange("currency", e.target.value)
												}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											>
												<option value="USD">USD - US Dollar</option>
												<option value="EUR">EUR - Euro</option>
												<option value="GBP">GBP - British Pound</option>
												<option value="CAD">CAD - Canadian Dollar</option>
											</select>
										</div>
										<div className="md:col-span-2">
											<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
												Company Address
											</label>
											<textarea
												value={settings.companyAddress}
												onChange={(e) =>
													handleSettingChange("companyAddress", e.target.value)
												}
												rows={3}
												className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
											/>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Notifications */}
						{activeTab === "notifications" && (
							<div className="space-y-6">
								<div>
									<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
										Notification Preferences
									</h2>
									<div className="space-y-4">
										{[
											{
												key: "emailNotifications",
												label: "Email Notifications",
												description: "Receive notifications via email",
											},
											{
												key: "smsNotifications",
												label: "SMS Notifications",
												description: "Receive notifications via SMS",
											},
											{
												key: "lowStockAlerts",
												label: "Low Stock Alerts",
												description:
													"Get notified when products are running low",
											},
											{
												key: "salesNotifications",
												label: "Sales Notifications",
												description: "Receive updates on new sales",
											},
											{
												key: "systemUpdates",
												label: "System Updates",
												description:
													"Get notified about system updates and maintenance",
											},
										].map((notification) => (
											<div
												key={notification.key}
												className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600"
											>
												<div>
													<h4 className="font-medium text-gray-900 dark:text-white">
														{notification.label}
													</h4>
													<p className="text-sm text-gray-500 dark:text-gray-400">
														{notification.description}
													</p>
												</div>
												<label className="relative inline-flex items-center cursor-pointer">
													<input
														type="checkbox"
														checked={
															settings[
																notification.key as keyof typeof settings
															] as boolean
														}
														onChange={(e) =>
															handleSettingChange(
																notification.key,
																e.target.checked
															)
														}
														className="sr-only peer"
													/>
													<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
												</label>
											</div>
										))}
									</div>
								</div>
							</div>
						)}

						{/* Security */}
						{activeTab === "security" && (
							<div className="space-y-6">
								<div>
									<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
										Security Settings
									</h2>
									<div className="space-y-6">
										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
											<div>
												<h4 className="font-medium text-gray-900 dark:text-white">
													Two-Factor Authentication
												</h4>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													Add an extra layer of security to your account
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={settings.twoFactorAuth}
													onChange={(e) =>
														handleSettingChange(
															"twoFactorAuth",
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
											</label>
										</div>

										<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Session Timeout (minutes)
												</label>
												<input
													type="number"
													value={settings.sessionTimeout}
													onChange={(e) =>
														handleSettingChange(
															"sessionTimeout",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Password Expiry (days)
												</label>
												<input
													type="number"
													value={settings.passwordExpiry}
													onChange={(e) =>
														handleSettingChange(
															"passwordExpiry",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Max Login Attempts
												</label>
												<input
													type="number"
													value={settings.loginAttempts}
													onChange={(e) =>
														handleSettingChange(
															"loginAttempts",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Backup */}
						{activeTab === "backup" && (
							<div className="space-y-6">
								<div>
									<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
										Backup Settings
									</h2>
									<div className="space-y-6">
										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
											<div>
												<h4 className="font-medium text-gray-900 dark:text-white">
													Automatic Backup
												</h4>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													Automatically backup your data at regular intervals
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={settings.autoBackup}
													onChange={(e) =>
														handleSettingChange("autoBackup", e.target.checked)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
											</label>
										</div>

										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Backup Frequency
												</label>
												<select
													value={settings.backupFrequency}
													onChange={(e) =>
														handleSettingChange(
															"backupFrequency",
															e.target.value
														)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												>
													<option value="hourly">Hourly</option>
													<option value="daily">Daily</option>
													<option value="weekly">Weekly</option>
													<option value="monthly">Monthly</option>
												</select>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Retention Period (days)
												</label>
												<input
													type="number"
													value={settings.backupRetention}
													onChange={(e) =>
														handleSettingChange(
															"backupRetention",
															parseInt(e.target.value)
														)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												/>
											</div>
										</div>

										<div className="flex space-x-4">
											<button className="flex items-center px-4 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700">
												<Download className="w-4 h-4 mr-2" />
												Create Backup Now
											</button>
											<button className="flex items-center px-4 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
												<RefreshCw className="w-4 h-4 mr-2" />
												Restore from Backup
											</button>
										</div>
									</div>
								</div>
							</div>
						)}

						{/* Appearance */}
						{activeTab === "appearance" && (
							<div className="space-y-6">
								<div>
									<h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
										Appearance Settings
									</h2>
									<div className="space-y-6">
										<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Theme
												</label>
												<select
													value={settings.theme}
													onChange={(e) =>
														handleSettingChange("theme", e.target.value)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												>
													<option value="light">Light</option>
													<option value="dark">Dark</option>
													<option value="system">System</option>
												</select>
											</div>
											<div>
												<label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
													Language
												</label>
												<select
													value={settings.language}
													onChange={(e) =>
														handleSettingChange("language", e.target.value)
													}
													className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
												>
													<option value="en">English</option>
													<option value="es">Spanish</option>
													<option value="fr">French</option>
													<option value="de">German</option>
												</select>
											</div>
										</div>

										<div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg dark:border-gray-600">
											<div>
												<h4 className="font-medium text-gray-900 dark:text-white">
													Collapsed Sidebar
												</h4>
												<p className="text-sm text-gray-500 dark:text-gray-400">
													Keep the sidebar collapsed by default
												</p>
											</div>
											<label className="relative inline-flex items-center cursor-pointer">
												<input
													type="checkbox"
													checked={settings.sidebarCollapsed}
													onChange={(e) =>
														handleSettingChange(
															"sidebarCollapsed",
															e.target.checked
														)
													}
													className="sr-only peer"
												/>
												<div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
											</label>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>
				</motion.div>
			</div>
		</div>
	);
};
