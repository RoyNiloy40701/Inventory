// src/context/DropdownContext.tsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { api } from "../api";
import { useAuth } from "./AuthContext";

interface DropdownContextType {
	customers: any[];
	cashAccounts: any[];
	mobileAccounts: any[];
	bankAccounts: any[];
	expenseTypes: any[];
	supplier: any[];
	loading: boolean;
	party: any[];
	product: any[];
	company: any[];
	departments:any[];
	roles:any[];
	employee:any[];
}

const DropdownContext = createContext<DropdownContextType>({
	customers: [],
	cashAccounts: [],
	mobileAccounts: [],
	bankAccounts: [],
	expenseTypes: [],
	supplier: [],
	loading: true,
	party: [],
	product: [],
	company: [],
	departments:[],
	roles:[],
	employee:[],
});

export const DropdownProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [customers, setCustomers] = useState<any[]>([]);
	const [cashAccounts, setCashAccounts] = useState<any[]>([]);
	const [bankAccounts, setBankAccounts] = useState<any[]>([]);
	const [mobileAccounts, setMobileAccounts] = useState<any[]>([]);
	const [expenseTypes, setExpenseTypes] = useState<any[]>([]);
	const [supplier, setSupplier] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useAuth();
	const [party, setParty] = useState<any[]>([]);
	const [product, setProduct] = useState<any[]>([]);
	const [company, setCompany] = useState<any[]>([]);
	const [departments, setDepartments] = useState<any[]>([]);
	const [roles, setRoles] = useState<any[]>([]);
	const [employee, setEmployee] = useState<any[]>([]);

	useEffect(() => {
		if (!user) {
			// If user is not logged in, reset dropdowns and do not fetch
			setCustomers([]);
			setCashAccounts([]);
			setMobileAccounts([]);
			setBankAccounts([]);
			setExpenseTypes([]);
			setParty([]);
			setProduct([]);
			setCompany([]);
			setLoading(false);
			setDepartments([]);
			setRoles([]);
			setEmployee([]);
			return;
		}
		const fetchDropdowns = async () => {
			try {
				const token = localStorage.getItem("auth_token");
				const headers = { Authorization: `Bearer ${token}` };

				const [
					cusRes,
					caRes,
					baRes,
					maRes,
					expRes,
					supRes,
					partyRes,
					comRes,
					productRes,
					depRes,
					roleRes,
					empRes,
				] = await Promise.all([
					fetch(api.allCustomer, { headers }),
					fetch(api.allCashAccount, { headers }),
					fetch(api.allBankAccount, { headers }),
					fetch(api.allMobileAccount, { headers }),
					fetch(api.allExpense, { headers }),
					fetch(api.allSupplier, { headers }),
					fetch(api.allParty, { headers }),
					fetch(api.allCompany, { headers }),
					fetch(api.productList, { headers }),
					fetch(api.allDepartment, { headers }),
					fetch(api.allRole, { headers }),
					fetch(api.allEmployee, { headers }),
				]);

				const [
					cusData,
					caData,
					baData,
					maData,
					expData,
					supData,
					partyData,
					comData,
					productData,
					depData,
					roleData,
					empData,
				] = await Promise.all([
					cusRes.json(),
					caRes.json(),
					baRes.json(),
					maRes.json(),
					expRes.json(),
					supRes.json(),
					partyRes.json(),
					comRes.json(),
					productRes.json(),
					depRes.json(),
					roleRes.json(),
					empRes.json(),
				]);

				setCustomers(cusData.data || []);
				setCashAccounts(caData.data || []);
				setBankAccounts(baData.data || []);
				setMobileAccounts(maData.data || []);
				setExpenseTypes(expData.data || []);
				setSupplier(supData.data || []);
				setCompany(comData.data || []);
				// setParty(partyData.data || []);
				setParty(partyData || []);
				setProduct(productData || []);
				setDepartments(depData.data||[]);
				setRoles(roleData.data||[]);
				setEmployee(empData.data||[]);
				
			} catch (error) {
				console.error("Dropdown data fetch failed:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDropdowns();
	}, [user]);

	return (
		<DropdownContext.Provider
			value={{
				customers,
				cashAccounts,
				mobileAccounts,
				bankAccounts,
				expenseTypes,
				supplier,
				loading,
				party,
				product,
				company,
				departments,
				roles,
				employee,
			}}
		>
			{children}
		</DropdownContext.Provider>
	);
};

export const useDropdowns = () => useContext(DropdownContext);
