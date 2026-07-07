import { n as utils, r as writeFileSync } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/export-B7MgEGmo.js
function exportCSV(filename, rows) {
	if (!rows.length) return;
	const ws = utils.json_to_sheet(rows, { skipHeader: true });
	const csv = utils.sheet_to_csv(ws, { FS: ";" });
	triggerDownload(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" }), filename.endsWith(".csv") ? filename : filename + ".csv");
}
function exportXLSX(filename, sheets) {
	const wb = utils.book_new();
	for (const [name, rows] of Object.entries(sheets)) {
		const ws = utils.json_to_sheet(rows, { skipHeader: true });
		utils.book_append_sheet(wb, ws, name.slice(0, 31));
	}
	writeFileSync(wb, filename.endsWith(".xlsx") ? filename : filename + ".xlsx");
}
function triggerDownload(blob, filename) {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	a.remove();
	setTimeout(() => URL.revokeObjectURL(url), 1e3);
}
//#endregion
export { exportXLSX as n, exportCSV as t };
