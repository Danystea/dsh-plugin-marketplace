//#region src/index.ts
/**
* dsh-plugin-marketplace — host-side entry.
* The bundle patch inserts this package as a Cordis plugin row; the client
* half registers the marketplace tab in the Plugins settings section.
* The host half exports a no-op apply — Cordis requires every plugin to
* export an apply function.
* @module dsh-plugin-marketplace
*/
function apply() {}
//#endregion
export { apply as default };

//# sourceMappingURL=index.js.map