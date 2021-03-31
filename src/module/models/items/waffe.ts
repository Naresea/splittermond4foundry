import {Benutzbar} from './benutzbar';

export interface Waffe extends Benutzbar {
    attribute: string,
    attributeSecondary: string;
    fertigkeit: string;
    mod: number;
    schaden: string;
}
