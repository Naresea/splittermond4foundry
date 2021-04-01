import {CalculationService} from '../services/calculation-service';

export class SplimoCombat extends Combat {

    // actually overrides a method in the Combat class.
    public _getInitiativeFormula(c: any): string {
        const ini = CalculationService.getInitiative(c.actor);
        return `${ini} - 1d6`;
    }

    _sortCombatants(a: any, b: any): any {
        const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
        const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
        let ci = ia - ib;
        if ( ci !== 0 ) return ci;
        let [an, bn] = [a.token?.name || "", b.token?.name || ""];
        let cn = an.localeCompare(bn);
        if ( cn !== 0 ) return cn;
        return a.tokenId - b.tokenId;
    }

    //@ts-ignore
    get turn() {
        return 0;
    }

    //@ts-ignore
    get round() {
        return 0;
    }

    async nextRound(): Promise<void> {
        return;
    }

    async nextTurn(): Promise<void> {
        return;
    }

    async previousRound(): Promise<void> {
        return;
    }

    async previousTurn(): Promise<void> {
        return;
    }

}
