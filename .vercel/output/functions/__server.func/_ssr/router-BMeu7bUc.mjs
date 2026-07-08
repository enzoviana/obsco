import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { n as getUser } from "./auth-09JE-lnI.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { A as redirect, I as useRouter, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as Route$29 } from "./produits-objectifs-EVLGnhDA.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BMeu7bUc.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-DkmipA6A.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$28 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "PharmaOS — Pharmacy Management Cloud" },
			{
				name: "description",
				content: "Premium SaaS dashboard for pharmacy inventory management."
			},
			{
				name: "author",
				content: "PharmaOS"
			},
			{
				property: "og:title",
				content: "PharmaOS"
			},
			{
				property: "og:description",
				content: "Premium SaaS dashboard for pharmacy inventory management."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "fr",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$28.useRouteContext();
	(0, import_react.useEffect)(() => {
		import("./auth-09JE-lnI.mjs").then((n) => n.t).then(({ refreshFromApi }) => refreshFromApi()).then(() => {
			import("./hydrate-B-qUdCQe.mjs").then(({ hydrateFromApi }) => hydrateFromApi());
		});
		const onAuth = () => import("./hydrate-B-qUdCQe.mjs").then(({ hydrateFromApi }) => hydrateFromApi());
		window.addEventListener("obco:user", onAuth);
		return () => window.removeEventListener("obco:user", onAuth);
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, { position: "bottom-right" })]
	});
}
var $$splitComponentImporter$26 = () => import("./stocks-Dl33y-Nf.mjs");
var Route$27 = createFileRoute("/stocks")({
	head: () => ({ meta: [{ title: "Stocks — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./stats-BtxmuAMp.mjs");
var Route$26 = createFileRoute("/stats")({
	head: () => ({ meta: [{ title: "Statistiques — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./sorties-locales-NusI35b7.mjs");
var Route$25 = createFileRoute("/sorties-locales")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var $$splitComponentImporter$23 = () => import("./reset-password-BDitgkTs.mjs");
var Route$24 = createFileRoute("/reset-password")({
	head: () => ({ meta: [{ title: "Réinitialiser le mot de passe — OBCO" }] }),
	validateSearch: (search) => {
		return { token: search.token || "" };
	},
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./rapports-h0n6c1IS.mjs");
var Route$23 = createFileRoute("/rapports")({
	head: () => ({ meta: [{ title: "Rapports — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./produits-tarifs-DWC9P45S.mjs");
var Route$22 = createFileRoute("/produits-tarifs")({
	head: () => ({ meta: [{ title: "Tarifs produits par pays — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./produits-Dofr5hau.mjs");
var Route$21 = createFileRoute("/produits")({
	head: () => ({ meta: [{ title: "Produits — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./pays-C6YiLFyB.mjs");
var Route$20 = createFileRoute("/pays")({
	head: () => ({ meta: [{ title: "Pays — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./parametres-DW9H2smG.mjs");
var Route$19 = createFileRoute("/parametres")({
	head: () => ({ meta: [{ title: "Paramètres — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./login-oYbQ5IpK.mjs");
var Route$18 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Connexion — OBCO" }] }),
	beforeLoad: () => {
		if (typeof window !== "undefined" && getUser()) throw redirect({ to: "/" });
	},
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./laboratoires-DrSS2Gv0.mjs");
var Route$17 = createFileRoute("/laboratoires")({
	head: () => ({ meta: [{ title: "Laboratoires — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./import-lVCvwTrU.mjs");
var Route$16 = createFileRoute("/import")({
	head: () => ({ meta: [{ title: "Import / Export — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./grossistes-D6quA6Rn.mjs");
var Route$15 = createFileRoute("/grossistes")({
	head: () => ({ meta: [{ title: "Grossistes — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var Route$14 = createFileRoute("/fournisseurs")({ beforeLoad: () => {
	throw redirect({ to: "/sorties-locales" });
} });
var $$splitComponentImporter$13 = () => import("./forgot-password-DLCZzI4V.mjs");
var Route$13 = createFileRoute("/forgot-password")({
	head: () => ({ meta: [{ title: "Mot de passe oublié — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./change-password-CtuGPkw2.mjs");
var Route$12 = createFileRoute("/change-password")({
	head: () => ({ meta: [{ title: "Changer le mot de passe — OBCO" }] }),
	beforeLoad: () => {
		if (typeof window !== "undefined" && !getUser()) throw redirect({ to: "/login" });
	},
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./agences-DtI98C02.mjs");
var Route$11 = createFileRoute("/agences")({
	head: () => ({ meta: [{ title: "Agences — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./routes-CkRJ6H4C.mjs");
var Route$10 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Tableau de bord — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./sorties-locales.index-D32VrXh_.mjs");
var Route$9 = createFileRoute("/sorties-locales/")({
	head: () => ({ meta: [{ title: "Sorties Locales — Sorties Locales — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./sorties-locales.vue-panoramique-BbIqyEti.mjs");
var Route$8 = createFileRoute("/sorties-locales/vue-panoramique")({
	head: () => ({ meta: [{ title: "Rapport 8 — Vue panoramique produit — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./sorties-locales.ventes-un-DeyAbhUO.mjs");
var Route$7 = createFileRoute("/sorties-locales/ventes-un")({
	head: () => ({ meta: [{ title: "Rapport 3 — Ventes par unités — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./sorties-locales.ventes-ca-DdBnVt8f.mjs");
var Route$6 = createFileRoute("/sorties-locales/ventes-ca")({
	head: () => ({ meta: [{ title: "Rapport 4 — Ventes par CA— OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./sorties-locales.stocks-pays-BM85vJ2f.mjs");
var Route$5 = createFileRoute("/sorties-locales/stocks-pays")({
	head: () => ({ meta: [{ title: "Rapport 7 — Stocks locaux pays — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./sorties-locales.stocks-en-cours-Chv7aUHj.mjs");
var Route$4 = createFileRoute("/sorties-locales/stocks-en-cours")({
	head: () => ({ meta: [{ title: "Rapport 7 bis — Stocks + en cours — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./sorties-locales.objectifs-pays-ByG8z8vy.mjs");
var Route$3 = createFileRoute("/sorties-locales/objectifs-pays")({
	head: () => ({ meta: [{ title: "Rapport 1 — Objectifs ventes par pays — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./sorties-locales.objectifs-anf-j7pcc8-a.mjs");
var Route$2 = createFileRoute("/sorties-locales/objectifs-anf")({
	head: () => ({ meta: [{ title: "Rapport 2 — Objectifs ventes ANF — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./sorties-locales.evolution-un-CHZgoALY.mjs");
var Route$1 = createFileRoute("/sorties-locales/evolution-un")({
	head: () => ({ meta: [{ title: "Rapport 5 — Évolution unités — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./sorties-locales.evolution-ca-B4GJqtNY.mjs");
var Route = createFileRoute("/sorties-locales/evolution-ca")({
	head: () => ({ meta: [{ title: "Rapport 6 — Évolution CA — OBCO" }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var StocksRoute = Route$27.update({
	id: "/stocks",
	path: "/stocks",
	getParentRoute: () => Route$28
});
var StatsRoute = Route$26.update({
	id: "/stats",
	path: "/stats",
	getParentRoute: () => Route$28
});
var SortiesLocalesRoute = Route$25.update({
	id: "/sorties-locales",
	path: "/sorties-locales",
	getParentRoute: () => Route$28
});
var ResetPasswordRoute = Route$24.update({
	id: "/reset-password",
	path: "/reset-password",
	getParentRoute: () => Route$28
});
var RapportsRoute = Route$23.update({
	id: "/rapports",
	path: "/rapports",
	getParentRoute: () => Route$28
});
var ProduitsTarifsRoute = Route$22.update({
	id: "/produits-tarifs",
	path: "/produits-tarifs",
	getParentRoute: () => Route$28
});
var ProduitsObjectifsRoute = Route$29.update({
	id: "/produits-objectifs",
	path: "/produits-objectifs",
	getParentRoute: () => Route$28
});
var ProduitsRoute = Route$21.update({
	id: "/produits",
	path: "/produits",
	getParentRoute: () => Route$28
});
var PaysRoute = Route$20.update({
	id: "/pays",
	path: "/pays",
	getParentRoute: () => Route$28
});
var ParametresRoute = Route$19.update({
	id: "/parametres",
	path: "/parametres",
	getParentRoute: () => Route$28
});
var LoginRoute = Route$18.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$28
});
var LaboratoiresRoute = Route$17.update({
	id: "/laboratoires",
	path: "/laboratoires",
	getParentRoute: () => Route$28
});
var ImportRoute = Route$16.update({
	id: "/import",
	path: "/import",
	getParentRoute: () => Route$28
});
var GrossistesRoute = Route$15.update({
	id: "/grossistes",
	path: "/grossistes",
	getParentRoute: () => Route$28
});
var FournisseursRoute = Route$14.update({
	id: "/fournisseurs",
	path: "/fournisseurs",
	getParentRoute: () => Route$28
});
var ForgotPasswordRoute = Route$13.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$28
});
var ChangePasswordRoute = Route$12.update({
	id: "/change-password",
	path: "/change-password",
	getParentRoute: () => Route$28
});
var AgencesRoute = Route$11.update({
	id: "/agences",
	path: "/agences",
	getParentRoute: () => Route$28
});
var IndexRoute = Route$10.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$28
});
var SortiesLocalesIndexRoute = Route$9.update({
	id: "/",
	path: "/",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesVuePanoramiqueRoute = Route$8.update({
	id: "/vue-panoramique",
	path: "/vue-panoramique",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesVentesUnRoute = Route$7.update({
	id: "/ventes-un",
	path: "/ventes-un",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesVentesCaRoute = Route$6.update({
	id: "/ventes-ca",
	path: "/ventes-ca",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesStocksPaysRoute = Route$5.update({
	id: "/stocks-pays",
	path: "/stocks-pays",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesStocksEnCoursRoute = Route$4.update({
	id: "/stocks-en-cours",
	path: "/stocks-en-cours",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesObjectifsPaysRoute = Route$3.update({
	id: "/objectifs-pays",
	path: "/objectifs-pays",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesObjectifsAnfRoute = Route$2.update({
	id: "/objectifs-anf",
	path: "/objectifs-anf",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesEvolutionUnRoute = Route$1.update({
	id: "/evolution-un",
	path: "/evolution-un",
	getParentRoute: () => SortiesLocalesRoute
});
var SortiesLocalesRouteChildren = {
	SortiesLocalesEvolutionCaRoute: Route.update({
		id: "/evolution-ca",
		path: "/evolution-ca",
		getParentRoute: () => SortiesLocalesRoute
	}),
	SortiesLocalesEvolutionUnRoute,
	SortiesLocalesObjectifsAnfRoute,
	SortiesLocalesObjectifsPaysRoute,
	SortiesLocalesStocksEnCoursRoute,
	SortiesLocalesStocksPaysRoute,
	SortiesLocalesVentesCaRoute,
	SortiesLocalesVentesUnRoute,
	SortiesLocalesVuePanoramiqueRoute,
	SortiesLocalesIndexRoute
};
var rootRouteChildren = {
	IndexRoute,
	AgencesRoute,
	ChangePasswordRoute,
	ForgotPasswordRoute,
	FournisseursRoute,
	GrossistesRoute,
	ImportRoute,
	LaboratoiresRoute,
	LoginRoute,
	ParametresRoute,
	PaysRoute,
	ProduitsRoute,
	ProduitsObjectifsRoute,
	ProduitsTarifsRoute,
	RapportsRoute,
	ResetPasswordRoute,
	SortiesLocalesRoute: SortiesLocalesRoute._addFileChildren(SortiesLocalesRouteChildren),
	StatsRoute,
	StocksRoute
};
var routeTree = Route$28._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
