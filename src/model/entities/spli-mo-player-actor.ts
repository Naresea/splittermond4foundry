import { SpliMoActor } from './spli-mo-actor';
import { SpliMoActorType } from './spli-mo-actor-type';

export interface SpliMoPlayerActor extends SpliMoActor {
    type: SpliMoActorType.Player;
    ausbildung: string;
    kultur: string;
    abstammung: string;
    rasse: string;
    geschlecht: string;
    haarfarbe: string;
    koerpergroesse: string;
    augenfarbe: string;
    gewicht: string;
    hautfarbe: string;
    geburtsort: string;
    staerken: string;
    sprachen: string;
    kulturkunde: string;
    heldengrad: string;
    maxAttribute: string;
    maxSkill: string;
    solare: number;
    lunare: number;
    kupfer: number;
    erfahrungspunkte: {
        gesamt: number;
        benutzt: number;
        offen: number;
        naechsterHeldengrad: number;
    };
    resourcen: {
        ansehen: {
            wert: number;
            bedeutung: string;
        };
        gefolge: {
            wert: number;
            bedeutung: string;
        };
        kontakte: {
            wert: number;
            bedeutung: string;
        };
        kreatur: {
            wert: number;
            bedeutung: string;
        };
        mentor: {
            wert: number;
            bedeutung: string;
        };
        rang: {
            wert: number;
            bedeutung: string;
        };
        relikt: {
            wert: number;
            bedeutung: string;
        };
        stand: {
            wert: number;
            bedeutung: string;
        };
        vermoegen: {
            wert: number;
            bedeutung: string;
        };
        glaube: {
            wert: number;
            bedeutung: string;
        };
    };
    masteries: {
        0: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        1: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        2: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        3: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        4: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        5: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        6: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        7: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        8: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        9: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        10: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        11: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        12: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        13: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        14: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
        15: {
            name: string;
            schwelle: number;
            skill: string;
            effekt: string;
        };
    };
    staerkenDetailed: {
        0: {
            name: string;
            effekt: string;
        };
        1: {
            name: string;
            effekt: string;
        };
        2: {
            name: string;
            effekt: string;
        };
        3: {
            name: string;
            effekt: string;
        };
        4: {
            name: string;
            effekt: string;
        };
        5: {
            name: string;
            effekt: string;
        };
        6: {
            name: string;
            effekt: string;
        };
        7: {
            name: string;
            effekt: string;
        };
        8: {
            name: string;
            effekt: string;
        };
        9: {
            name: string;
            effekt: string;
        };
        10: {
            name: string;
            effekt: string;
        };
        11: {
            name: string;
            effekt: string;
        };
        12: {
            name: string;
            effekt: string;
        };
        13: {
            name: string;
            effekt: string;
        };
        14: {
            name: string;
            effekt: string;
        };
        15: {
            name: string;
            effekt: string;
        };
    };
    ausruestung: {
        0: {
            name: string;
            last: string;
        };
        1: {
            name: string;
            last: string;
        };
        2: {
            name: string;
            last: string;
        };
        3: {
            name: string;
            last: string;
        };
        4: {
            name: string;
            last: string;
        };
        5: {
            name: string;
            last: string;
        };
        6: {
            name: string;
            last: string;
        };
        7: {
            name: string;
            last: string;
        };
        8: {
            name: string;
            last: string;
        };
        9: {
            name: string;
            last: string;
        };
        10: {
            name: string;
            last: string;
        };
        11: {
            name: string;
            last: string;
        };
        12: {
            name: string;
            last: string;
        };
        13: {
            name: string;
            last: string;
        };
        14: {
            name: string;
            last: string;
        };
        15: {
            name: string;
            last: string;
        };
    };
    waffen: {
        0: {
            name: string;
            skill: string;
            primaryAttribute: string;
            secondaryAttribute: string;
            wgs: string;
            dmg: string;
            merkmale: string;
            wert: number;
        };
        1: {
            name: string;
            skill: string;
            primaryAttribute: string;
            secondaryAttribute: string;
            wgs: string;
            dmg: string;
            merkmale: string;
            wert: number;
        };
        2: {
            name: string;
            skill: string;
            primaryAttribute: string;
            secondaryAttribute: string;
            wgs: string;
            dmg: string;
            merkmale: string;
            wert: number;
        };
        3: {
            name: string;
            skill: string;
            primaryAttribute: string;
            secondaryAttribute: string;
            wgs: string;
            dmg: string;
            merkmale: string;
            wert: number;
        };
        4: {
            name: string;
            skill: string;
            primaryAttribute: string;
            secondaryAttribute: string;
            wgs: string;
            dmg: string;
            merkmale: string;
            wert: number;
        };
    };
    schilde: {
        0: {
            name: string;
            skill: string;
            vtd: number;
            merkmale: string;
        };
        1: {
            name: string;
            skill: string;
            vtd: number;
            merkmale: string;
        };
        2: {
            name: string;
            skill: string;
            vtd: number;
            merkmale: string;
        };
        3: {
            name: string;
            skill: string;
            vtd: number;
            merkmale: string;
        };
        4: {
            name: string;
            skill: string;
            vtd: number;
            merkmale: string;
        };
    };
    ruestungen: {
        0: {
            name: string;
            vtd: number;
            sr: number;
            beh: number;
            tick: number;
        };
        1: {
            name: string;
            vtd: number;
            sr: number;
            beh: number;
            tick: number;
        };
        2: {
            name: string;
            vtd: number;
            sr: number;
            beh: number;
            tick: number;
        };
        3: {
            name: string;
            vtd: number;
            sr: number;
            beh: number;
            tick: number;
        };
        4: {
            name: string;
            vtd: number;
            sr: number;
            beh: number;
            tick: number;
        };
    };
    zauber: {
        0: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        1: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        2: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        3: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        4: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        5: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        6: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        7: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        8: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        9: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        10: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        11: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        12: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        13: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        14: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        15: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        16: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        17: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        18: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
        19: {
            name: string;
            schule: string;
            grad: number;
            schwierigkeit: string;
            fokus: string;
            zauberdauer: string;
            reichweite: string;
            wirkungsdauer: string;
            verstaerkung: string;
            quelle: string;
            effekt: string;
        };
    };
    hpTracker: {
        0: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        1: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        2: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        3: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        4: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
    };
    fokusTracker: {
        0: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        1: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        2: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        3: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
        4: {
            0: number;
            1: number;
            2: number;
            3: number;
            4: number;
            5: number;
            6: number;
            7: number;
            8: number;
            9: number;
            10: number;
            11: number;
            12: number;
            13: number;
            14: number;
            15: number;
        };
    };
}
