import { AbstractActorSheet } from './abstract-actor-sheet';
import { getSystemName } from '../../utils/get-system-name';
import { SpliMoPlayerActor } from '../../model/entities/spli-mo-player-actor';

export type SpliMoPlayerSheetData = SpliMoPlayerActor;

export class PlayerCharacterSheet extends AbstractActorSheet<SpliMoPlayerActor, SpliMoPlayerSheetData> {
    public getViewData(actor: Actor<SpliMoPlayerActor>): SpliMoPlayerSheetData {
        return actor.data.data;
    }

    public updateViewData(formData: FormData, actor: Actor<SpliMoPlayerActor>): Promise<void> {
        return Promise.resolve();
    }

    public static get defaultOptions(): FormApplicationOptions {
        return mergeObject(super.defaultOptions, {
            classes: [],
            template: `systems/${getSystemName()}/templates/player-character-sheet/sheet.hbs`,
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
