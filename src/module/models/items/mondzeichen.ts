import {Info} from './info';
import {Quelle} from './quelle';

export interface Mondzeichen extends Info, Quelle {
    grad: number;
    effektEins: string;
    effektZwei: string;
    effektDrei: string;
    effektVier: string;

}
