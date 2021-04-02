import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {PlayerDataService} from '../../services/player-data-service';

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
        const calcData = PlayerDataService.getPlayerData(this.actor);
        const data = super.getData();
        (data as any).data = calcData;
        return data;
    }

    protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
        formData = this.updateViewSpecificData(formData);

        if (formData['data.mondzeichen.beschreibung']) {
            delete formData['data.mondzeichen.beschreibung'];
        }

        return super._updateObject(event, formData);
    }
}
