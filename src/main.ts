import { SpliMoActorType } from './model/entities/spli-mo-actor-type';
import { getSystemName } from './utils/get-system-name';
import { PlayerCharacterSheet } from './view/actors/player-character-sheet';
import { ActorController } from './controller/actor.controller';
import { ItemController } from './controller/item.controller';
import { NonPlayerCharacterSheet } from './view/actors/npc-actor-sheet';

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
