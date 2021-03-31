export enum ModifierType {
    Attribute = 'attribute',
    Fertigkeit = 'fertigkeit'
}

export interface Modifier {
    type: ModifierType;
    target: string;
    value: number;
}
