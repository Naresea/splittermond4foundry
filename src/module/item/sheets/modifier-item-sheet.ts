import {Modifier} from '../../models/items/modifier';

export class ModifierItemSheet extends FormApplication<Modifier> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/item/modifier-sheet.hbs',
            width: 512,
            height: 766,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'description' }
            ]
        });
    }

    private readonly update;

    constructor(object?: Modifier, options?: FormApplication.Options, update?: (event: Event | JQuery.Event, formData: any) => Promise<any>) {
        super(object, options);
        this.update = update;
    }

    getData(options?: object): any | Promise<any> {
        return this.object;
    }

    protected _updateObject(event: Event | JQuery.Event, formData: object): Promise<any> {
        return this.update ? this.update(event, formData as any) : Promise.reject('No update defined.');
    }
}
