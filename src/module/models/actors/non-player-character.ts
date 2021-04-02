import { Hp } from "./hp";
import { Fokus } from "./fokus";
import { Splittertraeger } from "./splittertraeger";
import { Attributes } from "./attributes";
import { DerivedAttributes } from "./derived-attributes";

export interface NonPlayerCharacter
  extends Hp,
    Fokus,
    Splittertraeger,
    Attributes,
    DerivedAttributes {
  monstergrad: string;
  kampfweise: string;
  lore: string;
  beute: string;
  typus: string;
}
