import {Modifier, ModifierType} from '../models/items/modifier';
import {ItemType} from '../models/item-type';
import {Rasse} from '../models/items/rasse';
import {Abstammung} from '../models/items/abstammung';
import {Kultur} from '../models/items/kultur';
import {Meisterschaft} from '../models/items/meisterschaft';
import {Merkmal} from '../models/items/merkmal';
import {Schwaeche} from '../models/items/schwaeche';
import {Staerke} from '../models/items/staerke';
import {Zustand} from '../models/items/zustand';

export interface DecoratedModifier {
    modifier: Modifier;
    source: Item;
}

export interface Modifiers {
    byType: Map<ModifierType, Array<DecoratedModifier>>;
    byTarget: Map<string, Array<DecoratedModifier>>;
    byItemType: Map<ItemType, Array<DecoratedModifier>>;
}

export class ModifierService {

    public static getModifiers(actor: Actor): Modifiers {
        const result = {
            byType: new Map<ModifierType, Array<DecoratedModifier>>(),
            byTarget: new Map<string, Array<DecoratedModifier>>(),
            byItemType: new Map<ItemType, Array<DecoratedModifier>>()
        };
        const sorted = ModifierService.sortItems(actor.items);
        ModifierService.addMods(result, ItemType.Rasse, sorted, (v: Rasse) => v.attributeMod);
        ModifierService.addMods(result, ItemType.Abstammung, sorted, (v: Abstammung) => v.modifier);
        ModifierService.addMods(result, ItemType.Kultur, sorted, (v: Kultur) => v.modifier);
        ModifierService.addMods(result, ItemType.Meisterschaft, sorted, (v: Meisterschaft) => v.modifier);
        ModifierService.addMods(result, ItemType.Merkmal, sorted, (v: Merkmal) => v.modifier);
        ModifierService.addMods(result, ItemType.Schwaeche, sorted, (v: Schwaeche) => v.modifier);
        ModifierService.addMods(result, ItemType.Staerke, sorted, (v: Staerke) => v.modifier);
        ModifierService.addMods(result, ItemType.Zustand, sorted, (v: Zustand) => v.modifier);

        return result;
    }

    public static totalMod(mods: Modifiers, target: string, opts?: { itemType?: ItemType, modType?: ModifierType }): number {
        let modifiers = mods.byTarget.get(target) ?? [];
        if (opts) {
            modifiers = modifiers.filter(mod => {
                return (opts?.itemType == null || opts?.itemType === mod.source.type)
                    && (opts?.modType == null || opts?.modType === mod.modifier.type);
            });
        }
        return modifiers.reduce((accu, curr) => accu + curr.modifier.value, 0);
    }

    private static sortItems(items: Collection<Item>): Map<ItemType, Array<Item>> {
        return items.reduce((map, item) => {
            if (!item) {
                return map;
            }
            const collection = map.get(item.type as ItemType) ?? [];
            collection.push(item);
            map.set(item.type as ItemType, collection);
            return map;
        }, new Map<ItemType, Array<Item>>());
    }

    private static addMods(
        mods: Modifiers,
        itemType: ItemType,
        sortedItems: Map<ItemType, Array<Item>>,
        getModifierField: (val: any) => Array<Modifier>
    ): void {
        const items = sortedItems.get(itemType) ?? [];

        const modifiers: Array<DecoratedModifier> = ModifierService.flatten(
            items.map(i => getModifierField(i.data.data).map((m) => ({
                modifier: m, source: i
            })))
        );

        modifiers.forEach(modifier => {
            const byType = mods.byType.get(modifier.modifier.type) ?? [];
            byType.push(modifier);
            mods.byType.set(modifier.modifier.type, byType);
            const byTarget = mods.byTarget.get(modifier.modifier.target) ?? [];
            byTarget.push(modifier);
            mods.byTarget.set(modifier.modifier.target, byTarget);
            const byItemType = mods.byItemType.get(modifier.source.type as ItemType) ?? [];
            byItemType.push(modifier);
            mods.byItemType.set(modifier.source.type as ItemType, byItemType);
        });
    }

    private static flatten<T>(arr: Array<Array<T>>): Array<T> {
        return arr.reduce((accu, curr) => {
            accu.push(...curr);
            return accu;
        }, []);
    }
}
