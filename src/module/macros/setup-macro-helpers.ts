import {SplimoCombat} from '../combat/splimo-combat';

export function changeInitiative(iniModifier?: number): void {
    const tokenIds = Object.keys(canvas.tokens._controlled);
    const combat = game.combats.active;
    const combatants = combat.combatants.filter(c => tokenIds.includes(c.tokenId));

    if (combatants.length < 1) {
        if ((combat as SplimoCombat).changeIniForCombatant != null) {
            (combat as SplimoCombat).changeIniForCombatant(combatants[0], iniModifier);
        }
    } else {
        if ((combat as SplimoCombat).changeIniForCombatants != null) {
            (combat as SplimoCombat).changeIniForCombatants(combatants, iniModifier);
        }
    }
}

export function setupMacroHelpers() {
    game.splittermond = game.splittermond ?? {};
    game.splittermond.macroHelpers = {
        changeInitiative: (mod?: number) => changeInitiative(mod)
    };
}
