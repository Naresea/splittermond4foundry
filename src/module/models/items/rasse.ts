import {Quelle} from './quelle';
import {Info} from './info';

export interface Rasse extends Info, Quelle {
    groessenklasse: number;
    attributeMod: Array<{
        attribute: string;
        value: number
    }>;
}
