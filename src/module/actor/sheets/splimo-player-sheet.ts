import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {ItemType} from '../../models/item-type';
import {Rasse} from '../../models/items/rasse';

interface PlayerSheetData extends ActorSheet.Data<PlayerCharacter> {
    data: PlayerCharacter & {
        attributes?: Record<string, number>;
        derivedAttributes?: Record<string, number>;
        healthData?: {
            max: number,
            current: number,
            erschoepft: number,
            kanalisiert: number,
            verzehrt: number
        },
        fokusData?: {
            max: number,
            current: number,
            erschoepft: number,
            kanalisiert: number,
            verzehrt: number
        },
        race?: string
    }
}


export class SplimoPlayerSheet extends SplimoActorSheet<PlayerCharacter> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/actor/player-sheet.hbs',
            width: 1024,
            height: 754,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }
            ]
        });
    }

    getData(): PlayerSheetData {
        let data = super.getData() as PlayerSheetData;
        data = this.applyAttributeMods(data);
        data = this.calculateDerivedAttributes(data);
        data = this.applyMerkmale(data);
        data = this.calculateHpAndFokus(data);
        data = this.addBioInfo(data);
        return data;
    }

    private calculateHpAndFokus(data:  PlayerSheetData):  PlayerSheetData {
        const woundLevels = this.actor.data.data.woundLevel ?? 5;
        const hpTotal = data.data.derivedAttributes.LP * woundLevels;
        const health = {
            max: hpTotal,
            current: this.actor.data.data.health,
            erschoepft: this.actor.data.data.healthErschoepft,
            kanalisiert: this.actor.data.data.healthKanalisiert,
            verzehrt: this.actor.data.data.healthKanalisiert
        };
        const fokusTotal =  data.data.derivedAttributes.FO;
        const fokus = {
            max: fokusTotal,
            current: this.actor.data.data.fokus,
            erschoepft: this.actor.data.data.fokusErschoepft,
            kanalisiert: this.actor.data.data.fokusKanalisiert,
            verzehrt: this.actor.data.data.fokusKanalisiert
        };
        data.data.healthData = health;
        data.data.fokusData = fokus;
        return data;
    }
    
    private applyMerkmale(data:  PlayerSheetData): PlayerSheetData {
        return data;
    }
    
    private calculateDerivedAttributes(data:  PlayerSheetData):  PlayerSheetData {
        let derived = this.prepareDerivedAttributes(data);
        derived = this.applyDerivedAttributeModsRacial(derived);
        data.data.derivedAttributes = derived;
        return data;
    }
    
    private prepareDerivedAttributes(data: PlayerSheetData): Record<string, number> {
        return {
            GSW: data.data.attributes.GK + data.data.attributes.BEW,
            INI: 10 - data.data.attributes.INT,
            LP: data.data.attributes.GK + data.data.attributes.KON,
            FO: 2 * (data.data.attributes.MYS + data.data.attributes.WIL),
            VTD: 12 + data.data.attributes.BEW + data.data.attributes.STR,
            GW: 12 + data.data.attributes.VER + data.data.attributes.WIL,
            KW: 12 + data.data.attributes.KON + data.data.attributes.WIL,
        }
    }

    private applyDerivedAttributeModsRacial(attributes:  Record<string, number>):  Record<string, number> {
        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        if (!race) {
            return attributes;
        }
        const raceData = race?.data?.data as Rasse | undefined;
        const getMod = (attrName: string) => {
            return raceData?.attributeMod?.find(mod => mod.target === attrName)?.value
        };

        return {
            GSW: attributes['GSW'] + (getMod('GSW') ?? 0),
            INI: attributes['INI'] + (getMod('INI') ?? 0),
            LP: attributes['LP'] + (getMod('LP') ?? 0),
            FO: attributes['FO'] + (getMod('FO') ?? 0),
            VTD: attributes['VTD'] + (getMod('VTD') ?? 0),
            GW: attributes['GW'] + (getMod('GW') ?? 0),
            KW: attributes['KW'] + (getMod('KW') ?? 0),
        };
    }

    private applyAttributeMods(data:  PlayerSheetData):  PlayerSheetData {
        let attributes = this.prepareAttributes(data);
        attributes = this.applyAttributeModsRacial(attributes);

        data.data.attributes = attributes;
        return data;
    }

    private prepareAttributes(data: PlayerSheetData): Record<string, number> {
        return {
            AUS: this.actor.data.data.AUS,
            BEW: this.actor.data.data.BEW,
            INT: this.actor.data.data.INT,
            KON: this.actor.data.data.KON,
            MYS: this.actor.data.data.MYS,
            STR: this.actor.data.data.STR,
            VER: this.actor.data.data.VER,
            WIL: this.actor.data.data.WIL,
            GK: this.actor.data.data.AUS,
        }
    }

    private applyAttributeModsRacial(attributes:  Record<string, number>):  Record<string, number> {
        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        if (!race) {
            return attributes;
        }
        const raceData = race?.data?.data as Rasse | undefined;
        const getMod = (attrName: string) => {
            return raceData?.attributeMod?.find(mod => mod.target === attrName)?.value
        };

        return {
            AUS: attributes['AUS'] + (getMod('AUS') ?? 0),
            BEW: attributes['BEW'] + (getMod('BEW') ?? 0),
            INT: attributes['INT'] + (getMod('INT') ?? 0),
            KON: attributes['KON'] + (getMod('KON') ?? 0),
            MYS: attributes['MYS'] + (getMod('MYS') ?? 0),
            STR: attributes['STR'] + (getMod('STR') ?? 0),
            VER: attributes['VER'] + (getMod('VER') ?? 0),
            WIL: attributes['WIL'] + (getMod('WIL') ?? 0),
            GK: attributes['GK'] + (getMod('GK') ?? 0),
        };

    }

    private addBioInfo(data: PlayerSheetData): PlayerSheetData {
        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        if (race) {
            data.data.race = race.name;
        }
        return data;
    }
}
