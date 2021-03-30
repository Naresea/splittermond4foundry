export interface Attributes {
    AUS: number;
    BEW: number;
    INT: number;
    KON: number;
    MYS: number;
    STR: number;
    VER: number;
    WIL: number;
    GK: number;
}

export interface IncAttributes {
    incAUS: number;
    incBEW: number;
    incINT: number;
    incKON: number;
    incMYS: number;
    incSTR: number;
    incVER: number;
    incWIL: number;
}

export interface AttributesStartValue {
    startAUS: number;
    startBEW: number;
    startINT: number;
    startKON: number;
    startMYS: number;
    startSTR: number;
    startVER: number;
    startWIL: number;
    startGK: number;
}

export const ATTRIBUTES: Array<keyof Attributes> = [
    'AUS',
    'BEW',
    'INT',
    'KON',
    'MYS',
    'STR',
    'VER',
    'WIL',
    'GK',
];
