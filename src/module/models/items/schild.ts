import {Gegenstand} from './gegenstand';

export interface Schild extends Gegenstand {
    mod: number;
    VTD: number;
    fertigkeit: string;
    attribute: string,
    attributeSecondary: string;
}
