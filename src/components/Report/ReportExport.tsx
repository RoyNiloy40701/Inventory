import React from "react";
import { Download, Printer, FileText } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportExportProps {
	fileName: string;
	tableId: string; // ID of the table to export
}

export const ReportExport: React.FC<ReportExportProps> = ({
	fileName,
	tableId,
}) => {
	const handleExportCSV = () => {
		const table = document.getElementById(tableId) as HTMLTableElement;
		if (!table) return;

		let csv: string[] = [];
		const rows = table.querySelectorAll("tr");

		rows.forEach((row) => {
			const cols = row.querySelectorAll("td, th");
			const rowData: string[] = [];
			cols.forEach((col) => rowData.push(`"${col.textContent?.trim()}"`));
			csv.push(rowData.join(","));
		});

		const blob = new Blob([csv.join("\n")], { type: "text/csv" });
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `${fileName}.csv`;
		a.click();
	};

	// ✅ Same-page print
	const handlePrint = () => {
		const tableHTML = document.getElementById(tableId)?.outerHTML;
		if (!tableHTML) return;

		// Save original body
		const originalContent = document.body.innerHTML;

		// Replace body with printable content
		document.body.innerHTML = `
      <div style="text-align:center; margin-bottom:10px;">
        <h2>${fileName}</h2>
        <p>Exported on: ${new Date().toLocaleString()}</p>
      </div>
      ${tableHTML}
      <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #2980b9; color: white; font-weight: bold; }
        tr:nth-child(even) { background-color: #f2f2f2; }
      </style>
    `;

		window.print();

		// Restore original body
		document.body.innerHTML = originalContent;
	};

	const handleExportPDF = () => {
		const table = document.getElementById(tableId);
		if (!table) return;

		const doc = new jsPDF();
		const headers: string[] = [];
		const rows: any[] = [];

		table.querySelectorAll("tr").forEach((tr, index) => {
			const cols = Array.from(tr.querySelectorAll("th, td")).map(
				(c) => c.textContent?.trim() || ""
			);
			if (index === 0) headers.push(...cols);
			else rows.push(cols);
		});

		doc.setFontSize(16);
		doc.setFont("helvetica", "bold");
		doc.text(fileName, doc.internal.pageSize.getWidth() / 2, 15, {
			align: "center",
		});

		doc.setFontSize(10);
		doc.setFont("helvetica", "normal");
		doc.text(`Exported on: ${new Date().toLocaleString()}`, 14, 22);

		autoTable(doc, {
			head: [headers],
			body: rows,
			startY: 30,
			theme: "grid",
			headStyles: {
				fillColor: [41, 128, 185],
				textColor: 255,
				fontStyle: "bold",
				halign: "center",
			},
			bodyStyles: { fontSize: 10, textColor: 50 },
			alternateRowStyles: { fillColor: [240, 240, 240] },
			columnStyles: {
				0: { cellWidth: 10 },
				1: { cellWidth: 25 },
				2: { cellWidth: 30 },
				3: { cellWidth: 25 },
				4: { cellWidth: 25 },
				5: { cellWidth: 25 },
				6: { cellWidth: 25 },
			},
		});

		const totalPurchase = rows.reduce(
			(sum, r) => sum + parseFloat(r[4] || 0),
			0
		);
		const totalPaid = rows.reduce((sum, r) => sum + parseFloat(r[5] || 0), 0);
		const totalDue = rows.reduce((sum, r) => sum + parseFloat(r[6] || 0), 0);

		doc.setFont("helvetica", "bold");
		doc.text(
			`Total Purchase: ${totalPurchase.toFixed(
				2
			)} | Total Paid: ${totalPaid.toFixed(2)} | Total Due: ${totalDue.toFixed(
				2
			)}`,
			14,
			doc.internal.pageSize.getHeight() - 20
		);

		doc.save(`${fileName}.pdf`);
	};

	return (
		<div className="flex gap-2">
			<button
				onClick={handleExportCSV}
				className="flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
			>
				<Download className="w-4 h-4 mr-2" /> CSV
			</button>
			<button
				onClick={handleExportPDF}
				className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
			>
				<FileText className="w-4 h-4 mr-2" /> PDF
			</button>
			<button
				onClick={handlePrint}
				className="flex items-center px-3 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
			>
				<Printer className="w-4 h-4 mr-2" /> Print
			</button>
		</div>
	);
};
