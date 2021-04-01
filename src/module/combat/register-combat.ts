import {SplimoCombat} from './splimo-combat';

export function registerCombat(): void {
    CONFIG.Combat.entityClass = SplimoCombat;
    (CONFIG.Combat as any).initiative = {
        formula: `@initiativeTotal - 1d6`,
        decimals: 2
    };

    if (game.combats && game.combats.combats && game.combats.combats.length > 0) {
        const mappedCombats = game.combats.combats.map(c => {
            if (c.entity === 'SplimoCombat') {
                return c;
            }
            // @ts-ignore
            return new SplimoCombat(c.data);
        });
        game.combats.clear();
        mappedCombats.forEach(c => {
            (game.combats as Map<string, Combat>).set(c._id, c);
        });
    }

    Hooks.on('renderCombatTracker', async (app, html, options) => {
        const elems = [
            html.find('.combat-control[data-control="previousRound"]'),
            html.find('.combat-control[data-control="previousTurn"]'),
            html.find('.combat-control[data-control="nextTurn"]'),
        ];
        elems.forEach(e => e.hide());
    });
}
