import {Info} from './info';
import {Quelle} from './quelle';
import {Action} from './action';
import {CalculationService} from '../../services/calculation-service';

export interface Zauber extends Info, Quelle, Action {
    grad: number;
    fertigkeit: string;
    schwierigkeit: number;
    schwierigkeitString: string;
    fokusErschoepft: number;
    fokusVerzehrt: number;
    fokusKanalisiert: number;
    zauberdauerString: string;
    reichweite: number;
    reichweiteString: string;
    wirkungsdauer: number;
    wirkungsdauerString: string;
    bereich: number;
    bereichString: string;
    verstaerkung: string;
    schaden: string;
}

export function buildFokusString(zauber: Zauber): string {
    const erschoepft = zauber.fokusErschoepft;
    const kanalisiert = zauber.fokusKanalisiert;
    const verzehrt = zauber.fokusVerzehrt;
    return CalculationService.toEKVString(erschoepft, kanalisiert, verzehrt);
}
