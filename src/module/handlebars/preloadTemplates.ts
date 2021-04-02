export const preloadTemplates = async function() {
	const partialsPaths = [
		'systems/splittermond/templates/partials/includes/dropdown.hbs',
		'systems/splittermond/templates/partials/includes/portrait.hbs',
		'systems/splittermond/templates/partials/includes/separator-vertical.hbs',
		'systems/splittermond/templates/partials/includes/item-list.hbs',
		'systems/splittermond/templates/partials/includes/item-list-item.hbs',
		'systems/splittermond/templates/partials/includes/editor.hbs',
		'systems/splittermond/templates/partials/includes/gegenstand.hbs',
		'systems/splittermond/templates/partials/includes/indicator.hbs',
		'systems/splittermond/templates/partials/layouts/layout-actor.hbs',
		'systems/splittermond/templates/partials/layouts/layout-item.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/biography.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/attributes.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/fertigkeiten.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/inventory.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/zauber.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/meisterschaften.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/merkmale-zustaende.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/staerken-schwaechen.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/resourcen.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/mondzeichen.hbs',
		'systems/splittermond/templates/sheets/actor/player-sheet-parts/ausruestung.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/attributes.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/description.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/merkmale.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/waffen.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/meisterschaften.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/fertigkeiten.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet-parts/zauber.hbs',
		'systems/splittermond/templates/sheets/roll-result.hbs',
	];

	const templatePaths = [
		// Add paths to "systems/splittermond/templates"
		...partialsPaths,
		'systems/splittermond/templates/sheets/actor/player-sheet.hbs',
		'systems/splittermond/templates/sheets/actor/non-player-sheet.hbs',
		'systems/splittermond/templates/sheets/popups/dice-roll-dialog.hbs',
		'systems/splittermond/templates/sheets/popups/tick-dialog.hbs',
	];

	return loadTemplates(templatePaths);
};
