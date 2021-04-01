import {Info} from './info';
import {Quelle} from './quelle';

export interface Mondzeichen extends Info, Quelle {
    grad: number;
}
