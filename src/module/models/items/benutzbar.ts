import {Gegenstand} from './gegenstand';
import {Action} from './action';

export interface Benutzbar extends Gegenstand, Action {
    wirdVerbraucht: boolean;
}
