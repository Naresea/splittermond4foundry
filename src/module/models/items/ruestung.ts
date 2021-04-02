import { Gegenstand } from "./gegenstand";
import { Equipment } from "./equipment";

export interface Ruestung extends Gegenstand, Equipment {
  VTD: number;
  SR: number;
  BEH: number;
  tickPlus: number;
}
