import { Quelle } from "./quelle";
import { Info } from "./info";
import { Modifier } from "./modifier";

export interface Merkmal extends Info, Quelle {
  modifier: Array<Modifier>;
}
