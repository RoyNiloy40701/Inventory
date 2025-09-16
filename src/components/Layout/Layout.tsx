import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export const Layout: React.FC = () => {
	const [sidebarOpen, setSidebarOpen] = useState(true);

	return (
		<div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900">
			<Sidebar
				isOpen={sidebarOpen}
				onToggle={() => setSidebarOpen(!sidebarOpen)}
			/>
			<div
				className={`transition-all duration-300 ${
					sidebarOpen ? "ml-64" : "ml-16"
				}`}
			>
				<Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
				<main className="p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
};
