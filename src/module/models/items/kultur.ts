import { Quelle } from "./quelle";
import { Info } from "./info";
import { Modifier } from "./modifier";
import {Chargen} from './chargen';

export interface Kultur extends Info, Quelle, Chargen {
  sprache: string;
  kulturkunde: string;
  modifier: Array<Modifier>;
}
