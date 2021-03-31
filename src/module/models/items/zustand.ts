import {Info} from './info';
import {Quelle} from './quelle';
import {Modifier} from './modifier';

export interface Zustand extends Info, Quelle {
    modifier: Array<Modifier>;
}
