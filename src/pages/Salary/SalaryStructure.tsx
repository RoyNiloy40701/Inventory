import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft } from "lucide-react";
import { api } from "../../api";
import { useAuth } from "../../contexts/AuthContext";

const schema = yup.object({
  basicSalary: yup
    .number()
    .typeError("Basic salary must be a number")
    .required("Basic salary is required")
    .min(0, "Basic salary cannot be negative"),

  houseRent: yup
    .number()
    .typeError("House Rent must be a number")
    .required("House Rent is required")
    .min(0, "House Rent cannot be negative"),

  medical: yup
    .number()
    .typeError("Medical must be a number")
    .required("Medical is required")
    .min(0, "Medical cannot be negative"),

  transport: yup
    .number()
    .typeError("Transport must be a number")
    .required("Transport is required")
    .min(0, "Transport cannot be negative"),
});

type FormData = yup.InferType<typeof schema>;

export const SalaryStructureForm: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      basicSalary: 0,
      houseRent: 0,
      medical: 0,
      transport: 0,
    },
  });

  useEffect(() => {
    const fetchSalary = async () => {
      try {
        const response = await fetch(`${api.allSalary}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch salary structure");

        const result = await response.json();

        // Reset form with database values
        reset({
          basicSalary: result.data[0]?.basic ?? 0,
          houseRent: result.data[0]?.hrent ?? 0,
          medical: result.data[0]?.medical ?? 0,
          transport: result.data[0]?.transport ?? 0,
        });
      } catch (error) {
        console.error("Failed to fetch salary structure:", error);
      }
    };

    fetchSalary();
  }, [reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const payload = {
        basic: data?.basicSalary,
        hrent: data?.houseRent,
        medical: data?.medical,
        transport: data?.transport,
        regby: user?.id,
      };
      const response = await fetch(`${api.salaryAdd}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to save salary structure");

      navigate("/salary");
    } catch (error) {
      console.error("Error saving salary structure:", error);
    }
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
            {"Salary Structure Setup"}
          </h1>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Salary & Attendance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Salary Structure Infromation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Basic Salary %
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
                House Rent %
              </label>
              <input
                {...register("houseRent")}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="House Rent"
              />
              {errors.houseRent && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.houseRent.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Medical %
              </label>
              <input
                {...register("medical")}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Medical"
              />
              {errors.medical && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.medical.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Transport %
              </label>
              <input
                {...register("transport")}
                type="number"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Transport"
              />
              {errors.transport && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.transport.message}
                </p>
              )}
            </div>
          </div>
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
            {"Submit"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};
