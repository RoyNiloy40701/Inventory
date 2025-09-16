import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, useFieldArray, Controller, useWatch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { useDropdowns } from "../../contexts/DropDownContext";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../api";
import { formatDateTime } from "../../utils/dateFormatter";
import { Editor } from "@tinymce/tinymce-react";

interface Account {
  _id: string;
  accountName: string;
  accountNo?: string;
  status?: string;
}

const itemSchema = yup.object({
  productId: yup.string().required("Product is required"),
  quantity: yup
    .number()
    .typeError("Quantity must be a number") // handles empty inputs
    .integer("Quantity must be an integer")
    .positive("Quantity must be positive")
    .required("Quantity is required"),
  unitPrice: yup
    .number()
    .typeError("Unit price must be a number")
    .min(0, "Unit price must be 0 or greater")
    .required("Unit price is required"),
  totalPrice: yup
    .number()
    .typeError("Total price must be a number")
    .min(0, "Total price must be 0 or greater")
    .required("Total price is required"),
});

const schema = yup.object({
  customerId: yup.string().required("Customer Name is required"),
  taxType: yup.string().optional(),
  taxAmount: yup
    .number()
    .typeError("Tax amount must be a number")
    .min(0, "Tax amount cannot be negative")
    .optional(),
  discountType: yup.string().optional(),
  discountAmount: yup
    .number()
    .typeError("Discount amount must be a number")
    .min(0, "Discount amount cannot be negative")
    .optional(),
  paymentMethod: yup.string().required("Payment method is required"),
  paidAmount: yup
    .number()
    .typeError("Paid amount must be a number")
    .min(0, "Paid amount cannot be negative")
    .required("Paid Amount is required"),
  accountId: yup.string().required("Account No is required"),
  date: yup
    .date()
    .transform((value, originalValue) => (originalValue === "" ? null : value))
    .typeError("Date must be a valid date")
    .required("Date is required"),
  items: yup.array().of(itemSchema).min(1, "At least one product is required"),
  subtotal: yup.number().min(0, "Subtotal cannot be negative").optional(),
  total: yup.number().min(0, "Total cannot be negative").optional(),
  notes: yup.string().optional(),
  termsCondition: yup.string().optional(),
  dueAmount: yup.string().optional(),

  adjustmentAmount: yup
    .number()
    .typeError("Adjustment amount must be a number")
    .notRequired(),
});

type FormData = yup.InferType<typeof schema>;

export const SaleForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const { user, company } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [vatType, setVatType] = useState<"percent" | "fixed">("fixed");
  const [vatValue, setVatValue] = useState(0);

  const [discountType, setDiscountType] = useState<"percent" | "fixed">(
    "fixed"
  );
  const [discountValue, setDiscountValue] = useState(0);
  const [calculatedDiscount, setCalculatedDiscount] = useState(0);
  const [calculatedVat, setCalculatedVat] = useState(0);

  const getPaymentMethods = () => ["Cash", "Mobile", "Bank"];
  const { mobileAccounts, bankAccounts, cashAccounts, customers, product } =
    useDropdowns();

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
      customerId: "",
      purchaseNumber: "",
      termsCondition: "",
      date: new Date().toISOString().split("T")[0],
      items: [
        {
          productId: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
      paymentMethod: "",
      paidAmount: 0,
      accountId: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const paymentMethod = watch("paymentMethod");
  // inside PurchasesForm
  const items = watch("items");
  const paidAmount = watch("paidAmount") || 0;
  const adjustmentAmount = watch("adjustmentAmount") || 0;

  // Calculate total for each row & update
  useEffect(() => {
    items?.forEach((item, index) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.unitPrice) || 0;
      const total = qty * price;

      // set individual totalPrice automatically
      setValue(`items.${index}.totalPrice`, total, { shouldValidate: true });
    });

    // Calculate subtotal (all items)
    const subtotal = items?.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );

    const discountAmount =
      discountType === "percent"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const vatAmount =
      vatType === "percent" ? (subtotal * vatValue) / 100 : vatValue;

    const grandTotal = subtotal - discountAmount + vatAmount;
    setCalculatedDiscount(discountAmount);
    setCalculatedVat(vatAmount);

    //	setValue("totalPrice", subtotal, { shouldValidate: true });
    //setValue("totalAmount", grandTotal, { shouldValidate: true });

    setValue("subtotal", subtotal, { shouldValidate: true });
    setValue("total", grandTotal, { shouldValidate: true });
  }, [items, setValue, vatType, vatValue, discountType, discountValue]);

  // Compute Due Amount
  const subtotal = watch("subtotal") || 0;
  const total = watch("total") || 0;
  const dueAmount = isEdit
    ? total - (paidAmount + adjustmentAmount)
    : total - paidAmount;

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

  useEffect(() => {
    if (isEdit && id) {
      const fetchUnit = async () => {
        try {
          const response = await fetch(`${api.sale}/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          });

          const result = await response.json();
          if (result?.data) {
            reset({
              customerId: result?.data?.customerID,
              date: result?.data?.saleDate?.split("T")[0],
              paymentMethod: result?.data?.accountType,
              accountId: result?.data?.accountNo,
              total: result?.data?.totalAmount,
              paidAmount: result?.data?.paidAmount,
              discountAmount: result?.data?.discount,
              taxAmount: result?.data?.vat,
              notes: result?.data?.note,
              taxType: result?.data?.vType,
              discountType: result?.data?.discountType,
              items: result?.data?.products?.map((p: any) => ({
                productId: p.productID,
                quantity: p.quantity,
                unitPrice: p.sPrice,
                totalPrice: p.totalPrice,
              })) || [
                {
                  productId: "",
                  quantity: 1,
                  unitPrice: 0,
                  totalPrice: 0,
                },
              ],
            });

            if (result?.data?.discountType) {
              setDiscountType(result?.data?.discountType);
            }
            if (result?.data?.discount) {
              setDiscountValue(result?.data?.discount);
            }
            if (result?.data?.vType) {
              setVatType(result?.data?.vType);
            }
            if (result?.data?.vat) {
              setVatValue(result?.data?.vat);
            }
          }
        } catch (error) {
          console.error("Failed to fetch cash account:", error);
        }
      };

      fetchUnit();
    }
  }, [isEdit, id, reset]);

  const onSubmit = async (data: FormData) => {
    try {
      const salePayload: any = {
        accountType: data?.paymentMethod,
        accountNo: data?.accountId,
        customerID: data?.customerId,
        saleDate: data?.date,
        subTotal: subtotal,
        totalAmount: total,
        paidAmount: paidAmount,
        pAmount: paidAmount,
        dueAmount: dueAmount,
        note: data?.notes,
        discount: data?.discountAmount,
        discountAmount: calculatedDiscount,
        discountType: data?.discountType ?? discountType,
        vat: data?.taxAmount,
        vType: data?.taxType ?? vatType,
        vAmount: calculatedVat,
        compid: company?.id.toString(),
        terms: data?.termsCondition,
        amount: isEdit ? data?.adjustmentAmount : data?.paidAmount,
      };

      if (isEdit) {
        salePayload.upby = user?.id;
      } else {
        salePayload.regby = user?.id;
      }

      const url = isEdit ? `${api.sale}/${id}` : api.sale;
      const method = isEdit ? "PUT" : "POST";

      const saleRes = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
        },
        body: JSON.stringify(salePayload),
      });

      const saleResult = await saleRes.json();
      if (!saleRes.ok) {
        throw new Error(saleResult.message || "Failed to save sale");
      }

      const saleId = saleResult.data._id;

      if (items?.length) {
        for (const item of items) {
          const productPayload = {
            saleID: saleId,
            productID: item?.productId,
            quantity: item?.quantity,
            sPrice: item?.unitPrice,
            totalPrice: item?.totalPrice,
            compid: company?.id.toString(),
            regby: user?.id,
          };

          await fetch(api.saleProduct, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
            body: JSON.stringify(productPayload),
          });
        }
      }

      if (
        (!isEdit && data?.paidAmount && data?.paidAmount > 0) ||
        (isEdit && data?.adjustmentAmount && data?.adjustmentAmount > 0)
      ) {
        const paymentPayload = {
          saleID: saleId,
          amount: isEdit ? data?.adjustmentAmount : data?.paidAmount,
          compid: company?.id.toString(),
          accountType: data?.paymentMethod,
          accountNo: data?.accountId,
          regby: user?.id,
        };

        await fetch(api.salePayment, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
          body: JSON.stringify(paymentPayload),
        });
      }

      navigate("/sales");
    } catch (error: any) {
      console.error("Error saving purchase:", error.message);
    }
  };

  const addItem = () => {
    const hasEmptyProduct = items?.some((item) => !item.productId);
    if (hasEmptyProduct) {
      alert("Please select a product before adding a new one.");
      return;
    }
    append({
      productId: "",
      quantity: 1,
      unitPrice: 0,
      totalPrice: 0,
    });
  };

  const handleUnitPriceChange = (index: number, value: string) => {
    const price = Number(value) || 0;
    const qty = Number(watch(`items.${index}.quantity`)) || 0;
    const total = qty * price;

    // Update the current row
    setValue(`items.${index}.unitPrice`, price, { shouldValidate: true });
    setValue(`items.${index}.totalPrice`, total, { shouldValidate: true });

    // Recalculate subtotal & total
    const updatedItems = [...items];
    updatedItems[index].unitPrice = price;
    updatedItems[index].totalPrice = total;

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
    const discountAmount =
      discountType === "percent"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const vatAmount =
      vatType === "percent" ? (subtotal * vatValue) / 100 : vatValue;

    const grandTotal = subtotal - discountAmount + vatAmount;
    setCalculatedDiscount(discountAmount);
    setCalculatedVat(vatAmount);

    setValue("subtotal", subtotal, { shouldValidate: true });
    setValue("total", grandTotal, { shouldValidate: true });
  };

  const handleQuantityChange = (index: number, value: string) => {
    const qty = Number(value) || 0;
    const price = Number(watch(`items.${index}.unitPrice`)) || 0;
    const total = qty * price;

    setValue(`items.${index}.quantity`, qty, { shouldValidate: true });
    setValue(`items.${index}.totalPrice`, total, { shouldValidate: true });

    // Recalculate subtotal & total
    const updatedItems = [...items];
    updatedItems[index].quantity = qty;
    updatedItems[index].totalPrice = total;

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
    const discountAmount =
      discountType === "percent"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const vatAmount =
      vatType === "percent" ? (subtotal * vatValue) / 100 : vatValue;

    const grandTotal = subtotal - discountAmount + vatAmount;
    setCalculatedDiscount(discountAmount);
    setCalculatedVat(vatAmount);
    setValue("subtotal", subtotal, { shouldValidate: true });
    setValue("total", grandTotal, { shouldValidate: true });
  };

  const handleProductChange = (index: number, productId: string) => {
    const duplicate = items?.some(
      (item, i) => item.productId === productId && i !== index
    );
    if (duplicate) {
      alert("This product is already added!");
      setValue(`items.${index}.productId`, ""); // reset duplicate
      return;
    }

    const selectedProduct = product.find((p) => p._id === productId);
    const qty = Number(watch(`items.${index}.quantity`)) || 1;

    if (selectedProduct) {
      const price = selectedProduct.sprice || 0;
      setValue(`items.${index}.unitPrice`, price, { shouldValidate: true });
      setValue(`items.${index}.totalPrice`, price * qty, {
        shouldValidate: true,
      });
    } else {
      setValue(`items.${index}.unitPrice`, 0, { shouldValidate: true });
      setValue(`items.${index}.totalPrice`, 0, { shouldValidate: true });
    }

    // Recalculate subtotal & total
    const updatedItems = [...items];
    updatedItems[index].unitPrice = selectedProduct?.sprice || 0;
    updatedItems[index].totalPrice = (selectedProduct?.sprice || 0) * qty;

    const subtotal = updatedItems.reduce(
      (sum, item) => sum + (Number(item.totalPrice) || 0),
      0
    );
    const discountAmount =
      discountType === "percent"
        ? (subtotal * discountValue) / 100
        : discountValue;

    const vatAmount =
      vatType === "percent" ? (subtotal * vatValue) / 100 : vatValue;

    const grandTotal = subtotal - discountAmount + vatAmount;
    setCalculatedDiscount(discountAmount);
    setCalculatedVat(vatAmount);

    setValue("subtotal", subtotal, { shouldValidate: true });
    setValue("total", grandTotal, { shouldValidate: true });
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
          onClick={() => navigate("/sales")}
          className="p-2 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {isEdit ? "Edit Sale" : "New Sale"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isEdit ? "Update sale information" : "Create a new sale"}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Purchase Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Sale Details
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer *
              </label>
              <select
                {...register("customerId")}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Customer</option>
                {customers?.map((customer) => (
                  <option key={customer._id} value={customer._id}>
                    {customer.customerName}
                  </option>
                ))}
              </select>
              {errors.customerId && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors.customerId.message}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sale Date *
              </label>
              <input
                {...register("date")}
                type="date"
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              />
              {errors.date && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.date.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Product Details
            </h2>
            <button
              type="button"
              onClick={addItem}
              className="flex items-center px-3 py-2 text-sm font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Product
            </button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="grid grid-cols-1 gap-4 p-4 border border-gray-200 rounded-lg md:grid-cols-10 dark:border-gray-600"
              >
                <div className="md:col-span-3">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product *
                  </label>
                  <select
                    {...register(`items.${index}.productId`)}
                    onChange={(e) => handleProductChange(index, e.target.value)}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select product</option>
                    {product.map((product) => (
                      <option key={product._id} value={product._id}>
                        {product.productName}
                      </option>
                    ))}
                  </select>
                  {errors.items?.[index]?.productId && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.items[index].productId?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Quantity *
                  </label>
                  <input
                    {...register(`items.${index}.quantity`)}
                    type="number"
                    min="1"
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="1"
                    onChange={(e) =>
                      handleQuantityChange(index, e.target.value)
                    }
                  />
                  {errors.items?.[index]?.quantity && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.items[index].quantity?.message}
                    </p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Unit Price *
                  </label>
                  <input
                    {...register(`items.${index}.unitPrice`)}
                    type="number"
                    step="0.01"
                    onChange={(e) =>
                      handleUnitPriceChange(index, e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.items?.[index]?.unitPrice && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.items[index].unitPrice?.message}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Total Price *
                  </label>
                  <input
                    {...register(`items.${index}.totalPrice`)}
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    readOnly
                  />
                  {errors.items?.[index]?.totalPrice && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.items[index].totalPrice?.message}
                    </p>
                  )}
                </div>

                <div className="flex items-end md:col-span-1">
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                    className="w-full p-2 text-red-600 transition-colors hover:text-red-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Calculations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Calculations
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Type
                  </label>
                  <select
                    {...register("discountType")}
                    onChange={(e) =>
                      setDiscountType(e.target.value as "percent" | "fixed")
                    }
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Discount Type</option>
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  {errors.discountType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.discountType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Discount Amount
                  </label>
                  <input
                    {...register(`discountAmount`)}
                    type="number"
                    step="0.01"
                    defaultValue="0"
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.discountAmount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.discountAmount.message}
                    </p>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    VAT Type
                  </label>
                  <select
                    {...register("taxType")}
                    onChange={(e) =>
                      setVatType(e.target.value as "percent" | "fixed")
                    }
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select VAT Type</option>
                    <option value="percent">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                  {errors.taxType && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.taxType.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    VAT Amount
                  </label>
                  <input
                    {...register(`taxAmount`)}
                    type="number"
                    onChange={(e) => setVatValue(Number(e.target.value))}
                    step="0.01"
                    defaultValue="0"
                    className="w-full px-3 py-2 text-sm text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {errors.taxAmount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.taxAmount.message}
                    </p>
                  )}
                </div>
              </div>
              {/* Paid Amount */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Paid Amount
                </label>
                <input
                  {...register("paidAmount", { valueAsNumber: true })}
                  type="number"
                  readOnly={isEdit}
                  step="0.01"
                  min={0}
                  className={`w-full px-3 py-2 text-gray-900 bg-white border rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:border-transparent ${
                    paidAmount > total
                      ? "border-red-500 ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                  placeholder="Enter Paid Amount"
                />
                {paidAmount > total && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    Paid amount cannot exceed total ({total.toFixed(2)})
                  </p>
                )}
              </div>

              {isEdit && (
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Adjustment Amount
                  </label>
                  <input
                    {...register("adjustmentAmount", { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    defaultValue={0}
                    className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter additional payment"
                  />
                  {errors.adjustmentAmount && (
                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                      {errors.adjustmentAmount.message}
                    </p>
                  )}
                </div>
              )}
            </div>
            <div className="p-4 space-y-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-600 text-md dark:text-gray-400">
                  SubTotal Price:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-md dark:text-gray-400">
                  Vat:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Number(calculatedVat || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-md dark:text-gray-400">
                  Discount:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {Number(calculatedDiscount || 0).toFixed(2)}
                </span>
              </div>
              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Total Amount:
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {total?.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 text-md dark:text-gray-400">
                  Paid Amount:
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {paidAmount.toFixed(2)}
                </span>
              </div>

              <div className="pt-3 border-t border-gray-200 dark:border-gray-600">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">
                    Due Amount:
                  </span>
                  <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    {dueAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Status & Payment */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="p-6 bg-white border border-gray-200 shadow-sm dark:bg-gray-800 rounded-xl dark:border-gray-700"
        >
          <h2 className="mb-4 text-lg font-semibold text-gray-900 dark:text-white">
            Status & Payment
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Payment Method *
              </label>
              <select
                {...register("paymentMethod")}
                className="w-full px-3 py-2 border rounded-lg dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select payment method</option>
                {getPaymentMethods().map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">
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
                    {paymentMethod === "Cash" ? "" : ` (${account.accountNo})`}
                  </option>
                ))}
              </select>
              {errors.accountId && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.accountId.message}
                </p>
              )}
            </div>

            <div className="md:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-3 py-2 text-gray-900 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter any additional notes..."
              />
            </div>

            <div className="md:col-span-3">
              <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Terms & Conditions
              </label>

              <Controller
                name="termsCondition"
                control={control}
                render={({ field }) => (
                  <Editor
                    apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
                    value={field.value}
                    onEditorChange={(content) => field.onChange(content)}
                    init={{
                      height: 300,
                      width: "100%",
                      menubar: true,
                      plugins: ["link", "lists", "image", "table"],
                      toolbar:
                        "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | link image",
                      resize: true,
                    }}
                  />
                )}
              />

              {errors.termsCondition && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.termsCondition.message}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Form Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex items-center justify-end space-x-4"
        >
          <button
            type="button"
            onClick={() => navigate("/sales")}
            className="px-6 py-2 font-medium text-gray-700 transition-colors border border-gray-300 rounded-lg dark:border-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || paidAmount > total}
            className="flex items-center px-6 py-2 font-medium text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <div className="w-4 h-4 mr-2 border-b-2 border-white rounded-full animate-spin"></div>
            ) : null}
            {isEdit ? "Update Sale" : "Create Sale"}
          </button>
        </motion.div>
      </form>
    </div>
  );
};
