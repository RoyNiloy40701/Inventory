import React from "react";
import { Menu, Bell, Search, Sun, Moon, User, LogOut } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";

interface HeaderProps {
	onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
	const { theme, toggleTheme } = useTheme();
	const { user, logout } = useAuth();

	return (
		<header className="px-6 py-4 bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
			<div className="flex items-center justify-between">
				{/* Left side */}
				<div className="flex items-center space-x-4">
					<button
						onClick={onMenuClick}
						className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 lg:hidden"
					>
						<Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
					</button>

					{/* Search */}
					<div className="relative hidden md:block">
						<Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
						<input
							type="text"
							placeholder="Search..."
							className="py-2 pl-10 pr-4 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
						/>
					</div>
				</div>

				{/* Right side */}
				<div className="flex items-center space-x-4">
					{/* Theme toggle */}
					<button
						onClick={toggleTheme}
						className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
					>
						{theme === "light" ? (
							<Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						) : (
							<Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						)}
					</button>

					{/* Notifications */}
					<button className="relative p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
						<Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
						<span className="absolute w-2 h-2 bg-red-500 rounded-full top-1 right-1"></span>
					</button>

					{/* User menu */}
					<div className="flex items-center space-x-3">
						<div className="hidden text-right md:block">
							<p className="text-sm font-medium text-gray-900 dark:text-white">
								{user?.name}
							</p>
							<p className="text-xs text-gray-500 capitalize dark:text-gray-400">
								{user?.role}
							</p>
						</div>
						<div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
							<User className="w-4 h-4 text-white" />
						</div>
						<button
							onClick={logout}
							className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
						>
							<LogOut className="w-4 h-4 text-gray-600 dark:text-gray-400" />
						</button>
					</div>
				</div>
			</div>
		</header>
	);
};
