import { AbstractActorSheet } from './abstract-actor-sheet';
import { getSystemName } from '../../utils/get-system-name';
import { SpliMoNonPlayerActor } from '../../model/entities/spli-mo-non-player-actor';

export type SpliMoNonPlayerSheetData = SpliMoNonPlayerActor;

export class NonPlayerCharacterSheet extends AbstractActorSheet<SpliMoNonPlayerActor, SpliMoNonPlayerSheetData> {
    public getViewData(actor: Actor<SpliMoNonPlayerActor>): SpliMoNonPlayerSheetData {
        return actor.data.data;
    }

    public updateViewData(
        formData: Record<string, any>,
        actor: Actor<SpliMoNonPlayerActor>
    ): Promise<Record<string, any>> {
        return Promise.resolve(formData);
    }

    public static get defaultOptions(): FormApplicationOptions {
        return mergeObject(super.defaultOptions, {
            classes: [],
            template: `systems/${getSystemName()}/templates/non-player-character-sheet/sheet.hbs`,
            width: 1100,
            height: 700,
            submitOnClose: true,
            submitOnChange: true,
            closeOnSubmit: false,
            // NOTE: navSelector MUST BE of type <nav> and MUST have class "tabs" and MUST have data-group set
            // and each of its links MUST be of type <a> and MUST have class "item"
            // and MUST have a data-tab set
            // contentSelector doesn't matter as long as its children have data-group and data-tab set
            tabs: [
                { navSelector: '.pcs-sidebar', contentSelector: '.pcs-content' },
                { navSelector: '#pcs-races-nav', contentSelector: '#pcs-races-content' },
            ],
            dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }],
        });
    }
}
