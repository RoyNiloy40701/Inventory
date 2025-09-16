import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useDropdowns } from "../../contexts/DropDownContext";
import { api } from "../../api";
import { useAuth } from "../../contexts/AuthContext";

const allowanceSchema = yup.object({
  type: yup.string().required("Allowance type is required"),
  amount: yup
    .number()
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
});

const deductionSchema = yup.object({
  type: yup.string().required("Deduction type is required"),
  amount: yup
    .number()
    .min(0, "Amount cannot be negative")
    .required("Amount is required"),
});

const schema = yup.object({
  employeeId: yup.string().required("Employee is required"),
  month: yup.string().required("Month is required"),
  basicSalary: yup
    .number()
    .min(0, "Basic salary must be positive")
    .required("Basic salary is required"),
  workingDays: yup
    .number()
    .positive("Working days must be positive")
    .required("Working days is required"),
  presentDays: yup
    .number()
    .positive("Present days cannot be negative")
    .required("Present days is required"),
  overtimeHours: yup
    .number()
    .min(0, "Overtime hours cannot be negative")
    .default(0),
  overtimeRate: yup
    .number()
    .min(0, "Overtime rate cannot be negative")
    .default(0),
  allowances: yup.array().of(allowanceSchema).default([]),
  deductions: yup.array().of(deductionSchema).default([]),
  earnSalary: yup.number().min(0, "Earn salary cannot be negative"),
  totalOTAmount: yup
    .number()
    .min(0, "Total Over Time Amount cannot be negative"),
  totalDeductions: yup.number().min(0, "Total deductions cannot be negative"),
  totalAllowance: yup
    .number()
    .min(0, "Total allowance amount cannot be negative"),
  netSalary: yup.number().min(0, "Net salary cannot be negative"),
  paymentMethod: yup.string().required("Payment method is required"),
  accountId: yup.string().required("Account No is required"),
  status: yup
    .string()
    .oneOf(["pending", "processing", "paid"], "Invalid status")
    .required("Status is required"),
  notes: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

const allowanceTypes = [
  "House Rent Allowance",
  "Transport Allowance",
  "Medical Allowance",
  "Food Allowance",
  "Performance Bonus",
  "Special Allowance",
];

const deductionTypes = [
  "Income Tax",
  "Provident Fund",
  "Insurance Premium",
  "Loan Deduction",
  "Late Coming Fine",
  "Other Deductions",
];

export const SalaryForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { mobileAccounts, bankAccounts, cashAccounts, employee } =
    useDropdowns();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [structure, setStructure] = useState<Account[]>([]);
  const getPaymentMethods = () => ["Cash", "Mobile", "Bank"];
  const { user, company } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      employeeId: "",
      basicSalary: 0,
      workingDays: 1,
      presentDays: 1,
      overtimeHours: 0,
      overtimeRate: 0,
      totalAllowance: 0,
      earnSalary: 0,
      totalDeductions: 0,
      netSalary: 0,
      totalOTAmount: 0,
      paymentMethod: "",
      accountId: "",
      notes: "",
      month: new Date().toISOString().slice(0, 7),
      allowances: [],
      deductions: [],
      status: "pending",
    },
  });

  const {
    fields: allowanceFields,
    append: appendAllowance,
    remove: removeAllowance,
  } = useFieldArray({
    control,
    name: "allowances",
  });

  const {
    fields: deductionFields,
    append: appendDeduction,
    remove: removeDeduction,
  } = useFieldArray({
    control,
    name: "deductions",
  });

  const watchedEmployeeId = watch("employeeId");
  const watchedBasicSalary = watch("basicSalary");
  const watchedWorkingDays = watch("workingDays");
  const watchedPresentDays = watch("presentDays");
  const watchedOvertimeHours = watch("overtimeHours");
  const watchedOvertimeRate = watch("overtimeRate");
  const paymentMethod = watch("paymentMethod");

  useEffect(() => {
  const fetchStructure = async () => {
    try {
      const res = await fetch(api.allSalary, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
      });
      const result = await res.json();
      if (result?.data) {
        setStructure(result.data); 
      }
    } catch (error) {
      console.error("Failed to fetch salary structure:", error);
    }
  };
  fetchStructure();
}, []);


  useEffect(() => {
    if (isEdit && id) {
      const fetchPayment = async () => {
        try {
          const response = await fetch(`${api.employeePayment}/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          });

          const result = await response.json();
          if (result?.data) {
            reset({
              employeeId: result?.data?.empid,
              status: result?.data?.status,
              month: result?.data?.date?.split("T")[0],
              paymentMethod: result?.data?.accountType,
              accountId: result?.data?.accountNo,
              basicSalary: result?.data?.basicSalary,
              workingDays: result?.data?.workingDay,
              presentDays: result?.data?.presentDay,
              overtimeHours: result?.data?.otHours,
              notes: result?.data?.note,
              overtimeRate: result?.data?.otRate,
              deductions: result?.data?.deductions?.map((p: any) => ({
                type: p.type,
                amount: p.amount,
              })) || [
                {
                  type: "",
                  amount: 0,
                },
              ],
              allowances: result?.data?.allowances?.map((p: any) => ({
                type: p.type,
                amount: p.amount,
              })) || [
                {
                  type: "",
                  amount: 0,
                },
              ],
            });
          }
        } catch (error) {
          console.error("Failed to fetch cash account:", error);
        }
      };

      fetchPayment();
    }
  }, [isEdit, id, reset]);

  React.useEffect(() => {
    if (watchedEmployeeId && structure.length > 0) {
      const selectedEmployee = employee.find(
        (emp) => emp._id === watchedEmployeeId
      );

      if (selectedEmployee) {
        const activeStructure = structure[0];

        if (activeStructure) {
          const basic = selectedEmployee.salary;
          const basicSalary =
            (basic * (parseFloat(activeStructure.basic) || 0)) / 100;

          setValue("basicSalary", basicSalary);

          const houseAllowance =
            (basic * (parseFloat(activeStructure.hrent) || 0)) / 100;
          const medicalAllowance =
            (basic * (parseFloat(activeStructure.medical) || 0)) / 100;
          const transportAllowance =
            (basic * (parseFloat(activeStructure.transport) || 0)) / 100;

          setValue("allowances", [
            { type: "House Rent Allowance", amount: houseAllowance },
            { type: "Medical Allowance", amount: medicalAllowance },
            { type: "Transport Allowance", amount: transportAllowance },
          ]);
        }
      }
    }
  }, [watchedEmployeeId, employee, structure, setValue]);

  useEffect(() => {
    let activeAccounts: any[] = [];

    switch (paymentMethod) {
      case "Cash":
        activeAccounts = cashAccounts.filter((acc) => acc.status === "active");
        break;
      case "Bank":
        activeAccounts = bankAccounts.filter((acc) => acc.status === "active");
        break;
      case "Mobile":
        activeAccounts = mobileAccounts.filter(
          (acc) => acc.status === "active"
        );
        break;
      default:
        activeAccounts = [];
    }

    setAccounts(activeAccounts);
  }, [paymentMethod, cashAccounts, bankAccounts, mobileAccounts]);

  // Watch the entire arrays
  const watchedAllowances = useWatch({
    control,
    name: "allowances",
  });

  const watchedDeductions = useWatch({
    control,
    name: "deductions",
  });

  useEffect(() => {
    const dailySalary =
      Number(watchedBasicSalary || 0) / Number(watchedWorkingDays || 1);
    const earnedSalary = dailySalary * Number(watchedPresentDays || 0);
    const overtimeAmount =
      Number(watchedOvertimeHours || 0) * Number(watchedOvertimeRate || 0);

    // Sum allowances and deductions
    const totalAllowance = (watchedAllowances || []).reduce(
      (sum, allowance) => sum + Number(allowance.amount || 0),
      0
    );
    const totalDeductions = (watchedDeductions || []).reduce(
      (sum, deduction) => sum + Number(deduction.amount || 0),
      0
    );

    const netSalary =
      earnedSalary + overtimeAmount + totalAllowance - totalDeductions;

    setValue("totalAllowance", totalAllowance);
    setValue("totalDeductions", totalDeductions);
    setValue("totalOTAmount", overtimeAmount);
    setValue("netSalary", netSalary);
    setValue("earnSalary", earnedSalary);
  }, [
    watchedBasicSalary,
    watchedWorkingDays,
    watchedPresentDays,
    watchedOvertimeHours,
    watchedOvertimeRate,
    watchedAllowances,
    watchedDeductions,
    setValue,
  ]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload: any = {
        compid: company?.id.toString(),
        empid: data?.employeeId,
        date: data?.month,
        basicSalary: data?.basicSalary,
        presentDay: data?.presentDays,
        workingDay: data?.workingDays,
        otHours: data?.overtimeHours,
        otRate: data?.overtimeRate,
        totalSalary: data?.earnSalary,
        allowances: data?.allowances,
        deductions: data?.deductions,
        note: data?.notes,
        accountType: data?.paymentMethod,
        accountNo: data?.accountId,
        totalDeductionAmount: data?.totalDeductions,
        totalAllowanceAmount: data?.totalAllowance,
        totalOTAmount: data?.totalOTAmount,
        status: data?.status,
        payAmount: data?.netSalary,
      };
      // Add regby if adding, upby if editing
      if (isEdit) {
        payload.upby = user?.id;
      } else {
        payload.regby = user?.id;
      }

      const url = isEdit ? `${api.employeePayment}/${id}` : api.employeePayment;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save employees");
      const result = await response.json();
      navigate("/salary");
    } catch (error) {
      console.error("Error saving employee payment:", error);
    }
  };

  const addAllowance = () => {
    appendAllowance({ type: "", amount: 0 });
  };

  const addDeduction = () => {
    appendDeduction({ type: "", amount: 0 });
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
          onClick={() => navigate("/salary")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Salary" : "Process Salary"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit
              ? "Update salary information"
              : "Process monthly salary for employee"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Employee & Period */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Employee & Period
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Employee *
              </label>
              <select
                {...register("employeeId")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select employee</option>
                {employee.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.employeeName} - {employee.roleName}
                  </option>
                ))}
              </select>
              {errors.employeeId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.employeeId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Salary Month *
              </label>
              <input
                {...register("month")}
                type="month"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {errors.month && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.month.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status *
              </label>
              <select
                {...register("status")}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Basic Salary & Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Basic Salary & Attendance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary *
              </label>
              <input
                {...register("basicSalary")}
                type="number"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
              {errors.basicSalary && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.basicSalary.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Working Days *
              </label>
              <input
                {...register("workingDays")}
                type="number"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.workingDays && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.workingDays.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Present Days *
              </label>
              <input
                {...register("presentDays")}
                type="number"
                max="31"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
              {errors.presentDays && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.presentDays.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overtime Hours
              </label>
              <input
                {...register("overtimeHours")}
                type="number"
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Overtime Rate
              </label>
              <input
                {...register("overtimeRate")}
                type="number"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
          </div>
        </motion.div>

        {/* Allowances */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Allowances
            </h2>
            <button
              type="button"
              onClick={addAllowance}
              className="flex items-center px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Allowance
            </button>
          </div>

          <div className="space-y-4">
            {allowanceFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Allowance Type *
                  </label>
                  <select
                    {...register(`allowances.${index}.type`)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select allowance type</option>
                    {allowanceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount *
                    </label>
                    <input
                      {...register(`allowances.${index}.amount`)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeAllowance(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {allowanceFields.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No allowances added
              </p>
            )}
          </div>
        </motion.div>

        {/* Deductions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Deductions
            </h2>
            <button
              type="button"
              onClick={addDeduction}
              className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Deduction
            </button>
          </div>

          <div className="space-y-4">
            {deductionFields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg"
              >
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Deduction Type *
                  </label>
                  <select
                    {...register(`deductions.${index}.type`)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select deduction type</option>
                    {deductionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Amount *
                    </label>
                    <input
                      {...register(`deductions.${index}.amount`)}
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeDeduction(index)}
                      className="p-2 text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {deductionFields.length === 0 && (
              <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                No deductions added
              </p>
            )}
          </div>
        </motion.div>

        {/* Salary Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salary Summary
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method *
                </label>
                <select
                  {...register("paymentMethod")}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select payment method</option>
                  {getPaymentMethods().map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.paymentMethod.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Account No *
                </label>
                <select
                  {...register("accountId")}
                  className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select account no</option>
                  {accounts.map((account) => (
                    <option key={account._id} value={account._id}>
                      {account.accountName}
                      {paymentMethod === "Cash"
                        ? ""
                        : ` (${account.accountNo})`}
                    </option>
                  ))}
                </select>
                {errors.accountId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.accountId.message}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Earned Salary:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  ${Number(watch("earnSalary") || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Overtime:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  $
                  {Number(
                    (watch("overtimeHours") || 0) * (watch("overtimeRate") || 0)
                  ).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Allowances:
                </span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  +${Number(watch("totalAllowance") || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Total Deductions:
                </span>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  -${Number(watch("totalDeductions") || 0).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Net Salary:
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ${Number(watch("netSalary") || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Additional Notes
          </h2>
          <textarea
            {...register("notes")}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter any additional notes or comments..."
          />
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate("/salary")}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors flex items-center"
          >
            {isSubmitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : null}
            {isEdit ? "Update Salary" : "Process Salary"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};
