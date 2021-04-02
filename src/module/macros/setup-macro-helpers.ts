import {SplimoCombat} from '../combat/splimo-combat';

export function changeInitiative(iniModifier?: number, tokenId?: string, actorId?: string): void {
    let combatants: Array<any> = [];
    const combat = game.combats.active;
    if (!combat) {
        return;
    }
    if (tokenId) {
        combatants = combat.combatants.filter(c => c.tokenId === tokenId);
    } else if (actorId) {
        combatants = combat.combatants.filter(c => c.actor._id === actorId);
    } else {
        const tokenIds = Object.keys(canvas.tokens._controlled);
        combatants = combat.combatants.filter(c => tokenIds.includes(c.tokenId));
    }

    if (combatants.length < 0) {
        return;
    }

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
