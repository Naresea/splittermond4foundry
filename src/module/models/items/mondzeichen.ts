import {Info} from './info';
import {Quelle} from './quelle';

export interface Mondzeichen extends Info, Quelle {
    effekt: Array<{
        grad: number;
        beschreibung: string;
    }>
}
