import { ATTRIBUTES, Attributes } from "../models/actors/attributes";
import {
  DERIVED_ATTRIBUTES,
  DerivedAttributes,
} from "../models/actors/derived-attributes";
import { Modifiers, ModifierService } from "./modifier-service";
import { Modifier, ModifierType } from "../models/items/modifier";
import { ItemType } from "../models/item-type";
import { Fertigkeit } from "../models/items/fertigkeit";
import { Waffe } from "../models/items/waffe";
import { Schild } from "../models/items/schild";
import { PlayerDataService } from "./player-data-service";
import { ActorType } from "../models/actor-type";
import { PlayerCharacter } from "../models/actors/player-character";
import { NonPlayerCharacter } from "../models/actors/non-player-character";
import { Zustand } from "../models/items/zustand";

export interface CalculationResult {
  total: number;
  explanation: string;
}

export class CalculationService {
  public static readonly WOUND_MODIFIER_ID =
    "splittermond.woundmodifier.statename";

  public static getInitiative(actor: Actor): number {
    if (actor.data.type === ActorType.PlayerCharacter) {
      const data = PlayerDataService.getPlayerData(
        actor as Actor<PlayerCharacter>
      );
      return data.derivedAttributes.INI.total;
    } else {
      const modifiers = ModifierService.getModifiers(actor);
      const iniMod = ModifierService.totalMod(modifiers, "INI", {
        modType: ModifierType.Attribute,
      });
      return ((actor as Actor<NonPlayerCharacter>).data.data.INI ?? 0) + iniMod;
    }
  }

  public static getAttributeValue(
    actor: Actor,
    attribute: keyof Attributes | keyof DerivedAttributes,
    mods: Modifiers
  ): CalculationResult {
    if (
      !ATTRIBUTES.includes(attribute as any) &&
      !DERIVED_ATTRIBUTES.includes(attribute as any)
    ) {
      return {
        total: 0,
        explanation: "No attribute",
      };
    }

    const startValue = actor.data.data[attribute] ?? 0;
    const increasedValue = actor.data.data["inc" + attribute] ?? 0;
    const modifierValue =
      ModifierService.totalMod(mods, attribute, {
        modType: ModifierType.Attribute,
      }) ?? 0;
    const total = startValue + increasedValue + modifierValue;
    return {
      total,
      explanation: `Start ${startValue} + Erhöht ${increasedValue} + Mod ${modifierValue}`,
    };
  }

  public static getFertigkeitsValue(
    actor: Actor,
    fertigkeit: string,
    mods: Modifiers
  ): CalculationResult {
    const fertigkeitItem: Item<Fertigkeit> | undefined = actor.items.find(
      (item) => item.type === ItemType.Fertigkeit && item.name === fertigkeit
    ) as Item<Fertigkeit> | undefined;

    if (!fertigkeitItem) {
      return {
        total: 0,
        explanation: "Keine Fertigkeit",
      };
    }

    const attrEins = CalculationService.getAttributeValue(
      actor,
      fertigkeitItem.data.data.attributEins as keyof Attributes,
      mods
    ).total;
    const attrZwei = CalculationService.getAttributeValue(
      actor,
      fertigkeitItem.data.data.attributZwei as keyof Attributes,
      mods
    ).total;
    const mod = ModifierService.totalMod(mods, fertigkeit, {
      modType: ModifierType.Fertigkeit,
    });

    const total =
      attrEins +
      attrZwei +
      mod +
      fertigkeitItem.data.data.punkte +
      fertigkeitItem.data.data.mod;
    return {
      total,
      explanation: `${fertigkeitItem.data.data.attributEins} ${attrEins} + ${fertigkeitItem.data.data.attributZwei} ${attrZwei} + ${fertigkeitItem.name} ${fertigkeitItem.data.data.punkte} + Mod ${fertigkeitItem.data.data.mod}`,
    };
  }

  public static getWaffeOrSchildValue(
    actor: Actor,
    waffe: Waffe | Schild,
    mods: Modifiers,
    name?: string
  ): CalculationResult {
    const fertigkeitItem: Item<Fertigkeit> | undefined = actor.items.find(
      (item) =>
        item.type === ItemType.Fertigkeit && item.name === waffe.fertigkeit
    ) as Item<Fertigkeit> | undefined;

    const attrEins = CalculationService.getAttributeValue(
      actor,
      waffe.attribute as keyof Attributes,
      mods
    ).total;
    const attrZwei = CalculationService.getAttributeValue(
      actor,
      waffe.attributeSecondary as keyof Attributes,
      mods
    ).total;

    let total = attrEins + attrZwei + waffe.mod;
    let explanation = `Waffe ${name ? `(${name})` : ""} ${waffe.mod} + ${
      waffe.attribute
    } ${attrEins} + ${waffe.attributeSecondary} ${attrZwei}`;

    if (!fertigkeitItem) {
      return {
        total,
        explanation,
      };
    }

    const fertigkeitVal =
      fertigkeitItem.data.data.punkte + fertigkeitItem.data.data.mod;
    const fertigkeitMod = ModifierService.totalMod(mods, fertigkeitItem.name, {
      modType: ModifierType.Fertigkeit,
    });

    explanation += ` + ${waffe.fertigkeit} ${fertigkeitVal + fertigkeitMod}`;
    total += fertigkeitVal + fertigkeitMod;

    return {
      total,
      explanation,
    };
  }

  public static async updateWoundModifier(
    actor: Actor<PlayerCharacter | NonPlayerCharacter>
  ): Promise<void> {
    const modName = game.i18n.localize(CalculationService.WOUND_MODIFIER_ID);
    const internalId = CalculationService.WOUND_MODIFIER_ID;
    const modifiers = ModifierService.getModifiers(actor);

    // Only "verzehrt" counts towards wound modifiers
    const healthVerzehrt = actor.data.data.healthVerzehrt;
    let hpPerWoundLevel = actor.data.data.LP;
    if (actor.data.type === "PlayerCharacter") {
      const attributes = PlayerDataService.getAttributes(actor, modifiers);
      const derivedAttributes = PlayerDataService.getDerivedAttributes(
        actor,
        modifiers,
        attributes
      );
      hpPerWoundLevel = derivedAttributes.LP.total;
    }

    const numWoundLevels =
      actor.data.data.woundLevel.max +
      ModifierService.totalMod(modifiers, null, {
        modType: ModifierType.WoundLevels,
      });

    const lostHpLevels = Math.max(
      0,
      Math.min(
        numWoundLevels + 1,
        Math.floor((healthVerzehrt - 1) / hpPerWoundLevel)
      )
    );
    const modifierLists =
      numWoundLevels <= 1
        ? [
            { name: "Unverletzt", mod: 0 },
            { name: "Sterbend", mod: -8 },
            { name: "Tod", mod: -8 },
          ]
        : numWoundLevels <= 3
        ? [
            { name: "Unverletzt", mod: 0 },
            { name: "Verletzt", mod: -2 },
            { name: "Todgeweiht", mod: -8 },
            { name: "Sterbend", mod: -8 },
            { name: "Tod", mod: -8 },
          ]
        : [
            { name: "Unverletzt", mod: 0 },
            { name: "Angeschlagen", mod: -1 },
            { name: "Verletzt", mod: -2 },
            { name: "SchwerVerletzt", mod: -4 },
            { name: "Todgeweiht", mod: -8 },
            { name: "Sterbend", mod: -8 },
            { name: "Tod", mod: -8 },
          ];

    const modifier = modifierLists[lostHpLevels];

    const affectedSkills = actor.items
      .filter((i) => i.type === ItemType.Fertigkeit)
      .map((i: Item<Fertigkeit>) => i.name);
    const skillModifiers = affectedSkills.map((skillName) => ({
      type: ModifierType.Fertigkeit,
      target: skillName,
      value: modifier?.mod ?? 0,
    }));
    const initMod = {
      type: ModifierType.Attribute,
      target: "INI",
      value: Math.abs(modifier?.mod ?? 0),
    };
    const gwsMod = {
      type: ModifierType.Attribute,
      target: "GSW",
      value: modifier?.mod ?? 0,
    };
    const zustandModifiers = [...skillModifiers, initMod, gwsMod];

    const ids = actor.items
      .filter(
        (i) =>
          i.type === ItemType.Zustand &&
          (i as Item<Zustand>).data.data.internalId === internalId
      )
      .map((i) => i._id);
    await actor.deleteEmbeddedEntity("OwnedItem", ids);

    await actor.createOwnedItem({
      type: ItemType.Zustand,
      name: modName,
      data: {
        modifier: zustandModifiers,
        beschreibung: game.i18n.localize(
          `splittermond.woundmodifier.${modifier.name}`
        ),
        regelwerk: "GRW",
        internalId: internalId,
        seite: 172,
      },
    });
  }

  public static fromEKVString(
    ekvString: string
  ): { erschoepft: number; kanalisiert: number; verzehrt: number } {
    const kanalisiertMatch = ekvString.match(/[Kk]\d+/);
    const kanalisiert = kanalisiertMatch
      ? +kanalisiertMatch[0].replace(/[Kk]/, "")
      : 0;

    const verzehrtMatch = ekvString.match(/[Vv]\d+/);
    const verzehrt = verzehrtMatch ? +verzehrtMatch[0].replace(/[Vv]/, "") : 0;

    const erschoepftMatch = ekvString.match(/\d+/);
    const erschoepft = erschoepftMatch ? +erschoepftMatch[0] : 0;
    return {
      erschoepft,
      kanalisiert,
      verzehrt,
    };
  }

  public static toEKVString(
    erschoepft: number,
    kanalisiert: number,
    verzehrt: number
  ): string {
    return `${erschoepft}K${kanalisiert}V${verzehrt}`;
  }
}
