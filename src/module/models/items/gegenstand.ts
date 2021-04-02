import { Info } from "./info";
import { Quelle } from "./quelle";

export interface Gegenstand extends Info, Quelle {
  wertInTellaren: number;
  gewicht: number;
  anzahl: number;
}
