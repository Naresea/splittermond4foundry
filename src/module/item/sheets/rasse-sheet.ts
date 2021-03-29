import {SplimoItemSheet} from '../splimo-item-sheet';
import {Rasse} from '../../models/items/rasse';

export class RasseSheet extends SplimoItemSheet<Rasse> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/item/rasse-sheet.hbs',
            width: 512,
            height: 766,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }
            ]
        });
    }

}
