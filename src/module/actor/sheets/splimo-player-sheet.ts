import {SplimoActorSheet} from '../splimo-actor-sheet';
import {PlayerCharacter} from '../../models/actors/player-character';
import {ItemType} from '../../models/item-type';
import {getSheetClass} from '../../item/register-item-sheets';
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
}
