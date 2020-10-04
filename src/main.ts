import { SpliMoActorType } from './model/entities/spli-mo-actor-type';
import { getSystemName } from './utils/get-system-name';
import { PlayerCharacterSheet } from './view/actors/player-character-sheet';
import { ActorController } from './controller/actor.controller';
import { ItemController } from './controller/item.controller';
import { NonPlayerCharacterSheet } from './view/actors/npc-actor-sheet';
import HelperOptions = Handlebars.HelperOptions;
import { getRollableClass } from './utils/get-rollable-selector';

const registeredPartials = new Map<string, string>();

Hooks.once('init', () => {
    CONFIG.Actor.entityClass = ActorController as typeof Actor;
    CONFIG.Item.entityClass = ItemController as typeof Item;

    setupConfig();

    registerHandlebarsPartials()
        .then(() => console.log('Registered partials.'))
        .catch((e) => console.error('Registering partials failed: ', e));
    registerHandlebarsHelpers();

    registerActorSheets();
    registerItemSheets();
});

export function setupConfig(): void {
    CONFIG[getSystemName()] = {};
}

export function registerActorSheets(): void {
    console.log('Registering Splittermond Actor Sheets...');
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet(SpliMoActorType.Player, PlayerCharacterSheet, {
        types: [SpliMoActorType.Player],
        makeDefault: true,
    });

    Actors.registerSheet(SpliMoActorType.NonPlayer, NonPlayerCharacterSheet, {
        types: [SpliMoActorType.NonPlayer],
        makeDefault: true,
    });
}

export function registerItemSheets(): void {
    console.log('Registering Splittermond Item Sheets...');
}

export function registerHandlebarsHelpers(): void {
    Handlebars.registerHelper('partial', (name: string): string | undefined => {
        return registeredPartials.get(name);
    });

    Handlebars.registerHelper('asset', (name: string): string => {
        return `systems/${getSystemName()}/assets/${name}`;
    });

    Handlebars.registerHelper('sum', (...values: Array<unknown>): number => {
        return values
            .map((v) => {
                if (typeof v === 'string') {
                    return +v;
                }
                if (typeof v === 'number') {
                    return v;
                }
                return NaN;
            })
            .filter((v: number): v is number => !isNaN(v))
            .reduce((accu, curr) => accu + curr, 0);
    });

    Handlebars.registerHelper('value', (path: string, data: any): unknown => {
        const split = path.split('.');
        let target = data;
        for (let i = 0; i < split.length; i++) {
            target = target[split[i]];
        }
        return target as unknown;
    });

    Handlebars.registerHelper('concat', (...values: Array<unknown>): string => {
        return values
            .map((v) => {
                if (typeof v === 'string') {
                    return v;
                }
                if (typeof v === 'number') {
                    return `${v}`;
                }
                return undefined;
            })
            .filter((v: string | undefined): v is string => v != null)
            .reduce((accu, curr) => accu + curr, '');
    });

    let unnamedTextIdCounter = 0;

    Handlebars.registerHelper(
        'formText',
        (
            label: string,
            name: string,
            value: string | number,
            isRollable = false,
            isDisabled = false,
            ...addClasses: Array<string | HelperOptions | undefined>
        ): string => {
            // make optional parameters possible for Handlebars...
            // if the template omits these values, the "HelperDelegeteOptions" object will be put in their place
            isRollable = typeof isRollable === 'boolean' ? isRollable : false;
            isDisabled = typeof isDisabled === 'boolean' ? isDisabled : false;

            const addedClasses: string = addClasses.filter((c) => c != null && typeof c === 'string').join(' ');
            const translatedLabel = game.i18n.localize(label);
            const translatedPlaceholder = game.i18n.localize(`${label}Placeholder`);
            const rollValue: number = typeof value === 'string' ? +value : value;
            const rollableLabelClass: string = isRollable ? getRollableClass() : '';
            const rollableInputClass = '';

            if (!name || name.trim().length < 1) {
                name = `unnamed_element_${unnamedTextIdCounter++}`;
            }

            const inputValue = isDisabled
                ? `<input type="text" disabled class="w-50 ${rollableInputClass}" name="${name}" value="${value}" placeholder="${translatedPlaceholder}" data-roll="${
                      isRollable ? rollValue : 0
                  }"/>`
                : `<input type="text" class="w-50 ${rollableInputClass}" name="${name}" value="${value}" placeholder="${translatedPlaceholder}" data-roll="${
                      isRollable ? rollValue : 0
                  }"/>`;

            let result = `<div class="d-flex align-items-center justify-content-between ${addedClasses}">`;
            result += `<label class="w-50 mr-2 mb-0 ${rollableLabelClass}" for="${name}" data-roll="${
                isRollable ? rollValue : 0
            }">${translatedLabel}</label>`;
            result += inputValue;
            result += '</div>';
            return result;
        }
    );
}

export async function registerHandlebarsPartials(): Promise<void> {
    const partials: Array<string> = getKnownPartials();
    const paths: Array<string> = [];
    partials.forEach((file) => {
        const path = `systems/${getSystemName()}/templates/${file}.hbs`;
        registeredPartials.set(file, path);
        paths.push(path);
    });
    await loadTemplates(paths);
}

export function getKnownPartials(): Array<string> {
    return [];
}
