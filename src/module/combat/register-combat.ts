import {SplimoCombat} from './splimo-combat';

export function registerCombat(): void {
    CONFIG.Combat.entityClass = SplimoCombat;

    Hooks.on('renderCombatTracker', async (app, html, options) => {
        const elems = [
            html.find('.combat-control[data-control="previousRound"]'),
            html.find('.combat-control[data-control="nextRound"]'),
            html.find('.combat-control[data-control="previousTurn"]'),
            html.find('.combat-control[data-control="nextTurn"]'),
        ];
        elems.forEach(e => e.hide());
    });
}
