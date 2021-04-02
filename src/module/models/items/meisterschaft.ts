import {Quelle} from './quelle';
import {Info} from './info';
import {Modifier} from './modifier';

export interface Meisterschaft extends Info, Quelle {
    modifier: Array<Modifier>;
    schwelle: number;
    fertigkeit: string;
    isManeuver: boolean;
    egCost: boolean;
    maneuverEffekt: string;
}
