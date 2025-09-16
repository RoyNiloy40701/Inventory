import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";
import { Layout } from "./components/Layout/Layout";
import { Login } from "./pages/Auth/Login";
import { Dashboard } from "./pages/Dashboard/Dashboard";
import { ProductList } from "./pages/Products/ProductList";
import { ProductForm } from "./pages/Products/ProductForm";
import { PartyList } from "./pages/Parties/PartyList";
import { PartyForm } from "./pages/Parties/PartyForm";
import { PurchasesList } from "./pages/Purchases/PurchasesList";
import { PurchasesForm } from "./pages/Purchases/PurchasesForm";
import { VouchersList } from "./pages/Vouchers/VouchersList";
import { VouchersForm } from "./pages/Vouchers/VouchersForm";
import { SalaryList } from "./pages/Salary/SalaryList";
import { SalaryForm } from "./pages/Salary/SalaryForm";
import { BalanceTransferList } from "./pages/BalanceTransfer/BalanceTransferList";
import { BalanceTransferForm } from "./pages/BalanceTransfer/BalanceTransferForm";
import { Reports } from "./pages/Reports/Reports";
import { UsersList } from "./pages/Users/UsersList";
import { UsersForm } from "./pages/Users/UsersForm";
import { Settings } from "./pages/Settings/Settings";
import { ProtectedRoute } from "./components/Auth/ProtectedRoute";
import "./index.css";
import ProductDetails from "./pages/Products/ProductDetails";
import { CategoryList } from "./pages/Category/CategoryList";
import { SystemSettings } from "./pages/System/SystemSettings";
import { UnitList } from "./pages/Unit/UnitList";
import { UnitForm } from "./pages/Unit/UnitForm";
import { ExpenseList } from "./pages/Expense/ExpenseList";
import { ExpenseForm } from "./pages/Expense/ExpenseForm";
import { CashAccountList } from "./pages/CashAccount/CashAccountList";
import { CashAccountForm } from "./pages/CashAccount/CashAccountForm";
import { MobileAccountList } from "./pages/MobileAccount/MobileAccountList";
import { MobileAccountForm } from "./pages/MobileAccount/MobileAccountForm";
import { BankAccountList } from "./pages/BankAccount/BankAccountList";
import { BankAccountForm } from "./pages/BankAccount/BankAccountForm";
import { CompanyForm } from "./pages/Company/CompanyForm";
import { CompanyList } from "./pages/Company/CompanyList";
import { DepartmentList } from "./pages/Department/DepartmentList";
import { DepartmentForm } from "./pages/Department/DepartmentForn";
import { CategoryForm } from "./pages/Category/CategoryForm";
import { SupplierList } from "./pages/Supplier/SupplierList";
import { SupplierForm } from "./pages/Supplier/SupplierForm";
import { RolesList } from "./pages/Roles/RolesList";
import { RolesForm } from "./pages/Roles/RolesForm";
import { CustomerList } from "./pages/Customer/CustomerList";
import { CustomerForm } from "./pages/Customer/CustomerForm";
import { ViewParty } from "./pages/Parties/ViewParty";
import SaleView from "./pages/Sales/SaleView";
import { DropdownProvider } from "./contexts/DropDownContext";
import { SaleReturnList } from "./pages/SalesReturn/SaleReturnList";
import SaleReturnForm from "./pages/SalesReturn/SaleReturnForm";
import { QuotationList } from "./pages/Quotation/QuotationList";
import { QuotationForm } from "./pages/Quotation/QuotationForm";
import { SalesReport } from "./pages/Reports/AllReports/SalesReport";
import { PurchaseReport } from "./pages/Reports/AllReports/PurchaseReport";
import { SupplierReport } from "./pages/Reports/AllReports/SupplierReport";
import { ExpenseReport } from "./pages/Reports/AllReports/ExpenseReport";
import { PurchaseReturnForm } from "./pages/PurchaseReturn/PurchaseReturnFrom";
import { PurchaseReturnList } from "./pages/PurchaseReturn/PurchaseReturnList";
import { SaleForm } from "./pages/Sales/SaleForm";
import { SaleList } from "./pages/Sales/SaleList";
import { PurchaseReturnView } from "./pages/PurchaseReturn/PurchaseReturnView";
import ProductStock from "./pages/Products/ProductStock";
import ProductDamage from "./pages/Products/ProductDamage";
import StockReport from "./pages/Reports/AllReports/StockReport";
import { CustomerReport } from "./pages/Reports/AllReports/CustomerReport";
import { CustomerDueReport } from "./pages/Reports/AllReports/CustomerDueReport";
import { MobileBookReport } from "./pages/Reports/AllReports/MobileBookReport";
import { BankBookReport } from "./pages/Reports/AllReports/BankBookReport";
import { CashBookReport } from "./pages/Reports/AllReports/CashBookReport";
import { DuePaymentReport } from "./pages/Reports/AllReports/DuePaymentReport";
import { SalaryStructureForm } from "./pages/Salary/SalaryStructure";
import { PurchaseReturnReport } from "./pages/Reports/AllReports/PurchaseReturnReport";
import { SaleWiseProfitReport } from "./pages/Reports/AllReports/SaleWiseProfitReport";
import { ProductWiseProfitReport } from "./pages/Reports/AllReports/ProductWiseProfitReport";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <DropdownProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Layout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />

                  {/* Products */}
                  <Route path="products" element={<ProductList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id/edit" element={<ProductForm />} />
                  <Route path="/products/:id" element={<ProductDetails />} />
                  <Route path="productStock" element={<ProductStock />} />
                  <Route path="productDamage" element={<ProductDamage />} />

                  {/* CategoryList */}
                  <Route path="system/category" element={<CategoryList />} />
                  <Route path="category" element={<CategoryList />} />
                  <Route path="category/new" element={<CategoryForm />} />
                  <Route path="category/:id/edit" element={<CategoryForm />} />

                  {/* Department */}
                  <Route path="department" element={<DepartmentList />} />
                  <Route
                    path="system/department"
                    element={<DepartmentList />}
                  />
                  <Route path="department/new" element={<DepartmentForm />} />
                  <Route
                    path="department/:id/edit"
                    element={<DepartmentForm />}
                  />

                  {/* Parties */}
                  <Route path="parties" element={<PartyList />} />
                  <Route path="parties/new" element={<PartyForm />} />
                  <Route path="parties/:id/edit" element={<PartyForm />} />
                  <Route path="parties/:id" element={<ViewParty />} />

                  {/* View Party */}

                  {/* Suppliers */}
                  <Route path="supplier" element={<SupplierList />} />
                  <Route path="supplier/new" element={<SupplierForm />} />
                  <Route path="supplier/:id/edit" element={<SupplierForm />} />
                  {/* <Route path="supplier/:id" element={<SupplierDetails />} /> */}
                  {/* Sales */}

                  <Route path="sales" element={<SaleList />} />
                  {/* <Route path="sales/new" element={<SalesForm />} /> */}
                  <Route path="sales/new" element={<SaleForm />} />
                  <Route path="sales/:id/edit" element={<SaleForm />} />
                  <Route path="sales/:id" element={<SaleView />} />

                  {/* saleReturn */}
                  <Route path="sales-return" element={<SaleReturnList />} />
                  <Route path="sales-return/new" element={<SaleReturnForm />} />

                  {/* Purchases */}
                  <Route path="purchases" element={<PurchasesList />} />
                  <Route path="purchases/new" element={<PurchasesForm />} />
                  <Route
                    path="purchases/:id/edit"
                    element={<PurchasesForm />}
                  />
                  {/* Quotation */}
                  <Route path="quotation" element={<QuotationList />} />
                  <Route path="quotation/new" element={<QuotationForm />} />
                  <Route
                    path="quotation/:id/edit"
                    element={<QuotationForm />}
                  />
                  <Route
                    path="/purchase-return/:id"
                    element={<PurchaseReturnView />}
                  />
                  {/* purchases Return */}
                  <Route
                    path="purchase-return"
                    element={<PurchaseReturnList />}
                  />
                  <Route
                    path="purchase-return/new"
                    element={<PurchaseReturnForm />}
                  />

                  {/* Vouchers */}
                  <Route path="vouchers" element={<VouchersList />} />
                  <Route path="vouchers/new" element={<VouchersForm />} />
                  <Route path="vouchers/:id/edit" element={<VouchersForm />} />

                  {/* Salary */}
                  <Route path="salary" element={<SalaryList />} />
                  <Route path="salary/new" element={<SalaryForm />} />
                  <Route path="salary/:id/edit" element={<SalaryForm />} />
                  <Route
                    path="salary/salaryStructure"
                    element={<SalaryStructureForm />}
                  />

                  {/* Balance Transfer */}
                  <Route
                    path="balance-transfer"
                    element={<BalanceTransferList />}
                  />
                  <Route
                    path="balance-transfer/new"
                    element={<BalanceTransferForm />}
                  />
                  <Route
                    path="balance-transfer/:id/edit"
                    element={<BalanceTransferForm />}
                  />

                  {/* Reports */}
                  <Route path="reports" element={<Reports />} />
                  <Route path="reports/sales" element={<SalesReport />} />
                  <Route path="reports/purchase" element={<PurchaseReport />} />
                  <Route path="reports/supplier" element={<SupplierReport />} />
                  <Route path="reports/expense" element={<ExpenseReport />} />
                  <Route path="reports/customer" element={<CustomerReport />} />
                  <Route
                    path="reports/customerDue"
                    element={<CustomerDueReport />}
                  />
                  <Route
                    path="reports/mobileBook"
                    element={<MobileBookReport />}
                  />
                  <Route path="reports/cashBook" element={<CashBookReport />} />
                  <Route path="reports/bankBook" element={<BankBookReport />} />
                  <Route
                    path="reports/duePayment"
                    element={<DuePaymentReport />}
                  />
                  <Route
                    path="reports/purchaseReturn"
                    element={<PurchaseReturnReport />}
                  />
                  <Route path="reports/stocks" element={<StockReport />} />
                  <Route
                    path="reports/saleWiseProfit"
                    element={<SaleWiseProfitReport />}
                  />
                  <Route
                    path="reports/productWiseProfit"
                    element={<ProductWiseProfitReport />}
                  />
                  {/* System */}
                  <Route path="system" element={<SystemSettings />} />

                  {/* Unit  */}
                  <Route path="system/unit" element={<UnitList />} />
                  <Route path="unit/new" element={<UnitForm />} />
                  <Route path="unit/:id/edit" element={<UnitForm />} />

                  {/* Expense */}
                  <Route path="system/expense" element={<ExpenseList />} />
                  <Route path="expense/new" element={<ExpenseForm />} />
                  <Route path="expense/:id/edit" element={<ExpenseForm />} />

                  {/* Cash Account */}
                  <Route
                    path="system/cashAccount"
                    element={<CashAccountList />}
                  />
                  <Route path="cashAccount/new" element={<CashAccountForm />} />
                  <Route
                    path="cashAccount/:id/edit"
                    element={<CashAccountForm />}
                  />

                  {/* Mobile Account */}
                  <Route
                    path="system/mobileAccount"
                    element={<MobileAccountList />}
                  />
                  <Route
                    path="mobileAccount/new"
                    element={<MobileAccountForm />}
                  />
                  <Route
                    path="mobileAccount/:id/edit"
                    element={<MobileAccountForm />}
                  />

                  {/* Bank Account */}
                  <Route
                    path="system/bankAccount"
                    element={<BankAccountList />}
                  />
                  <Route path="bankAccount/new" element={<BankAccountForm />} />
                  <Route
                    path="bankAccount/:id/edit"
                    element={<BankAccountForm />}
                  />

                  {/* Company*/}
                  <Route path="system/company" element={<CompanyList />} />
                  <Route path="company/new" element={<CompanyForm />} />
                  <Route path="company/:id/edit" element={<CompanyForm />} />

                  {/* Supplier*/}
                  <Route path="system/supplier" element={<SupplierList />} />
                  <Route path="supplier/new" element={<SupplierForm />} />
                  <Route path="supplier/:id/edit" element={<SupplierForm />} />

                  {/* Role*/}
                  <Route path="system/role" element={<RolesList />} />
                  <Route path="role/new" element={<RolesForm />} />
                  <Route path="role/:id/edit" element={<RolesForm />} />

                  {/* Users */}
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/new" element={<UsersForm />} />
                  <Route path="users/:id/edit" element={<UsersForm />} />
                  {/* Customer*/}
                  <Route path="system/customer" element={<CustomerList />} />
                  <Route path="customer/new" element={<CustomerForm />} />
                  <Route path="customer/:id/edit" element={<CustomerForm />} />

                  {/* Roles */}
                  <Route path="roles" element={<RolesList />} />
                  <Route path="roles/new" element={<RolesForm />} />
                  <Route path="users/:id/edit" element={<UsersForm />} />

                  {/* Settings */}
                  <Route path="settings" element={<Settings />} />
                </Route>
              </Routes>
            </Router>
          </DropdownProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
