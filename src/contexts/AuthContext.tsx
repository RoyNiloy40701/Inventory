import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { api } from "../api";

// User and Company interfaces
interface User {
	id: string;
	name: string;
	email: string;
	role: "admin" | "manager" | "cashier";
	compId: number;
}

interface Company {
	id: number;
	name: string;
	address: string;
	phone: string;
}

interface AuthContextType {
	user: User | null;
	company: Company | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};

// Helper to check if token is expired
const isTokenExpired = (token: string): boolean => {
	try {
		const payload = JSON.parse(atob(token.split(".")[1]));
		const currentTime = Math.floor(Date.now() / 1000);
		return payload.exp < currentTime;
	} catch (err) {
		return true; // treat malformed tokens as expired
	}
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [company, setCompany] = useState<Company | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const login = async (email: string, password: string) => {
		setIsLoading(true);
		try {
			const response = await fetch(api.login, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			const data = await response.json();

			if (!response.ok) {
				throw new Error(data.message || "Login failed");
			}

			const token = data.token;
			const compId = data?.data?.compid;

			localStorage.setItem("auth_token", token);
			localStorage.setItem("user_compId", data.data.compid);
			localStorage.setItem("user_id", data.data._id);
			localStorage.setItem("user_name", data.data.name);
			localStorage.setItem("user_email", data.data.email);
			localStorage.setItem("user_role", data.data.userrole);

			setUser({
				id: data?.data._id,
				name: data?.data.name,
				email: data?.data.email,
				role: data?.data.userrole,
				compId: data?.data.compid,
			});

			const profileRes = await fetch(api.profile, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`,
				},
				body: JSON.stringify({ com_pid: compId }),
			});

			const profileData = await profileRes.json();

			if (!profileRes.ok) {
				throw new Error("Failed to fetch company info");
			}
			setCompany({
				id: profileData?.data?._id,
				name: profileData?.data?.com_name,
				address: profileData?.data?.com_address,
				phone: profileData?.data?.com_mobile,
			});
		} catch (error) {
			throw new Error("Invalid credentials");
		} finally {
			setIsLoading(false);
		}
	};

	// Check token + restore user if valid
	useEffect(() => {
		const checkAuth = async () => {
			const token = localStorage.getItem("auth_token");
			const compId = localStorage.getItem("user_compId");

			if (!token || !compId || isTokenExpired(token)) {
				logout();
				setIsLoading(false);
				return;
			}

			try {
				const response = await fetch(api.profile, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${token}`,
					},
					body: JSON.stringify({ com_pid: compId }),
				});

				const data = await response.json();

				if (!response.ok) {
					throw new Error("Token invalid");
				}

				setUser({
					id: localStorage.getItem("user_id") || "",
					name: localStorage.getItem("user_name") || "",
					email: localStorage.getItem("user_email") || "",
					role: localStorage.getItem("user_role") as
						| "admin"
						| "manager"
						| "cashier",
					compId: parseInt(compId),
				});

				setCompany({
					id: data.data._id,
					name: data.data.com_name,
					address: data.data.com_address,
					phone: data.data.com_mobile,
				});
			} catch (error) {
				logout(); // In case of error, log out
			} finally {
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const logout = async () => {
		try {
			await fetch(api.logout, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
				},
			});
		} catch (error) {
			console.error("Logout failed:", error);
		} finally {
			setUser(null);
			setCompany(null);
			localStorage.removeItem("auth_token");
			localStorage.removeItem("user_compId");
			localStorage.removeItem("user_id");
			localStorage.removeItem("user_name");
			localStorage.removeItem("user_email");
			localStorage.removeItem("user_role");
		}
	};
	useEffect(() => {
		const id = window.setInterval(() => {
			const token = localStorage.getItem("auth_token");
			if (!token || isTokenExpired(token)) {
				logout();
			}
		}, 5000); // check every 15 seconds

		return () => window.clearInterval(id);
	}, []);

	return (
		<AuthContext.Provider value={{ user, company, login, logout, isLoading }}>
			{children}
		</AuthContext.Provider>
	);
};
