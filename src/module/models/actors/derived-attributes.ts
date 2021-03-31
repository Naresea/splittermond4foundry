export interface DerivedAttributes {
    GSW: number;
    INI: number;
    LP: number;
    FO: number;
    VTD: number;
    GW: number;
    KW: number;
}

export const DERIVED_ATTRIBUTES: Array<keyof DerivedAttributes> = [
    'GSW',
    'INI',
    'LP',
    'FO',
    'VTD',
    'GW',
    'KW',
]
