import {SplimoItemSheet} from '../splimo-item-sheet';
import {Ruestung} from '../../models/items/ruestung';

export class RuestungSheet extends SplimoItemSheet<Ruestung> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/item/ruestung-sheet.hbs',
            width: 512,
            height: 766,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'armor' }
            ]
        });
    }
}
