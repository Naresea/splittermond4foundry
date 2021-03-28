import {Quelle} from './quelle';
import {Info} from './info';

export interface Kultur extends Info, Quelle {
    sprache: string;
    kulturkunde: string;
}
