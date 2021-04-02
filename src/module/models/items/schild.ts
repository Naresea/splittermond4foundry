import {Gegenstand} from './gegenstand';
import {Equipment} from './equipment';

export interface Schild extends Gegenstand, Equipment {
    mod: number;
    VTD: number;
    fertigkeit: string;
    attribute: string,
    attributeSecondary: string;
}
