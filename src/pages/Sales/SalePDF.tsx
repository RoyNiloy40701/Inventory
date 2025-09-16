import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 12 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingBottom: 10,
  },
  title: { fontSize: 18, fontWeight: "bold" },
  subtitle: { fontSize: 12, marginTop: 2 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", marginBottom: 5 },
  table: {
    display: "table",
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
    marginTop: 10,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#eee",
    padding: 5,
    textAlign: "center",
  },
  tableCol: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
  },
  tableCellHeader: { fontSize: 10, fontWeight: "bold" },
  tableCell: { fontSize: 10 },
  summaryBox: {
    marginTop: 20,
    marginLeft: "auto",
    width: "35%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderStyle: "solid",
    padding: 10,
    borderRadius: 4,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  summaryLabel: { fontSize: 11 },
  summaryValue: { fontSize: 11, fontWeight: "bold" },
  statusBadge: {
    fontSize: 10,
    color: "white",
    padding: 3,
    borderRadius: 3,
    textAlign: "center",
  },
});

// Function to pick status color
const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "#22c55e"; // green
    case "pending":
      return "#facc15"; // yellow
    case "due":
    case "overdue":
      return "#ef4444"; // red
    default:
      return "#6b7280"; // gray
  }
};

const SalePDF = ({ sale, products }: { sale: any; products: any[] }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Invoice #{sale.invoice_no}</Text>
          <Text style={styles.subtitle}>
            Date: {new Date(sale.saleDate).toLocaleDateString()}
          </Text>
        </View>
        <View style={{ textAlign: "right" }}>
          <Text style={styles.subtitle}>Company Name</Text>
          <Text style={styles.subtitle}>Company Address</Text>
          <Text style={styles.subtitle}>+880123456789</Text>
        </View>
      </View>

      {/* Customer Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bill To:</Text>
        <Text>{sale.customerName}</Text>
        <Text>{sale.cMobile}</Text>
        <Text>{sale.cAddress}</Text>

        <Text
          style={[
            styles.statusBadge,
            { marginTop: 5, backgroundColor: getStatusColor(sale.sstatus) },
          ]}
        >
          {sale.sstatus ?? "Pending"}
        </Text>
      </View>

      {/* Products Table */}
      <View style={styles.section}>
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>#</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Product</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Warranty</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Unit Price</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Qty</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Total</Text>
            </View>
          </View>

          {/* Rows */}
          {products.map((p, index) => (
            <View key={p._id} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{index + 1}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.productName}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.warranty || "N/A"}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.sPrice}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.quantity}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{p.totalPrice}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Summary */}
      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>{sale.totalAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>VAT:</Text>
          <Text style={styles.summaryValue}>{sale.vAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Discount:</Text>
          <Text style={styles.summaryValue}>{sale.discountAmount || 0}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Paid:</Text>
          <Text style={styles.summaryValue}>{sale.pAmount}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { fontSize: 12 }]}>Due:</Text>
          <Text style={[styles.summaryValue, { fontSize: 12 }]}>{sale.dueAmount}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default SalePDF;
