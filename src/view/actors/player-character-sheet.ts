import { AbstractActorSheet } from './abstract-actor-sheet';
import { getSystemName } from '../../utils/get-system-name';
import { SpliMoPlayerActor } from '../../model/entities/spli-mo-player-actor';
import { getDeleteSelector } from '../../utils/get-delete-selector';

export type SpliMoPlayerSheetData = SpliMoPlayerActor;

export class PlayerCharacterSheet extends AbstractActorSheet<SpliMoPlayerActor, SpliMoPlayerSheetData> {
    public getViewData(actor: Actor<SpliMoPlayerActor>): SpliMoPlayerSheetData {
        return actor.data.data;
    }

    public updateViewData(
        formData: Record<string, any>,
        actor: Actor<SpliMoPlayerActor>
    ): Promise<Record<string, any>> {
        console.debug('Received form data: ', JSON.parse(JSON.stringify(formData)));
        Object.keys(formData)
            .filter((key) => key.includes('.skills.'))
            .forEach((skill) => {
                const value = formData[skill];
                if (Array.isArray(value)) {
                    formData[skill] = +value[0];
                } else {
                    formData[skill] = +value;
                }
            });
        return Promise.resolve(formData);
    }

    public static get defaultOptions(): FormApplication.Options {
        return mergeObject(super.defaultOptions, {
            classes: [],
            template: `systems/${getSystemName()}/templates/player-character-sheet/sheet.hbs`,
            width: 1100,
            height: 700,
            submitOnClose: true,
            submitOnChange: false,
            closeOnSubmit: false,
            // NOTE: navSelector MUST BE of type <nav> and MUST have class "tabs" and MUST have data-group set
            // and each of its links MUST be of type <a> and MUST have class "item"
            // and MUST have a data-tab set
            // contentSelector doesn't matter as long as its children have data-group and data-tab set
            tabs: [{ navSelector: '.pcs-navbar', contentSelector: '.pcs-content', initial: 'attribute' }],
            dragDrop: [{ dragSelector: '.item-list .item', dropSelector: null }],
        });
    }

    public registerEventHandlers(html: JQuery<HTMLElement>): void {
        super.registerEventHandlers(html);

        const navBar = html.find('.pcs-navbar');
        const navBarGroup = navBar.data('group');
        const navBarTabs = navBar.find('[data-tab]');
        const contentTabs = html.find('.pcs-content [data-tab][data-group]');
        navBarTabs.on('click', (evt) => {
            const tabName = evt.currentTarget?.dataset?.tab;
            if (tabName != null) {
                const contentTabElems = contentTabs.toArray();
                contentTabElems.forEach((tabElem) => {
                    const group = tabElem.dataset.group;
                    const t = tabElem.dataset.tab;
                    if (group && t) {
                        if (group === navBarGroup && t === tabName) {
                            tabElem.classList.remove('nav-tab--invisible');
                        } else if (group === navBarGroup && t !== tabName) {
                            tabElem.classList.add('nav-tab--invisible');
                        }
                    }
                });
            }
        });
        console.log('Found elements: ', {
            navBar,
            navBarTabs,
            contentTabs,
        });

        html.find(getDeleteSelector()).on('click', (evt) => {
            console.log('Deleting: ', evt.currentTarget.dataset.delete);
            const path: string | undefined = evt.currentTarget?.dataset?.delete;
            if (path != null) {
                void this.actor.update({
                    [path]: null,
                });
            }
        });
    }
}
