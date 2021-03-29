export const preloadTemplates = async function() {
	const partialsPaths = [
		'systems/splittermond/templates/partials/layouts/layout-actor.hbs',
		'systems/splittermond/templates/partials/layouts/layout-item.hbs',
		'systems/splittermond/templates/partials/includes/portrait.hbs',
	];

	const templatePaths = [
		// Add paths to "systems/splittermond/templates"
		...partialsPaths,
		'systems/splittermond/templates/sheets/actor/player-sheet.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet.hbs',
		'systems/splittermond/templates/sheets/item/rasse-sheet.hbs',
	];

	return loadTemplates(templatePaths);
};
