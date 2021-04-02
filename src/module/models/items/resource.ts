import { Info } from "./info";
import { Quelle } from "./quelle";

export interface Resource extends Info, Quelle {
  punkte: number;
}
