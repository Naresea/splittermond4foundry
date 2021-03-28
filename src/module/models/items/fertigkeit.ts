import {Info} from './info';
import {Quelle} from './quelle';

export interface Fertigkeit extends Info, Quelle {
    attributEins: string;
    attributZwei: string;
    punkte: number;
    mod: number
}
