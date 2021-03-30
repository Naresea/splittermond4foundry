import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {ItemType} from '../../models/item-type';
import {Rasse} from '../../models/items/rasse';
import {ATTRIBUTES} from '../../models/actors/attributes';
import {Modifier} from '../../models/items/modifier';
import {ModifierItemSheet} from '../../item/sheets/modifier-item-sheet';
import {SplimoItem} from '../../item/splimo-item';
import {getSheetClass} from '../../item/register-item-sheets';

type PlayerSheetPayload =  PlayerCharacter & {
    attributes?: Record<string, number>;
    attributeModifiers?: Record<string, number>;
    derivedAttributes?: Record<string, number>;
    derivedAttributeModifiers?: Record<string, number>;
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
};

interface PlayerSheetData extends ActorSheet.Data<PlayerCharacter> {
    data: PlayerSheetPayload;
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

    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        if (html instanceof  HTMLElement) {
            console.error('activateListeners: html is wrong element, should be JQuery but is HTMLElement');
            return;
        }
        this.registerClick(html);
    }

    private registerClick(html: JQuery<HTMLElement>): void {
        html.find(`.clickable`).on('click', (evt) => {
            const target = evt?.target;
            const operation = target?.dataset?.operation;
            const type = target?.dataset?.type;
            const id = target?.dataset['click-id'];
            if (operation === 'add' && type != null) {
                this.createItem(type as ItemType);
            }
            if (operation === 'edit' && type != null) {
                this.editItem(type as ItemType, id)
            }
            if (operation === 'delete' && type != null) {
                this.deleteItem(type as ItemType, id)
            }
        });
    }

    private createItem(type: ItemType): void {
        this.actor.createOwnedItem({ type, name: `New ${type}` }, { renderSheet: true });
    }

    private editItem(type: ItemType, id?: string): void {
        const item = this.actor.items.find(item => item.type === type && (id == null || item.id === id));
        const sheet = getSheetClass(type);
        if (item && sheet) {
            new sheet(item).render(true);
        }
    }

    private deleteItem(type: ItemType, id?: string): void {
        const item = this.actor.items.find(item => item.type === type && (id == null || item.id === id));
        if (item) {
            this.actor.deleteOwnedItem(item.id);
        }
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
        const attributes = this.prepareAttributes(data);
        const racialModifiers = this.applyAttributeModsRacial(attributes);
        data.data.attributeModifiers = racialModifiers;
        data.data.attributes = attributes;
        console.log('Returning data: ', {racialModifiers, data});
        return data;
    }

    private prepareAttributes(data: PlayerSheetData): Record<string, number> {
        return {
            AUS: this.actor.data.data.AUS + this.actor.data.data.incAUS,
            BEW: this.actor.data.data.BEW + this.actor.data.data.incBEW,
            INT: this.actor.data.data.INT + this.actor.data.data.incINT,
            KON: this.actor.data.data.KON + this.actor.data.data.incKON,
            MYS: this.actor.data.data.MYS + this.actor.data.data.incMYS,
            STR: this.actor.data.data.STR + this.actor.data.data.incSTR,
            VER: this.actor.data.data.VER + this.actor.data.data.incVER,
            WIL: this.actor.data.data.WIL + this.actor.data.data.incWIL,
            GK: this.actor.data.data.GK
        }
    }

    private applyAttributeModsRacial(attributes:  Record<string, number>):  Record<string, number> {
        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        if (!race) {
            return {};
        }
        const raceData = race?.data?.data as Rasse | undefined;
        const getMod = (attrName: string) => {
            return raceData?.attributeMod?.find(mod => mod.target === attrName)?.value
        };

        ATTRIBUTES.forEach(attr => {
            attributes[attr] = (attributes[attr] ?? 0) + (getMod(attr) ?? 0)
        });

        attributes.GK = (getMod('GK') ?? 0);

        return ATTRIBUTES.reduce((accu, curr) => {
            accu[curr] = (getMod(curr) ?? 0);
            return accu;
        }, {
            GK: (getMod('GK') ?? 0)
        });
    }

    private addBioInfo(data: PlayerSheetData): PlayerSheetData {
        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        const kultur = this.actor.items.find((item) => item.type === ItemType.Kultur);
        const abstammung = this.actor.items.find((item) => item.type === ItemType.Abstammung);
        const ausbildung = this.actor.items.find((item) => item.type === ItemType.Ausbildung);

        data.data.race = race?.name;
        data.data.kultur = kultur?.name;
        data.data.abstammung = abstammung?.name;
        data.data.ausbildung = ausbildung?.name;

        return data;
    }
}
