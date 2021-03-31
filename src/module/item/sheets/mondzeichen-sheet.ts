import {SplimoItemSheet} from '../splimo-item-sheet';
import {Mondzeichen} from '../../models/items/mondzeichen';

export class MondzeichenSheet extends SplimoItemSheet<Mondzeichen> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/item/mondzeichen-sheet.hbs',
            width: 512,
            height: 766,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }
            ]
        });
    }
}
