export interface Hp {
    health: {
        min: number;
        max: number;
        value: number;
    };
    healthErschoepft: number;
    healthVerzehrt: number;
    healthKanalisiert: number;
    woundLevel: number;
    woundModifier: number;
}
