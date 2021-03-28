import {Benutzbar} from './benutzbar';

export interface Waffe extends Benutzbar {
    attribute: string,
    attributeSecondary: string;
    mod: number;
    schaden: number;
}
