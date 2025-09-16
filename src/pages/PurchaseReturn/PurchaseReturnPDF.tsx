import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: "Helvetica",
  },

  // Top Section
  topColumns: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  topColumn: {
    width: "32%",
  },

  // Company Info / Supplier / Return Details
  companyName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  companyInfo: {
    marginBottom: 2,
  },
  sectionHeading: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 6,
  },

  // Table
  table: {
    display: "table",
    width: "auto",
    marginBottom: 15,
  },
  tableRow: {
    flexDirection: "row",
  },
  tableColHeader: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    backgroundColor: "#eee",
    padding: 6,
    fontWeight: "bold",
  },
  tableCol: {
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#000",
    padding: 6,
  },

  // Totals Row
  totalRow: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
  },
  totalColLabel: {
    width: "75%",
    padding: 6,
    fontWeight: "bold",
    textAlign: "right",
  },
  totalColValue: {
    width: "25%",
    padding: 6,
    fontWeight: "bold",
  },

  // Notes
  noteBox: {
    marginTop: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  // Signatures
  signatureSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  signatureBox: {
    flexDirection: "column",
    alignItems: "center",
    width: "30%",
  },
  signatureLine: {
    borderBottomWidth: 1,
    borderColor: "#000",
    width: "80%",
    textAlign: "center",
    marginBottom: 5,
  },
  signatureTitle: {
    fontWeight: "bold",
    fontSize: 12,
  },
});

interface PurchaseReturnPDFProps {
  returnData: any;
  product: any[];
  supplier: any[];
  formatCurrency: (value: number) => string;
}

export const PurchaseReturnPDF: React.FC<PurchaseReturnPDFProps> = ({
  returnData,
  product,
  supplier,
  formatCurrency,
}) => {
  const matchedSupplier = supplier.find(
    (s: any) => s._id === returnData.sup_id
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        // Top 3 columns in PDF
        <View style={styles.topColumns}>
          {/* Company Info */}
          <View style={styles.topColumn}>
            <Text style={{ fontWeight: "bold" }}>Company Info</Text>
            <Text>Inflame Solutions Ltd.</Text>
            <Text>House-16 Rd 101, Dhaka 1212</Text>
            <Text>Gulshan Pink City Shopping Complex</Text>
            <Text>Email: info@example.com</Text>
          </View>

          {/* Return Details */}
          <View style={styles.topColumn}>
            <Text style={{ fontWeight: "bold" }}>Return Details</Text>
            <Text>Return ID: {returnData._id}</Text>
            <Text>Invoice No: {returnData.invoice || "—"}</Text>
            <Text>
              Return Date:{" "}
              {new Date(returnData.returnDate).toLocaleDateString()}
            </Text>
          </View>

          {/* Supplier Info */}
          <View style={styles.topColumn}>
            <Text style={{ fontWeight: "bold" }}>Supplier Info</Text>
            <Text>{matchedSupplier?.compName || returnData.sup_id}</Text>
            <Text>{matchedSupplier?.supplierName || ""}</Text>
            {matchedSupplier?.email && (
              <Text>Email: {matchedSupplier.email}</Text>
            )}
            {matchedSupplier?.mobile && (
              <Text>Phone: {matchedSupplier.mobile}</Text>
            )}
          </View>
        </View>
        {/* Products Table */}
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableColHeader, { width: "5%" }]}>#</Text>
            <Text style={[styles.tableColHeader, { width: "45%" }]}>
              Product
            </Text>
            <Text style={[styles.tableColHeader, { width: "10%" }]}>Qty</Text>
            <Text style={[styles.tableColHeader, { width: "20%" }]}>
              Unit Price
            </Text>
            <Text style={[styles.tableColHeader, { width: "20%" }]}>
              Subtotal
            </Text>
          </View>
          {returnData.products.map((item: any, idx: number) => {
            const matchedProduct = product.find(
              (p: any) => p._id === item.productID
            );
            const subtotal = item.quantity * item.unitPrice;
            return (
              <View style={styles.tableRow} key={item._id}>
                <Text style={[styles.tableCol, { width: "5%" }]}>
                  {idx + 1}
                </Text>
                <Text style={[styles.tableCol, { width: "45%" }]}>
                  {matchedProduct
                    ? `${matchedProduct.productName} (${matchedProduct.productcode})`
                    : item.productID || "—"}
                </Text>
                <Text style={[styles.tableCol, { width: "10%" }]}>
                  {item.quantity}
                </Text>
                <Text style={[styles.tableCol, { width: "20%" }]}>
                  {formatCurrency(item.unitPrice)}
                </Text>
                <Text style={[styles.tableCol, { width: "20%" }]}>
                  {formatCurrency(subtotal)}
                </Text>
              </View>
            );
          })}
          {/* Total Row */}
          // Totals
          <View style={styles.tableRow}>
            <Text style={[styles.tableCol, { width: "5%" }]}></Text>
            <Text style={[styles.tableCol, { width: "45%" }]}>Total:</Text>
            <Text style={[styles.tableCol, { width: "10%" }]}>
              {returnData.products.reduce(
                (sum: number, item: any) => sum + item.quantity,
                0
              )}
            </Text>
            <Text style={[styles.tableCol, { width: "20%" }]}></Text>
            <Text style={[styles.tableCol, { width: "20%" }]}>
              {formatCurrency(returnData.totalPrice)}
            </Text>
          </View>
        </View>
        {/* Notes */}
        {returnData.note && (
          <View style={styles.noteBox}>
            <Text style={styles.sectionHeading}>Notes</Text>
            <Text>{returnData.note}</Text>
          </View>
        )}
        {/* Signatures */}
        <View style={styles.signatureSection}>
          {["Checked By", "Prepared By", "Approved By"].map((title, idx) => (
            <View style={styles.signatureBox} key={idx}>
              <Text style={styles.signatureLine}></Text>
              <Text style={styles.signatureTitle}>{title}</Text>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  );
};
