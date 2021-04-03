import { Quelle } from "./quelle";
import { Info } from "./info";
import { Modifier } from "./modifier";
import { Chargen } from "./chargen";

export interface Ausbildung extends Info, Quelle, Chargen {
  modifier: Array<Modifier>;
}
