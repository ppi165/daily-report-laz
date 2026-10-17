interface ReportExportItem {
  id: string;
  content: string;
  division: string;
  createdAt: string | Date;
  author?: { name: string };
  [key: string]: unknown;
}

export function parseReportContent(rawContent: string): { pekerjaan: string; hasil: string } {
  if (!rawContent) return { pekerjaan: "-", hasil: "-" };

  let pekerjaan = rawContent;
  let hasil = "-";

  if (rawContent.includes("[PEKERJAAN]") && rawContent.includes("[HASIL / OUTPUT]")) {
    const parts = rawContent.split("[HASIL / OUTPUT]");
    pekerjaan = parts[0].replace("[PEKERJAAN]", "").trim();
    hasil = parts[1]?.trim() || "-";
  } else if (rawContent.includes("[PEKERJAAN]")) {
    pekerjaan = rawContent.replace("[PEKERJAAN]", "").trim();
  }

  return {
    pekerjaan: pekerjaan || "-",
    hasil: hasil || "-",
  };
}

export async function exportReportsToExcel(
  reports: ReportExportItem[],
  selectedDivision = "ALL",
  dateRangeLabel?: string
) {
  if (!reports || reports.length === 0) {
    return;
  }

  // Dynamic import XLSX (SheetJS) untuk memangkas ~1.2 MB bundle awal
  const XLSX = await import("xlsx");

  const rows = reports.map((r, index) => {
    const { pekerjaan, hasil } = parseReportContent(r.content || "");
    const dateObj = new Date(r.createdAt);
    const formattedDate = !isNaN(dateObj.getTime())
      ? `${dateObj.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })}, ${dateObj.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })} WIB`
      : "-";

    return {
      "No": index + 1,
      "Waktu": formattedDate,
      "Nama Pegawai": r.author?.name || "Anonim",
      "Divisi": r.division || "-",
      "Pekerjaan": pekerjaan,
      "Hasil / Output": hasil,
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);

  // Lebar kolom rapi dan proporsional untuk file Excel
  worksheet["!cols"] = [
    { wch: 6 },   // No
    { wch: 25 },  // Waktu
    { wch: 26 },  // Nama Pegawai
    { wch: 20 },  // Divisi
    { wch: 55 },  // Pekerjaan
    { wch: 55 },  // Hasil / Output
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Daily Report");

  const divName =
    selectedDivision === "ALL"
      ? "Semua_Divisi"
      : selectedDivision.replace(/\s+/g, "_");
      
  const dateSuffix = dateRangeLabel
    ? `_${dateRangeLabel.replace(/[^a-zA-Z0-9-]/g, "_")}`
    : `_${new Date().toISOString().split("T")[0]}`;
    
  const fileName = `Rekap_Daily_Report_LAZ_Persis_${divName}${dateSuffix}.xlsx`;

  XLSX.writeFile(workbook, fileName);
}
