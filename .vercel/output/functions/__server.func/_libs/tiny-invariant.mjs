//#region node_modules/tiny-invariant/dist/esm/tiny-invariant.js
var prefix = "Invariant failed";
function invariant(condition, message) {
	if (condition) return;
	throw new Error(prefix);
}
//#endregion
export { invariant as t };
