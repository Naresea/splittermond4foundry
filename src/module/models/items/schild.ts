import { Gegenstand } from "./gegenstand";
import { Equipment } from "./equipment";

export interface Schild extends Gegenstand, Equipment {
  mod: number;
  VTD: number;
  BEH: number;
  schaden: string;
  fertigkeit: string;
  attribute: string;
  attributeSecondary: string;
}
