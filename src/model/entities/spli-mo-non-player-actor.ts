import { SpliMoActor } from './spli-mo-actor';
import { SpliMoActorType } from './spli-mo-actor-type';

export interface SpliMoNonPlayerActor extends SpliMoActor {
    type: SpliMoActorType.NonPlayer;
}
