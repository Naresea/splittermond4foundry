import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';

export class SplimoPlayerSheet extends SplimoActorSheet<PlayerCharacter> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond', 'sheet', 'actor', 'pc'],
            template: 'systems/splittermond/templates/actor/player-sheet.html',
            width: 600,
            height: 600,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }
            ]
        });
    }

    /** @override */
    public getData() {
        const data = super.getData();
        return data;
    }

}
