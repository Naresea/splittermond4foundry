import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {ItemType} from '../../models/item-type';
import {Rasse} from '../../models/items/rasse';

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

    getData(): ActorSheet.Data<PlayerCharacter> {
        const data = super.getData();

        const race = this.actor.items.find((item) => item.type === ItemType.Rasse);
        if (race) {
            console.log('Found race! ', race);
        }
        const raceData = race?.data?.data as Rasse | undefined;
        const getMod = (attrName: string) => {
            return raceData?.attributeMod?.find(mod => mod.target === attrName)?.value
        };

        const attributes = {
            AUS: this.actor.data.data.AUS + (getMod('AUS') ?? 0),
            BEW: this.actor.data.data.BEW + (getMod('BEW') ?? 0),
            INT: this.actor.data.data.INT + (getMod('INT') ?? 0),
            KON: this.actor.data.data.KON + (getMod('KON') ?? 0),
            MYS: this.actor.data.data.MYS + (getMod('MYS') ?? 0),
            STR: this.actor.data.data.STR + (getMod('STR') ?? 0),
            VER: this.actor.data.data.VER + (getMod('VER') ?? 0),
            WIL: this.actor.data.data.WIL + (getMod('WIL') ?? 0),
            GK: this.actor.data.data.AUS + (getMod('GK') ?? 0),
        };

        (data.data as any).attributes = attributes;
        (data.data as any).race = race?.name ?? 'Unknown';

        return data;
    }
}
