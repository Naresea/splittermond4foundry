export enum ModifierType {
    Attribute = 'attribute',
    Fertigkeit = 'fertigkeit',
    TickPlus = 'tickPlus',
    WoundLevels = 'woundLevel'
}

export interface Modifier {
    type: ModifierType;
    target: string;
    value: number;
}
