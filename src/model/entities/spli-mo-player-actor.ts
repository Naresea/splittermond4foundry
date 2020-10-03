import { SpliMoActor } from './spli-mo-actor';
import { SpliMoActorType } from './spli-mo-actor-type';

export interface SpliMoPlayerActor extends SpliMoActor {
    type: SpliMoActorType.Player;
}
