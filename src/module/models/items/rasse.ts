import {Quelle} from './quelle';
import {Info} from './info';
import {Modifier} from './modifier';

export interface Rasse extends Info, Quelle {
    attributeMod: Array<Modifier>;
}
