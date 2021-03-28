import {SplimoActor} from './splimo-actor';
import {SplimoPlayerSheet} from './sheets/splimo-player-sheet';
import {SplimoNpcSheet} from './sheets/splimo-npc-sheet';
import {ActorType} from '../models/actor-type';

export function registerActorSheets(): void {
    CONFIG.Actor.entityClass = SplimoActor as typeof Actor;
    Actors.unregisterSheet('core', ActorSheet);
    Actors.registerSheet('splittermond', SplimoPlayerSheet, { types: [ActorType.PlayerCharacter], makeDefault: true });
    Actors.registerSheet('splittermond', SplimoNpcSheet, { types: [ActorType.NonPlayerCharacter], makeDefault: false });
}
