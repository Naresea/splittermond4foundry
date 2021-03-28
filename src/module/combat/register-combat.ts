import {SplimoCombat} from './splimo-combat';

export function registerCombat(): void {
    CONFIG.Combat.entityClass = SplimoCombat;
}
