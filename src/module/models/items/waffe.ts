import { Benutzbar } from "./benutzbar";
import { Equipment } from "./equipment";

export interface Waffe extends Benutzbar, Equipment {
  attribute: string;
  attributeSecondary: string;
  fertigkeit: string;
  mod: number;
  schaden: string;
  reichweite?: number;
}
