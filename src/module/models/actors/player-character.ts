import {Attributes, AttributesStartValue} from './attributes';
import {Fokus} from './fokus';
import {Hp} from './hp';
import {Splittertraeger} from './splittertraeger';
import {DerivedAttributes} from './derived-attributes';
import {Biography} from './biography';
import {Vermoegen} from './vermoegen';

export interface PlayerCharacter extends Hp, Fokus, Splittertraeger, Attributes, DerivedAttributes, AttributesStartValue, Biography, Vermoegen {
    heldengrad: number;
    erfahrungGesamt: number;
    erfahrungEingesetzt: number;
    erfahrungNaechsterHeldengrad: number;
    atemholenBenutzt: boolean;
}
