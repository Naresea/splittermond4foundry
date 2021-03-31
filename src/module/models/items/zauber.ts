import {Info} from './info';
import {Quelle} from './quelle';
import {Action} from './action';

export interface Zauber extends Info, Quelle, Action {
    grad: number;
    fertigkeit: string;
    schwierigkeit: number;
    schwierigkeitString: string;
    fokusErschoepft: number;
    fokusVerzehrt: number;
    fokusKanalisiert: number;
    zauberDauerString: string;
    reichweite: number;
    reichweiteString: string;
    wirkungsdauer: number;
    verstaerkung: string;
}
