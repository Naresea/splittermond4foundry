import {Attributes} from '../models/actors/attributes';
import {DerivedAttributes} from '../models/actors/derived-attributes';
import {Modifiers, ModifierService} from './modifier-service';
import {ModifierType} from '../models/items/modifier';
import {ItemType} from '../models/item-type';
import {Fertigkeit} from '../models/items/fertigkeit';
import {Waffe} from '../models/items/waffe';
import {Schild} from '../models/items/schild';

export class CalculationService {

    public static getAttributeValue(actor: Actor, attribute: keyof Attributes | keyof DerivedAttributes, mods: Modifiers): number {
        const startValue = actor.data.data[attribute] ?? 0;
        const increasedValue = actor.data.data['inc' + attribute] ?? 0;
        const modifierValue = ModifierService.totalMod(mods, attribute, {modType: ModifierType.Attribute}) ?? 0;
        return startValue + increasedValue + modifierValue;
    }

    public static getFertigkeitsValue(actor: Actor, fertigkeit: string, mods: Modifiers): number {
        const fertigkeitItem: Item<Fertigkeit> | undefined =
            actor.items.find(item => item.type === ItemType.Fertigkeit && item.name === fertigkeit) as Item<Fertigkeit> | undefined;

        if (!fertigkeitItem) {
            return 0;
        }

        const attrEins = CalculationService.getAttributeValue(actor, fertigkeitItem.data.data.attributEins as keyof Attributes, mods);
        const attrZwei = CalculationService.getAttributeValue(actor, fertigkeitItem.data.data.attributZwei as keyof Attributes, mods);
        const mod = ModifierService.totalMod(mods, fertigkeit, {modType: ModifierType.Fertigkeit});

        return attrEins + attrZwei + mod + fertigkeitItem.data.data.punkte + fertigkeitItem.data.data.mod;
    }

    public static getWaffeOrSchildValue(actor: Actor, waffe: Waffe | Schild, mods: Modifiers): number {
        const fertigkeitItem: Item<Fertigkeit> | undefined =
            actor.items.find(item => item.type === ItemType.Fertigkeit && item.name === waffe.fertigkeit) as Item<Fertigkeit> | undefined;

        const attrEins = CalculationService.getAttributeValue(actor, waffe.attribute as keyof Attributes, mods);
        const attrZwei = CalculationService.getAttributeValue(actor, waffe.attributeSecondary as keyof Attributes, mods);

        if (!fertigkeitItem) {
            return attrEins + attrZwei + waffe.mod;
        }

        const fertigkeitVal = fertigkeitItem.data.data.punkte + fertigkeitItem.data.data.mod;
        const fertigkeitMod = ModifierService.totalMod(mods, fertigkeitItem.name, {modType: ModifierType.Fertigkeit});

        return attrEins + attrZwei + waffe.mod + fertigkeitVal + fertigkeitMod;
    }

}
