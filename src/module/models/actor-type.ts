import { PlayerCharacter } from "./actors/player-character";
import { NonPlayerCharacter } from "./actors/non-player-character";

export const enum ActorType {
  PlayerCharacter = "PlayerCharacter",
  NonPlayerCharacter = "NonPlayerCharacter",
}

export type AnySplimoActor = PlayerCharacter | NonPlayerCharacter;
