import { SpliMoActorType } from './spli-mo-actor-type';

export interface SpliMoActor {
    name: string;
    type: SpliMoActorType;
    resources: {
        // resources in the foundry sense: these fields can be shown as bars on a token
        // do not confuse with "resourcen" from the SpliMo GRW.
        splitterpunkte: {
            min: number;
            max: number;
            value: number;
        };
        lebenspunkte: {
            min: number;
            max: number;
            value: number;
        };
        // these are intended for the levels, not for the modifiers these levels cause
        // e.g. a normal PC ranges from min:0 to max:5, while a weak NPC ranges from min:0 to max:3
        // and a fragile creature ranges from min:0 to max:1
        wunden: {
            min: number;
            max: number;
            value: number;
        };
        fokus: {
            min: number;
            max: number;
            value: number;
        };
    };
    attributes: {
        ausstrahlung: number;
        beweglichkeit: number;
        intuition: number;
        konstitution: number;
        mystik: number;
        staerke: number;
        verstand: number;
        willenskraft: number;
    };
    derivedAttributes: {
        groessenklasse: number;
        geschwindigkeit: number;
        initiative: number;
        lebenspunkte: number;
        fokus: number;
        verteidigung: number;
        geistigerWiderstand: number;
        koerperlicherWiderstand: number;
    };
    combatAttributes: {
        currentTick: number;
        currentWoundLevel: number;
    };
    skills: {
        akrobatik: number;
        alchemie: number;
        anfuehren: number;
        arkaneKunde: number;
        athletik: number;
        darbietung: number;
        diplomatie: number;
        edelhandwerk: number;
        empathie: number;
        entschlossenheit: number;
        fingerfertigkeit: number;
        geschichteUndMythen: number;
        handwerk: number;
        heilkunde: number;
        heimlichkeit: number;
        jagdkunst: number;
        laenderkunde: number;
        naturkunde: number;
        redegewandheit: number;
        schloesserUndFallen: number;
        schwimmen: number;
        seefahrt: number;
        strassenkunde: number;
        tierfuehrung: number;
        ueberleben: number;
        wahrnehmung: number;
        zaehigkeit: number;
    };
    combatSkills: {
        handgemenge: number;
        hiebwaffen: number;
        kettenwaffen: number;
        klingenwaffen: number;
        schusswaffen: number;
        stangenwaffen: number;
        wurfwaffen: number;
    };
    magicSkills: {
        bann: number;
        beherrschung: number;
        bewegung: number;
        erkenntnis: number;
        fels: number;
        feuer: number;
        heilung: number;
        illusion: number;
        kampf: number;
        licht: number;
        natur: number;
        schatten: number;
        schicksal: number;
        schutz: number;
        staerkung: number;
        tod: number;
        verwandlung: number;
        wasser: number;
        wind: number;
    };
}
