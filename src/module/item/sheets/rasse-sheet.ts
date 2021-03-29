import {SplimoItemSheet} from '../splimo-item-sheet';
import {Rasse} from '../../models/items/rasse';
import {Modifier} from '../../models/items/modifier';
import {ModifierItemSheet} from './modifier-item-sheet';

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

    getData(): ItemSheet.Data<Rasse> {
        const data = super.getData();
        const modifier = this.item.data.data.attributeMod
            .map((mod) => {
                return {
                    fields: [
                        mod.type,
                        mod.target,
                        `${mod.value}`
                    ]
                }
            });
        data.data.modifier = modifier;
        return data;
    }

    protected activateListeners(html: JQuery<HTMLElement>): void {
        super.activateListeners(html);
        this.registerCreateModifierClick(html);
        this.registerEditModifierClick(html);
        this.registerDeleteModifierClick(html);
    }

    private registerCreateModifierClick(html: JQuery<HTMLElement>): void {
        html.find('.rasse-modifier .add-item').on('click', () => {
            const modifier: Modifier = {
                value: 2,
                target: 'AUS',
                type: 'attribute'
            };

            new ModifierItemSheet(
                modifier,
                {
                    editable: true,
                    submitOnClose: true,
                    closeOnSubmit: false
                },
                (evt, formData) => {
                    modifier.value = formData.value;
                    modifier.type = formData.type;
                    modifier.target = formData.target;
                    return this.item.update({
                        _id: this.item.id,
                        data: {
                            attributeMod: [...this.item.data.data.attributeMod, modifier]
                        }
                    });
                }
            ).render(true);
        });
    }

    private registerEditModifierClick(html: JQuery<HTMLElement>): void {
        html.find('.rasse-modifier .edit-item').on('click', (evt) => {
            const index = +evt.target.dataset.index;
            const modifier: Modifier = this.item.data.data.attributeMod[index];

            new ModifierItemSheet(
                modifier,
                {
                    editable: true,
                    submitOnClose: true,
                    closeOnSubmit: false
                },
                (evt, formData) => {
                    modifier.value = formData.value;
                    modifier.type = formData.type;
                    modifier.target = formData.target;
                    return this.item.update({
                        _id: this.item.id,
                        data: {
                            attributeMod: [...this.item.data.data.attributeMod]
                        }
                    });
                }
            ).render(true);
        });
    }

    private registerDeleteModifierClick(html: JQuery<HTMLElement>): void {
        html.find('.rasse-modifier .delete-item').on('click', (evt) => {
            const index = +evt.target.dataset.index;
            this.item.data.data.attributeMod.splice(index, 1)
            this.item.update({
                        _id: this.item.id,
                        data: {
                            attributeMod: this.item.data.data.attributeMod
                        }
                    });
                }
            );
    }

}