import { Quelle } from "./quelle";
import { Info } from "./info";
import { Modifier } from "./modifier";

export interface Staerke extends Info, Quelle {
  modifier: Array<Modifier>;
}
