import {PlayerCharacter} from '../models/actors/player-character';
import {ATTRIBUTES, Attributes} from '../models/actors/attributes';
import {DERIVED_ATTRIBUTES, DerivedAttributes} from '../models/actors/derived-attributes';
import {Modifiers, ModifierService} from './modifier-service';
import {ItemType} from '../models/item-type';
import {ModifierType} from '../models/items/modifier';
import {Fertigkeit} from '../models/items/fertigkeit';
import {CalculationService} from './calculation-service';
import {Waffe} from '../models/items/waffe';
import {Schild} from '../models/items/schild';
import {Ruestung} from '../models/items/ruestung';
import {Benutzbar} from '../models/items/benutzbar';
import {Gegenstand} from '../models/items/gegenstand';
import {buildFokusString, Zauber} from '../models/items/zauber';

interface TableData {
    tableFields: Array<string>;
    tableData: Array<{
        fields: Array<string>;
        id: string;
    }>
}

interface Biography {
    name: string;
    rasse: string;
    abstammung: string;
    kultur: string;
    ausbildung: string;
}

interface AttributeVal {
    name: string;
    start: number;
    increased: number;
    total: number;
    modifier: number;
}

export type PlayerData = Record<string, unknown> & {
    biography: Biography;
    attributes: Record<keyof Attributes,AttributeVal>;
    derivedAttributes: Record<keyof DerivedAttributes, AttributeVal>;
    fertigkeiten: TableData;
    waffen: TableData;
    ruestungen: TableData;
    schilde: TableData;
    benutzbares: TableData;
    sonstiges: TableData;
    zauber: TableData;
}


export class PlayerDataService {

    public static getPlayerData<T>(actor: Actor<T>): PlayerData {
        const modifiers = ModifierService.getModifiers(actor);
        const biography = PlayerDataService.getBiography(actor);
        const attributes = PlayerDataService.getAttributes(actor, modifiers, ATTRIBUTES);
        const derivedAttributes = PlayerDataService.getAttributes(actor, modifiers, DERIVED_ATTRIBUTES);
        const fertigkeiten = PlayerDataService.getFertigkeiten(actor, modifiers);
        const waffen = PlayerDataService.getWaffen(actor, modifiers);
        const ruestungen = PlayerDataService.getRuestungen(actor, modifiers);
        const schilde = PlayerDataService.getSchilde(actor, modifiers);
        const benutzbares = PlayerDataService.getBenutzbares(actor, modifiers);
        const sonstiges = PlayerDataService.getSonstiges(actor, modifiers);
        const zauber = PlayerDataService.getZauber(actor, modifiers);

        return {
            ...actor.data.data,
            biography,
            attributes,
            derivedAttributes,
            fertigkeiten,
            waffen,
            ruestungen,
            schilde,
            benutzbares,
            sonstiges,
            zauber
        }
    }

    private static getBiography(actor: Actor): Biography {
        const rasse = actor.items.find(i => i.type === ItemType.Rasse);
        const abstammung = actor.items.find(i => i.type === ItemType.Abstammung);
        const kultur = actor.items.find(i => i.type === ItemType.Kultur);
        const ausbildung = actor.items.find(i => i.type === ItemType.Ausbildung);
        return {
            name: actor.name,
            rasse: rasse?.name ?? '',
            abstammung: abstammung?.name ?? '',
            kultur: kultur?.name ?? '',
            ausbildung: ausbildung?.name ?? ''
        };
    }

    private static getAttributes<T extends keyof Attributes | keyof DerivedAttributes>(actor: Actor, mods: Modifiers, arr: Array<T>):  Record<T, AttributeVal> {
        return arr.reduce((accu: Record<T, AttributeVal>, attr: T) => {
            const modifier = ModifierService.totalMod(mods, attr, {modType: ModifierType.Attribute});
            const start =  actor.data.data[attr as any] ?? 0;
            const increased = actor.data.data['inc' + attr as any] ?? 0;
            const total = start + increased + modifier;
            accu[attr] = {
                name: `attribute.${attr}`,
                start,
                increased,
                total,
                modifier
            };
            return accu;
        }, {} as Record<T, AttributeVal>);
    }

    private static getFertigkeiten(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'fertigkeiten.name',
            'fertigkeiten.wert',
            'fertigkeiten.punkte',
            'fertigkeiten.attributEins',
            'fertigkeiten.attributZwei',
            'fertigkeiten.modifier',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Fertigkeit, tableFields, (fertigkeit: Item<Fertigkeit>) => ([
            fertigkeit.name,
            `${CalculationService.getFertigkeitsValue(actor, fertigkeit.name, mods)}`,
            `${fertigkeit.data.data.punkte}`,
            fertigkeit.data.data.attributEins,
            fertigkeit.data.data.attributZwei,
            `${fertigkeit.data.data.mod}`
        ]));
    }

    private static getWaffen(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'inventar.waffen.name',
            'inventar.waffen.fertigkeit',
            'inventar.waffen.wgs',
            'inventar.waffen.schaden',
            'inventar.waffen.merkmale',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Waffe, tableFields, (waffe: Item<Waffe>) => ([
            `${waffe.name}`,
            `${waffe.data.data.fertigkeit}`,
            `${waffe.data.data.ticks}`,
            `${waffe.data.data.schaden}`,
            ``
        ]));
    }

    private static getSchilde(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'inventar.schilde.name',
            'inventar.schilde.fertigkeit',
            'inventar.schilde.vtd',
            'inventar.schilde.merkmale',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Schild, tableFields, (schild: Item<Schild>) => ([
            `${schild.name}`,
            `${schild.data.data.fertigkeit}`,
            `${schild.data.data.VTD}`,
            ``,
        ]));
    }

    private static getRuestungen(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'inventar.ruestungen.name',
            'inventar.ruestungen.vtd',
            'inventar.ruestungen.sr',
            'inventar.ruestungen.beh',
            'inventar.ruestungen.tick',
            'inventar.ruestungen.merkmale',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Ruestung, tableFields, (ruestung: Item<Ruestung>) => ([
            `${ruestung.name}`,
            `${ruestung.data.data.VTD}`,
            `${ruestung.data.data.SR}`,
            `${ruestung.data.data.BEH}`,
            `${ruestung.data.data.tickPlus}`,
            ``
        ]));
    }

    private static getBenutzbares(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'inventar.benutzbar.name',
            'inventar.benutzbar.ticks',
            'inventar.benutzbar.begrenzt',
            'inventar.benutzbar.anzahl',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Benutzbar, tableFields, (benutzbar: Item<Benutzbar>) => ([
            `${benutzbar.name}`,
            `${benutzbar.data.data.ticks}`,
            `${benutzbar.data.data.wirdVerbraucht}`,
            `${benutzbar.data.data.anzahl}`
        ]));
    }

    private static getSonstiges(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'inventar.sonstiges.name',
            'inventar.sonstiges.wert',
            'inventar.sonstiges.gewicht',
            'inventar.sonstiges.anzahl',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Gegenstand, tableFields, (gegenstand: Item<Gegenstand>) => ([
            `${gegenstand.name}`,
            `${gegenstand.data.data.wertInTellaren}`,
            `${gegenstand.data.data.gewicht}`,
            `${gegenstand.data.data.anzahl}`
        ]));
    }

    private static getZauber(actor: Actor, mods: Modifiers): TableData {
        const tableFields = [
            'zauber.name',
            'inventar.schule',
            'inventar.wert',
            'inventar.schwierigkeit',
            'inventar.fokus',
            'inventar.zauberdauer',
            'inventar.reichweite',
            'inventar.wirkungsdauer',
            'inventar.bereich',
            'inventar.verstaerkung',
        ];
        return PlayerDataService.getTableData(actor, mods, ItemType.Zauber, tableFields, (zauber: Item<Zauber>) => ([
            `${zauber.name}`,
            `${zauber.data.data.fertigkeit}`,
            `${CalculationService.getFertigkeitsValue(actor, zauber.data.data.fertigkeit, mods)}`,
            `${zauber.data.data.schwierigkeitString}`,
            `${buildFokusString(zauber.data.data)}`,
            `${zauber.data.data.zauberdauerString}`,
            `${zauber.data.data.reichweiteString}`,
            `${zauber.data.data.wirkungsdauerString}`,
            `${zauber.data.data.bereichString}`,
            `${zauber.data.data.verstaerkung}`
        ]));
    }

    private static getTableData(actor: Actor, modifiers: Modifiers, type: ItemType, tableFields: Array<string>, getFields: (item: Item<any>) => Array<string>): TableData {
        const tableData = actor.items.filter(i => i.type === type).map((item: Item<Fertigkeit>) => ({
            id: item.id,
            fields: getFields(item)
        }));
        return {
            tableFields,
            tableData
        };
    }
}
