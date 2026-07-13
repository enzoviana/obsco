// CSV + XLSX export helpers using SheetJS
import * as XLSX from "xlsx";

export function exportCSV(filename: string, rows: Record<string, unknown>[]) {
  if (!rows.length) return;
  const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
  const csv = XLSX.utils.sheet_to_csv(ws, { FS: ";" });
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  triggerDownload(blob, filename.endsWith(".csv") ? filename : filename + ".csv");
}

export function exportXLSX(filename: string, sheets: Record<string, Record<string, unknown>[]>) {
  const wb = XLSX.utils.book_new();
  for (const [name, rows] of Object.entries(sheets)) {
    const ws = XLSX.utils.json_to_sheet(rows, { skipHeader: true });
    XLSX.utils.book_append_sheet(wb, ws, name.slice(0, 31));
  }
  XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : filename + ".xlsx");
}

export function exportStyledImportXLSX(
  filename: string,
  suppliers: string[],
  products: Array<{ name: string; cip: string }>
) {
  const wb = XLSX.utils.book_new();

  // Créer les en-têtes
  const headerRow1 = ["Produit"];
  const headerRow2 = [""];

  for (const supplier of suppliers) {
    headerRow1.push(supplier, "", "");
    headerRow2.push("Ventes", "Stocks", "Cmd");
  }

  headerRow1.push("Total", "", "");
  headerRow2.push("Ventes", "Stocks", "Cmd");

  // Créer les lignes de données
  const dataRows = products.map(p => {
    const row = [`${p.name} (${p.cip})`];
    for (const _ of suppliers) {
      row.push(0, 0, 0); // Ventes, Stocks, Cmd
    }
    row.push(0, 0, 0); // Total Ventes, Stocks, Cmd
    return row;
  });

  // Ligne de totaux
  const totalRow = ["TOTAL"];
  for (const _ of suppliers) {
    totalRow.push(0, 0, 0);
  }
  totalRow.push(0, 0, 0);

  // Combiner toutes les lignes
  const allData = [headerRow1, headerRow2, ...dataRows, totalRow];

  // Créer la feuille
  const ws = XLSX.utils.aoa_to_sheet(allData);

  // Calculer la plage
  const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');

  // Définir les largeurs de colonnes
  const colWidths = [{ wch: 40 }]; // Colonne Produit
  for (let i = 0; i < suppliers.length * 3 + 3; i++) {
    colWidths.push({ wch: 12 });
  }
  ws['!cols'] = colWidths;

  // Styles pour les cellules
  // Note: xlsx-js-style est nécessaire pour le style complet, mais je vais utiliser les propriétés de base disponibles

  // Fusion des cellules pour les en-têtes fournisseurs (ligne 1)
  if (!ws['!merges']) ws['!merges'] = [];

  let colIndex = 1; // Commencer après la colonne Produit
  for (const supplier of suppliers) {
    const start = XLSX.utils.encode_col(colIndex);
    const end = XLSX.utils.encode_col(colIndex + 2);
    ws['!merges'].push({
      s: { r: 0, c: colIndex },
      e: { r: 0, c: colIndex + 2 }
    });
    colIndex += 3;
  }

  // Fusionner "Total" en ligne 1
  const totalStartCol = 1 + suppliers.length * 3;
  ws['!merges'].push({
    s: { r: 0, c: totalStartCol },
    e: { r: 0, c: totalStartCol + 2 }
  });

  // Appliquer des styles basiques avec les propriétés disponibles
  // Pour un style plus avancé, il faudrait utiliser xlsx-js-style
  // Mais on peut au moins définir le format des cellules

  // Centrer les en-têtes
  for (let c = 0; c <= range.e.c; c++) {
    const cellAddress1 = XLSX.utils.encode_cell({ r: 0, c });
    const cellAddress2 = XLSX.utils.encode_cell({ r: 1, c });

    if (ws[cellAddress1]) {
      ws[cellAddress1].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "4472C4" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }

    if (ws[cellAddress2]) {
      ws[cellAddress2].s = {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: "D9E1F2" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
  }

  // Style pour la ligne de totaux (dernière ligne)
  const lastRow = 2 + products.length;
  for (let c = 0; c <= range.e.c; c++) {
    const cellAddress = XLSX.utils.encode_cell({ r: lastRow, c });
    if (ws[cellAddress]) {
      ws[cellAddress].s = {
        font: { bold: true, sz: 11 },
        fill: { fgColor: { rgb: "FFF2CC" } },
        alignment: { horizontal: c === 0 ? "left" : "center", vertical: "center" }
      };
    }
  }

  // Ajouter la feuille au classeur
  XLSX.utils.book_append_sheet(wb, ws, "Import Données");

  // Écrire le fichier
  XLSX.writeFile(wb, filename.endsWith(".xlsx") ? filename : filename + ".xlsx");
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function parseUploadedFile(file: File): Promise<Record<string, unknown>[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const wb = XLSX.read(data, { type: "binary" });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        resolve(XLSX.utils.sheet_to_json(sheet));
      } catch (err) { reject(err); }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsBinaryString(file);
  });
}
