import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as getAgencies, x as getPanoramicProducts, y as getGrossistes } from "./agencies-BIm1ZU-s.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Button } from "./button-DRsC1qZi.mjs";
import { _ as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { F as Download, N as FileSpreadsheet, it as CircleAlert, o as Upload, rt as CircleCheck } from "../_libs/lucide-react.mjs";
import { t as AppShell } from "./AppShell-ClS6A7yg.mjs";
import { n as utils, t as readSync } from "../_libs/xlsx.mjs";
import { n as exportXLSX, t as exportCSV } from "./export-B7MgEGmo.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/import-lVCvwTrU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ImportPage() {
	const navigate = useNavigate();
	const [parsed, setParsed] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [user, setUser] = (0, import_react.useState)(null);
	const [agencyInfo, setAgencyInfo] = (0, import_react.useState)(null);
	const [importing, setImporting] = (0, import_react.useState)(false);
	const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
	const currentMonth = (/* @__PURE__ */ new Date()).getMonth() + 1;
	const [selectedYear, setSelectedYear] = (0, import_react.useState)(currentYear);
	const [selectedMonth, setSelectedMonth] = (0, import_react.useState)(currentMonth);
	const yearOptions = Array.from({ length: 7 }, (_, i) => currentYear - 5 + i);
	const monthOptions = [
		{
			value: 1,
			label: "Janvier"
		},
		{
			value: 2,
			label: "Février"
		},
		{
			value: 3,
			label: "Mars"
		},
		{
			value: 4,
			label: "Avril"
		},
		{
			value: 5,
			label: "Mai"
		},
		{
			value: 6,
			label: "Juin"
		},
		{
			value: 7,
			label: "Juillet"
		},
		{
			value: 8,
			label: "Août"
		},
		{
			value: 9,
			label: "Septembre"
		},
		{
			value: 10,
			label: "Octobre"
		},
		{
			value: 11,
			label: "Novembre"
		},
		{
			value: 12,
			label: "Décembre"
		}
	];
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const u = getUser();
		if (!u) {
			navigate({ to: "/login" });
			return;
		}
		setUser(u);
		const loadAgencyInfo = () => {
			if (u.role === "pharmacy") {
				const userAgency = getAgencies().find((a) => a.email === u.email);
				if (userAgency) setAgencyInfo({
					id: userAgency.id,
					country: userAgency.country
				});
			}
		};
		loadAgencyInfo();
		const syncAgencies = () => loadAgencyInfo();
		window.addEventListener("obco:agencies", syncAgencies);
		window.addEventListener("obco:gros", syncAgencies);
		return () => {
			window.removeEventListener("obco:agencies", syncAgencies);
			window.removeEventListener("obco:gros", syncAgencies);
		};
	}, [navigate]);
	const agencySuppliers = (0, import_react.useMemo)(() => {
		const grossistes = getGrossistes();
		const suppliers = /* @__PURE__ */ new Set();
		if ((user || getUser())?.role === "admin") {
			for (const g of grossistes) {
				if (g.status === "blocked" || g.status === "inactive") continue;
				suppliers.add(g.partenaire);
			}
			return Array.from(suppliers).sort();
		}
		if (!agencyInfo) return [];
		for (const g of grossistes) {
			if (g.status === "blocked" || g.status === "inactive") continue;
			if (g.scope === "country" && g.country === agencyInfo.country) suppliers.add(g.partenaire);
			if (g.scope === "agency" && g.agencyId === agencyInfo.id) suppliers.add(g.partenaire);
		}
		return Array.from(suppliers).sort();
	}, [agencyInfo]);
	const templateData = (0, import_react.useMemo)(() => {
		if (agencySuppliers.length === 0) return {
			headers: [],
			rows: []
		};
		const products = getPanoramicProducts().slice(0, 10);
		const columnNames = ["Produit"];
		for (const supplier of agencySuppliers) {
			columnNames.push(`${supplier}_Ventes`);
			columnNames.push(`${supplier}_Stocks`);
			columnNames.push(`${supplier}_Cmd`);
		}
		columnNames.push("Total_Ventes");
		columnNames.push("Total_Stocks");
		columnNames.push("Total_Cmd");
		const headerRow1 = { Produit: "Produit" };
		for (const supplier of agencySuppliers) {
			headerRow1[`${supplier}_Ventes`] = supplier;
			headerRow1[`${supplier}_Stocks`] = "";
			headerRow1[`${supplier}_Cmd`] = "";
		}
		headerRow1["Total_Ventes"] = "Total";
		headerRow1["Total_Stocks"] = "";
		headerRow1["Total_Cmd"] = "";
		const headerRow2 = { Produit: "" };
		for (const supplier of agencySuppliers) {
			headerRow2[`${supplier}_Ventes`] = "Ventes";
			headerRow2[`${supplier}_Stocks`] = "Stocks";
			headerRow2[`${supplier}_Cmd`] = "Cmd";
		}
		headerRow2["Total_Ventes"] = "Ventes";
		headerRow2["Total_Stocks"] = "Stocks";
		headerRow2["Total_Cmd"] = "Cmd";
		const dataRows = products.map((p) => {
			const row = { Produit: `${p.name} (${p.cip})` };
			let totalVentes = 0;
			let totalStocks = 0;
			let totalCmd = 0;
			for (const supplier of agencySuppliers) {
				const ventes = 0;
				const stocks = 0;
				const cmd = 0;
				row[`${supplier}_Ventes`] = ventes;
				row[`${supplier}_Stocks`] = stocks;
				row[`${supplier}_Cmd`] = cmd;
				totalVentes += ventes;
				totalStocks += stocks;
				totalCmd += cmd;
			}
			row["Total_Ventes"] = totalVentes;
			row["Total_Stocks"] = totalStocks;
			row["Total_Cmd"] = totalCmd;
			return row;
		});
		const totalRow = { Produit: "TOTAL" };
		for (const supplier of agencySuppliers) {
			totalRow[`${supplier}_Ventes`] = 0;
			totalRow[`${supplier}_Stocks`] = 0;
			totalRow[`${supplier}_Cmd`] = 0;
		}
		totalRow["Total_Ventes"] = 0;
		totalRow["Total_Stocks"] = 0;
		totalRow["Total_Cmd"] = 0;
		return {
			headers: [headerRow1, headerRow2],
			rows: [...dataRows, totalRow]
		};
	}, [agencySuppliers]);
	const downloadCSV = () => {
		if (agencySuppliers.length === 0) {
			toast.error("Aucun fournisseur attribué à votre agence");
			return;
		}
		exportCSV("modele-import-agence", [...templateData.headers, ...templateData.rows]);
		toast.success("Modèle CSV téléchargé avec structure Sorties Locales");
	};
	const downloadXLSX = () => {
		if (agencySuppliers.length === 0) {
			toast.error("Aucun fournisseur attribué à votre agence");
			return;
		}
		exportXLSX("modele-import-agence", { "Import Données": [...templateData.headers, ...templateData.rows] });
		toast.success("Modèle XLSX téléchargé avec structure Sorties Locales");
	};
	const handleFile = async (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		setParsed(null);
		try {
			const workbook = readSync(await file.arrayBuffer());
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const rawData = utils.sheet_to_json(worksheet, { header: 1 });
			if (rawData.length < 3) {
				setError("Le fichier ne contient pas assez de lignes.");
				return;
			}
			const headerRow1 = rawData[0];
			const headerRow2 = rawData[1];
			const columnNames = [];
			let currentSupplier = "";
			for (let i = 0; i < headerRow1.length; i++) {
				const header1 = String(headerRow1[i] || "").trim();
				const header2 = String(headerRow2[i] || "").trim();
				if (i === 0) columnNames.push("Produit");
				else if (header1 && header1 !== "") {
					currentSupplier = header1;
					columnNames.push(`${currentSupplier}_${header2}`);
				} else if (currentSupplier && header2) columnNames.push(`${currentSupplier}_${header2}`);
				else columnNames.push(`col_${i}`);
			}
			console.log("Noms de colonnes détectés:", columnNames);
			const dataRows = [];
			for (let i = 2; i < rawData.length; i++) {
				const row = rawData[i];
				const produit = String(row[0] || "").trim();
				if (!produit || produit === "TOTAL") continue;
				const rowData = {};
				for (let j = 0; j < columnNames.length && j < row.length; j++) rowData[columnNames[j]] = row[j];
				dataRows.push(rowData);
			}
			console.log("Données parsées:", dataRows.slice(0, 2));
			if (!dataRows.length) {
				setError("Aucune donnée à importer. Vérifiez le contenu du fichier.");
				return;
			}
			setParsed(dataRows);
			toast.success(`${dataRows.length} produits détectés`);
		} catch (err) {
			console.error("Erreur parsing:", err);
			setError("Impossible de lire le fichier. Vérifiez le format (CSV / XLSX).");
			toast.error("Échec de l'import");
		}
	};
	const validateAndImport = async () => {
		if (!parsed || !agencyInfo) return;
		setImporting(true);
		setError(null);
		try {
			const importData = {
				year: selectedYear,
				month: selectedMonth,
				data: []
			};
			const grossistes = getGrossistes();
			const grossisteIdMap = /* @__PURE__ */ new Map();
			for (const g of grossistes) grossisteIdMap.set(g.partenaire, g.id);
			for (const row of parsed) {
				const produitStr = String(row.Produit || "").trim();
				if (!produitStr) continue;
				const cipMatch = produitStr.match(/\(([^)]+)\)$/);
				if (!cipMatch) {
					console.warn("CIP non trouvé pour:", produitStr);
					continue;
				}
				const cip = cipMatch[1];
				const name = produitStr.replace(/\s*\([^)]+\)$/, "").trim();
				const suppliers = [];
				for (const supplierName of agencySuppliers) {
					const ventesKey = `${supplierName}_Ventes`;
					const stocksKey = `${supplierName}_Stocks`;
					const cmdKey = `${supplierName}_Cmd`;
					const ventes = parseInt(String(row[ventesKey] || 0));
					const stocks = parseInt(String(row[stocksKey] || 0));
					const cmd = parseInt(String(row[cmdKey] || 0));
					if (ventes === 0 && stocks === 0 && cmd === 0) continue;
					const wholesalerId = grossisteIdMap.get(supplierName);
					if (!wholesalerId) {
						console.warn("Grossiste non trouvé:", supplierName);
						continue;
					}
					suppliers.push({
						wholesalerId,
						wholesalerName: supplierName,
						sales: isNaN(ventes) ? 0 : ventes,
						stock: isNaN(stocks) ? 0 : stocks,
						orders: isNaN(cmd) ? 0 : cmd
					});
				}
				if (suppliers.length > 0) importData.data.push({
					productCip: cip,
					productName: name,
					suppliers
				});
			}
			if (importData.data.length === 0) {
				setError("Aucune donnée valide à importer");
				setImporting(false);
				return;
			}
			const response = await fetch(`https://evening-sierra-79086-961c10c199fc.herokuapp.com/api/import/monthly`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${localStorage.getItem("obco_token")}`
				},
				body: JSON.stringify(importData)
			});
			if (!response.ok) {
				const errorData = await response.json().catch(() => ({}));
				throw new Error(errorData.error || "Erreur lors de l'import");
			}
			const result = await response.json();
			toast.success(`${result.count} enregistrements importés avec succès`);
			setParsed(null);
		} catch (err) {
			console.error("Erreur import:", err);
			setError(err.message || "Erreur lors de l'import");
			toast.error(err.message || "Échec de l'import");
		} finally {
			setImporting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, {
		title: "Import / Export",
		subtitle: "Téléverser vos données mensuelles",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-6 rounded-2xl border border-border bg-card p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-sm mb-3",
						children: "📅 Période d'import"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs text-muted-foreground mb-1",
								children: "Mois"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: selectedMonth,
								onChange: (e) => setSelectedMonth(Number(e.target.value)),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
								children: monthOptions.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: m.value,
									children: m.label
								}, m.value))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "block text-xs text-muted-foreground mb-1",
								children: "Année"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: selectedYear,
								onChange: (e) => setSelectedYear(Number(e.target.value)),
								className: "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm",
								children: yearOptions.map((y) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: y,
									children: y
								}, y))
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground mt-2",
						children: "Les données importées seront associées à la période sélectionnée"
					})
				]
			}),
			agencySuppliers.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 rounded-2xl border border-primary/20 bg-primary/5 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "h-5 w-5 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-semibold text-sm mb-1",
								children: user?.role === "admin" ? `📦 Tous les fournisseurs (${agencySuppliers.length})` : `📦 Fournisseurs attribués à votre agence (${agencySuppliers.length})`
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex flex-wrap gap-2 mt-2",
								children: agencySuppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-xs font-medium",
									children: s
								}, s))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground mt-2",
								children: user?.role === "admin" ? "Le fichier modèle contiendra tous les fournisseurs actifs." : "Le fichier modèle contiendra uniquement vos fournisseurs (scope pays + agence). Format identique à 'Sorties Locales'."
							})
						]
					})]
				})
			}),
			user?.role !== "admin" && agencySuppliers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-6 rounded-2xl border-2 border-warning/20 bg-warning/5 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-5 w-5 text-warning shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-semibold text-sm text-warning mb-1",
						children: "⚠️ Aucun fournisseur attribué"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Votre agence n'a pas encore de fournisseurs (grossistes) attribués. Contactez l'administrateur pour configurer vos fournisseurs avant de pouvoir importer des données."
					})] })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-2 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl",
								children: "1. Téléchargez le modèle"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Remplissez les colonnes puis téléversez le fichier"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
							className: "mt-5 space-y-2 text-sm text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Structure identique à \"Sorties Locales\"" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs mt-0.5",
										children: "Colonne Produit + 3 colonnes par fournisseur + Total"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "En-têtes sur 2 lignes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs mt-0.5",
										children: "Ligne 1 : Nom fournisseur | Ligne 2 : Ventes, Stocks, Cmd"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Totaux automatiques" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "text-xs mt-0.5",
										children: "Colonne Total (somme par ligne) + Ligne Total (somme par colonne)"
									})] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4 text-primary shrink-0 mt-0.5" }), "Format accepté : CSV (« ; ») ou XLSX"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: downloadCSV,
								variant: "outline",
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "mr-2 h-4 w-4" }), "CSV"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								onClick: downloadXLSX,
								className: "flex-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileSpreadsheet, { className: "mr-2 h-4 w-4" }), "XLSX"]
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-5 w-5" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-xl",
								children: "2. Téléversez le fichier"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted-foreground",
								children: "Glissez-déposez ou cliquez pour parcourir"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-border bg-surface/40 px-6 py-10 text-center hover:border-primary/50 hover:bg-surface transition",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "file",
									accept: ".csv,.xlsx,.xls",
									onChange: handleFile,
									className: "hidden"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "mx-auto h-8 w-8 text-muted-foreground" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 text-sm font-medium",
									children: "Cliquez pour sélectionner un fichier"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground mt-1",
									children: "CSV · XLSX · max 10 Mo"
								})
							]
						}),
						error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "h-4 w-4 text-destructive shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-destructive",
								children: error
							})]
						})
					]
				})]
			}),
			parsed && parsed.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-2xl border border-border bg-card p-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
							className: "font-display text-xl",
							children: [
								"Aperçu de l'import · ",
								parsed.length,
								" produits"
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								"Période : ",
								monthOptions.find((m) => m.value === selectedMonth)?.label,
								" ",
								selectedYear
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								variant: "outline",
								onClick: () => setParsed(null),
								disabled: importing,
								children: "Annuler"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "sm",
								onClick: validateAndImport,
								disabled: importing,
								children: importing ? "Import en cours..." : "Valider et importer"
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "overflow-x-auto rounded-xl border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("thead", {
								className: "bg-surface",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]",
									children: "Produit"
								}), agencySuppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									colSpan: 3,
									className: "px-3 py-2 text-center font-medium text-muted-foreground uppercase tracking-wider text-[10px] border-l border-border",
									children: s
								}, s))] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
									className: "bg-surface/50",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { className: "px-3 py-1 text-left font-medium text-muted-foreground text-[9px]" }), agencySuppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-1 text-center font-medium text-muted-foreground text-[9px]",
											children: "V"
										}, `${s}-v`),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-1 text-center font-medium text-muted-foreground text-[9px]",
											children: "S"
										}, `${s}-s`),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
											className: "px-2 py-1 text-center font-medium text-muted-foreground text-[9px] border-r border-border",
											children: "C"
										}, `${s}-c`)
									] }))]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: parsed.slice(0, 10).map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-t border-border/60 hover:bg-surface/30",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-3 py-2 text-[10px] max-w-[200px] truncate",
									children: String(r.Produit ?? "")
								}), agencySuppliers.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-center text-[10px]",
										children: r[`${s}_Ventes`] || 0
									}, `${s}-v`),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-center text-[10px]",
										children: r[`${s}_Stocks`] || 0
									}, `${s}-s`),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "px-2 py-2 text-center text-[10px] border-r border-border",
										children: r[`${s}_Cmd`] || 0
									}, `${s}-c`)
								] }))]
							}, i)) })]
						})
					}),
					parsed.length > 10 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 text-xs text-muted-foreground text-center",
						children: [
							"…",
							parsed.length - 10,
							" produits supplémentaires"
						]
					})
				]
			})
		]
	});
}
//#endregion
export { ImportPage as component };
