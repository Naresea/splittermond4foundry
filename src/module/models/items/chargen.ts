import {FertigkeitType} from './fertigkeit';

export enum ChoiceType {
    /* Add [mastery | strength | weakness | feature | skill] with the given value */
    FixedValue = 'FixedValue',
    /* Add either A or B or C or... */
    SelectOneOf = 'SelectOneOf',
    /* Pick three: A, B, C, D, E, F, G... */
    SelectNOf = 'SelectNOf',
    /* Distribute x points across A, B, C, D */
    DistributePoints = 'DistributePoints',
    /* Pick one of [A,B,C] at level X and one at level Y */
    MatchMultiple = 'MatchMultiple'
}

export enum ChargenOptionType {
    Skill = 'fertigkeit',
    Mastery = 'meisterschaft',
    Resource = 'resource',
    Strength = 'staerke',
    Weakness = 'schwaeche',
    Attribute = 'attribute'
}

export interface ChargenOption {
    type: ChargenOptionType;
    name: string;
    points?: number;
    // e.g. a combat or magic skill -> [FertigkeitType.Kampf, FertigkeitType.Magic]
    skillTypeFilter?: Array<FertigkeitType>;
    // e.g. a fire, water, earth or air mastery -> ['Feuer', 'Wasser', 'Erde', 'Luft']
    masterySkillFilter?: Array<string>;
    // e.g. a mastery of level 2 or less -> [0,1,2]
    masteryLevelFilter?: Array<number>;
}

export interface Choice<T extends ChargenOption> {
    choiceType: ChoiceType;
    options: Array<T>;
}

export interface Chargen {
    choices: Array<Choice<ChargenOption>>;
}

export interface FixedValueChoice<T extends ChargenOption> extends Choice<T> {
    choiceType: ChoiceType.FixedValue;
}

export interface SelectNOfChoice<T extends ChargenOption> extends Choice<T> {
    choiceType: ChoiceType.SelectNOf;
    numN: number;
}

export interface SelectOneOfChoice<T extends ChargenOption> extends Choice<T> {
    choiceType: ChoiceType.SelectOneOf;
}

export interface DistributePointsChoice<T extends ChargenOption> extends Choice<T> {
    choiceType: ChoiceType.DistributePoints;
    numPoints: number;
}

export interface MatchMultipleChoice<T extends ChargenOption> extends Choice<T> {
    choiceType: ChoiceType.MatchMultiple;
    pointOptions: Array<number>;
}

export function isFixedValueChoice<T extends ChargenOption>(v: Choice<T>): v is FixedValueChoice<T> {
    return v.choiceType === ChoiceType.FixedValue;
}

export function isSelectNOfChoice<T extends ChargenOption>(v: Choice<T>): v is SelectNOfChoice<T> {
    return v.choiceType === ChoiceType.SelectNOf;
}

export function isSelectOneOfChoice<T extends ChargenOption>(v: Choice<T>): v is SelectOneOfChoice<T> {
    return v.choiceType === ChoiceType.SelectOneOf;
}

export function isDistributePointsChoice<T extends ChargenOption>(v: Choice<T>): v is DistributePointsChoice<T> {
    return v.choiceType === ChoiceType.DistributePoints;
}

export function isMatchMultipleChoice<T extends ChargenOption>(v: Choice<T>): v is MatchMultipleChoice<T> {
    return v.choiceType === ChoiceType.MatchMultiple;
}
