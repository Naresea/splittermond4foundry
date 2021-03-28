import {Abstammung} from './items/abstammung';
import {Ausbildung} from './items/ausbildung';
import {Kultur} from './items/kultur';
import {Rasse} from './items/rasse';
import {Staerke} from './items/staerke';
import {Schwaeche} from './items/schwaeche';
import {Fertigkeit} from './items/fertigkeit';
import {Meisterschaft} from './items/meisterschaft';
import {Resource} from './items/resource';
import {Waffe} from './items/waffe';
import {Ruestung} from './items/ruestung';
import {Schild} from './items/schild';
import {Gegenstand} from './items/gegenstand';
import {Benutzbar} from './items/benutzbar';
import {Merkmal} from './items/merkmal';
import {Zustand} from './items/zustand';
import {Zauber} from './items/zauber';
import {Mondzeichen} from './items/mondzeichen';

export const enum ItemType {
    Abstammung = 'abstammung',
    Ausbildung = "ausbildung",
    Kultur = "kultur",
    Rasse = "rasse",
    Mondzeichen = "mondzeichen",
    Staerke = "staerke",
    Schwaeche = "schwaeche",
    Fertigkeit = "fertigkeit",
    Meisterschaft = "meisterschaft",
    Resource = "resource",
    Zauber = "zauber",
    Waffe = "waffe",
    Ruestung = "ruestung",
    Schild = "schild",
    Gegenstand = "gegenstand",
    Benutzbar = "benutzbar",
    Merkmal = "merkmal",
    Zustand = "zustand"
}

export type AnySplimoItem =
    | Abstammung
    | Ausbildung
    | Kultur
    | Rasse
    | Mondzeichen
    | Staerke
    | Schwaeche
    | Fertigkeit
    | Meisterschaft
    | Resource
    | Zauber
    | Waffe
    | Ruestung
    | Schild
    | Gegenstand
    | Benutzbar
    | Merkmal
    | Zustand;
