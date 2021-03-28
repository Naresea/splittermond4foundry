import {Info} from './info';
import {Quelle} from './quelle';
import {Action} from './action';

export interface Zauber extends Info, Quelle, Action {
    grad: number;
    schwierigkeit: number;
    fokusErschoepft: number;
    fokusVerzehrt: number;
    fokusKanalisiert: number;
    zauberDauerMinuten: number;
    reichweite: number;
    wirkungsdauer: number;
    verstaerkung: string;
}
