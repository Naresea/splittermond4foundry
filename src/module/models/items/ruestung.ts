import {Gegenstand} from './gegenstand';

export interface Ruestung extends Gegenstand {
    VTD: number;
    SR: number;
    BEH: number;
    tickPlus: number;
}
