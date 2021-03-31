import {Quelle} from './quelle';
import {Info} from './info';
import {Modifier} from './modifier';

export interface Kultur extends Info, Quelle {
    sprache: string;
    kulturkunde: string;
    modifier: Array<Modifier>;
}
