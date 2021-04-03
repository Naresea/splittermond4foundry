import { Quelle } from "./quelle";
import { Info } from "./info";
import { Modifier } from "./modifier";
import {Chargen} from './chargen';

export interface Abstammung extends Info, Quelle, Chargen {
  modifier: Array<Modifier>;
}
