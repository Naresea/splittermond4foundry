import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {ItemType} from '../../models/item-type';
import {getSheetClass} from '../../item/register-item-sheets';
import {PlayerDataService} from '../../services/player-data-service';
import {CalculationService} from '../../services/calculation-service';

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
            const id = target?.dataset['clickId'];
            if (operation === 'add' && type != null) {
                this.createItem(type as ItemType);
            }
            if (operation === 'edit' && type != null) {
                this.editItem(type as ItemType, id)
            }
            if (operation === 'delete' && type != null) {
                this.deleteItem(type as ItemType, id)
            }
            if (operation === 'sp-add') {
                this.addSplitterpunkt();
            }
            if (operation === 'sp-reduce') {
                this.removeSplitterpunkt();
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

    getData(): ActorSheet.Data<PlayerCharacter> {
        const calcData = PlayerDataService.getPlayerData(this.actor);
        const data = super.getData();
        (data as any).data = calcData;
        console.log('Sheet data = ', data);
        return data;
    }

    protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
        const viewHealth = formData['data.view.health.asString'];
        const viewMaxHealth = formData['data.view.health.max'];

        const viewFokus = formData['data.view.fokus.asString'];
        const viewMaxFokus = formData['data.view.fokus.max'];

        if (viewHealth) {
            const health = CalculationService.fromEKVString(viewHealth);
            formData['data.healthErschoepft'] = health.erschoepft;
            formData['data.healthKanalisiert'] = health.kanalisiert;
            formData['data.healthVerzehrt'] = health.verzehrt;
            delete formData['data.view.health.asString'];
            if (viewMaxHealth != null) {
                formData['data.health.value'] = viewMaxHealth - health.erschoepft - health.kanalisiert - health.verzehrt;
                formData['data.health.max'] = viewMaxHealth;
                formData['data.health.min'] = 0;
                delete formData['data.view.health.max'];
            }
        }

        if (viewFokus) {
            const fokus = CalculationService.fromEKVString(viewFokus);
            formData['data.fokusErschoepft'] = fokus.erschoepft;
            formData['data.fokusKanalisiert'] = fokus.kanalisiert;
            formData['data.fokusVerzehrt'] = fokus.verzehrt;
            delete formData['data.view.fokus.asString'];
            if (viewMaxFokus != null) {
                formData['data.fokus.value'] = viewMaxFokus - fokus.erschoepft - fokus.kanalisiert - fokus.verzehrt;
                formData['data.fokus.max'] = viewMaxFokus;
                formData['data.fokus.min'] = 0;
                delete formData['data.view.fokus.max'];
            }
        }

        return super._updateObject(event, formData);
    }

    private addSplitterpunkt(): void {
        this.actor.update({
            id: this.actor.id,
            data: {
                splitterpunkte: {
                    value: Math.min(15, this.actor.data.data.splitterpunkte.value + 1)
                }
            }
        }).then(() => this.render());
    }

    private removeSplitterpunkt() {
        this.actor.update({
            id: this.actor.id,
            data: {
                splitterpunkte: {
                    value: Math.max(0, this.actor.data.data.splitterpunkte.value - 1)
                }
            }
        }).then(() => this.render());
    }
}
