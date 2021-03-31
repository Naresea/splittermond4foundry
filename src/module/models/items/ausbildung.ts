import {Quelle} from './quelle';
import {Info} from './info';
import {Modifier} from './modifier';

export interface Ausbildung extends Info, Quelle {
    modifier: Array<Modifier>;
}
