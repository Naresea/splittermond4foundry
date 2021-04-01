import {Info} from './info';
import {Quelle} from './quelle';

export enum FertigkeitType {
    Allgemein = 'allgemein',
    Kampf = 'kampf',
    Magie = 'magie'
}

export interface Fertigkeit extends Info, Quelle {
    attributEins: string;
    attributZwei: string;
    punkte: number;
    mod: number;
    type: FertigkeitType;
}
