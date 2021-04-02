import { PlayerCharacter } from "../models/actors/player-character";
import { ATTRIBUTES, Attributes } from "../models/actors/attributes";
import { DerivedAttributes } from "../models/actors/derived-attributes";
import { Modifiers, ModifierService } from "./modifier-service";
import { ItemType } from "../models/item-type";
import { ModifierType } from "../models/items/modifier";
import { Fertigkeit } from "../models/items/fertigkeit";
import { CalculationService } from "./calculation-service";
import { Waffe } from "../models/items/waffe";
import { Schild } from "../models/items/schild";
import { Ruestung } from "../models/items/ruestung";
import { Benutzbar } from "../models/items/benutzbar";
import { Gegenstand } from "../models/items/gegenstand";
import { buildFokusString, Zauber } from "../models/items/zauber";
import { Meisterschaft } from "../models/items/meisterschaft";
import { Mondzeichen } from "../models/items/mondzeichen";
import { Staerke } from "../models/items/staerke";
import { Schwaeche } from "../models/items/schwaeche";
import { Zustand } from "../models/items/zustand";
import { Merkmal } from "../models/items/merkmal";
import { Resource } from "../models/items/resource";

export interface RollInfo {
  name?: string;
  damage?: string;
  explanation?: string;
  ticks?: number;
  ticksExplanation?: string;
  fokusCost?: number;
  maneuver?: {
    egCost?: number;
    effekt?: number;
  };
}

interface TableData {
  tableFields: Array<string>;
  tableData: Array<{
    fields: Array<string>;
    id: string;
    roll?: number;
    rollInfo?: string;
    equipped?: boolean;
  }>;
}

interface Biography {
  name: string;
  rasse: string;
  abstammung: string;
  kultur: string;
  ausbildung: string;
}

interface AttributeVal {
  name: string;
  start: number;
  increased: number;
  total: number;
  modifier: number;
}

interface ViewSpecificData {
  health: {
    current: number;
    max: number;
    asString: string;
  };
  fokus: {
    current: number;
    max: number;
    asString: string;
  };
}

export type PlayerData = Record<string, unknown> & {
  biography: Biography;
  attributes: Record<keyof Attributes, AttributeVal>;
  derivedAttributes: Record<keyof DerivedAttributes, AttributeVal>;
  fertigkeiten: TableData;
  waffen: TableData;
  ruestungen: TableData;
  schilde: TableData;
  benutzbares: TableData;
  sonstiges: TableData;
  zauber: TableData;
  meisterschaften: TableData;
  staerken: TableData;
  schwaechen: TableData;
  resourcen: TableData;
  merkmale: TableData;
  zustaende: TableData;
  mondzeichen: Partial<Mondzeichen> & { img?: string; name?: string };
  view: ViewSpecificData;
};

export class PlayerDataService {
  public static getPlayerData(actor: Actor<PlayerCharacter>): PlayerData {
    const modifiers = ModifierService.getModifiers(actor);
    const biography = PlayerDataService.getBiography(actor);
    const attributes = PlayerDataService.getAttributes(actor, modifiers);
    const derivedAttributes = PlayerDataService.getDerivedAttributes(
      actor,
      modifiers,
      attributes
    );
    const fertigkeiten = PlayerDataService.getFertigkeiten(actor, modifiers);
    const waffen = PlayerDataService.getWaffen(actor, modifiers);
    const ruestungen = PlayerDataService.getRuestungen(actor, modifiers);
    const schilde = PlayerDataService.getSchilde(actor, modifiers);
    const benutzbares = PlayerDataService.getBenutzbares(actor, modifiers);
    const sonstiges = PlayerDataService.getSonstiges(actor, modifiers);
    const zauber = PlayerDataService.getZauber(actor, modifiers);
    const view = PlayerDataService.getViewSpecificData(
      actor,
      modifiers,
      attributes,
      derivedAttributes
    );
    const meisterschaften = PlayerDataService.getMeisterschaften(
      actor,
      modifiers
    );
    const staerken = PlayerDataService.getStaerken(actor, modifiers);
    const schwaechen = PlayerDataService.getSchwaechen(actor, modifiers);
    const zustaende = PlayerDataService.getZustaende(actor, modifiers);
    const merkmale = PlayerDataService.getMerkmale(actor, modifiers);
    const resourcen = PlayerDataService.getResourcen(actor, modifiers);
    const mondzeichen = PlayerDataService.getMondzeichen(actor, modifiers);

    return {
      ...actor.data.data,
      biography,
      attributes,
      derivedAttributes,
      fertigkeiten,
      waffen,
      ruestungen,
      schilde,
      benutzbares,
      sonstiges,
      zauber,
      view,
      meisterschaften,
      staerken,
      schwaechen,
      merkmale,
      zustaende,
      resourcen,
      mondzeichen,
    };
  }

  private static getBiography(actor: Actor): Biography {
    const rasse = actor.items.find((i) => i.type === ItemType.Rasse);
    const abstammung = actor.items.find((i) => i.type === ItemType.Abstammung);
    const kultur = actor.items.find((i) => i.type === ItemType.Kultur);
    const ausbildung = actor.items.find((i) => i.type === ItemType.Ausbildung);
    return {
      name: actor.name,
      rasse: rasse?.name ?? "",
      abstammung: abstammung?.name ?? "",
      kultur: kultur?.name ?? "",
      ausbildung: ausbildung?.name ?? "",
    };
  }

  private static getAttributes(
    actor: Actor,
    mods: Modifiers
  ): Record<keyof Attributes, AttributeVal> {
    return ATTRIBUTES.reduce(
      (
        accu: Record<keyof Attributes, AttributeVal>,
        attr: keyof Attributes
      ) => {
        const modifier = ModifierService.totalMod(mods, attr, {
          modType: ModifierType.Attribute,
        });
        const start = actor.data.data[attr as any] ?? 0;
        const increased = actor.data.data[("inc" + attr) as any] ?? 0;
        const total = start + increased + modifier;
        accu[attr] = {
          name: `attribute.${attr}`,
          start,
          increased,
          total,
          modifier,
        };
        return accu;
      },
      {} as Record<keyof Attributes, AttributeVal>
    );
  }

  private static getDerivedAttributes(
    actor: Actor,
    mods: Modifiers,
    attributes: Record<keyof Attributes, AttributeVal>
  ): Record<keyof DerivedAttributes, AttributeVal> {
    const baseValues = {
      GSW: attributes.GK.total + attributes.BEW.total,
      INI: 10 - attributes.INT.total,
      LP: attributes.GK.total + attributes.KON.total,
      FO: 2 * (attributes.MYS.total + attributes.WIL.total),
      VTD: 12 + attributes.BEW.total + attributes.STR.total,
      GW: 12 + attributes.VER.total + attributes.WIL.total,
      KW: 12 + attributes.KON.total + attributes.WIL.total,
    };

    return Object.keys(baseValues).reduce(
      (
        accu: Record<keyof DerivedAttributes, AttributeVal>,
        attr: keyof DerivedAttributes
      ) => {
        const modifier = ModifierService.totalMod(mods, attr, {
          modType: ModifierType.Attribute,
        });
        const start = baseValues[attr] ?? 0;
        const total = start + modifier;
        accu[attr] = {
          name: `attribute.${attr}`,
          start,
          increased: 0,
          total,
          modifier,
        };
        return accu;
      },
      {} as Record<keyof DerivedAttributes, AttributeVal>
    );
  }

  public static getFertigkeiten(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.fertigkeiten.name",
      "splittermond.fertigkeiten.wert",
      "splittermond.fertigkeiten.punkte",
      "splittermond.fertigkeiten.attributEins",
      "splittermond.fertigkeiten.attributZwei",
      "splittermond.fertigkeiten.modifier",
    ];

    const getFields = (fertigkeit: Item<Fertigkeit>) => {
      const roll = CalculationService.getFertigkeitsValue(
        actor,
        fertigkeit.name,
        mods
      );
      const fields = [
        fertigkeit.name,
        `${roll.total}`,
        `${fertigkeit.data.data.punkte}`,
        fertigkeit.data.data.attributEins,
        fertigkeit.data.data.attributZwei,
        `${fertigkeit.data.data.mod}`,
      ];
      return {
        fields,
        roll: roll.total,
        rollInfo: JSON.stringify({
          name: fertigkeit.name,
          explanation: roll.explanation,
        }),
      };
    };

    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Fertigkeit,
      tableFields,
      getFields
    );
  }

  public static getWaffen(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.inventar.waffen.name",
      "splittermond.inventar.waffen.wert",
      "splittermond.inventar.waffen.fertigkeit",
      "splittermond.inventar.waffen.wgs",
      "splittermond.inventar.waffen.schaden",
      "splittermond.inventar.waffen.merkmale",
    ];

    const getFields = (waffe: Item<Waffe>) => {
      const roll = CalculationService.getWaffeOrSchildValue(
        actor,
        waffe.data.data,
        mods,
        waffe.name
      );
      const tickPlus = ModifierService.totalMod(mods, null, {
        modType: ModifierType.TickPlus,
      });

      const fields = [
        `${waffe.name}`,
        `${roll.total}`,
        `${waffe.data.data.fertigkeit}`,
        `${waffe.data.data.ticks}`,
        `${waffe.data.data.schaden}`,
        `${waffe.data.data.merkmale}`,
      ];
      return {
        fields,
        roll: roll.total,
        rollInfo: JSON.stringify({
          explanation: roll.explanation,
          ticks: waffe.data.data.ticks + tickPlus,
          ticksExplanation: `WGS ${waffe.data.data.ticks} + Tick+ ${tickPlus}`,
          name: waffe.name,
          damage: waffe.data.data.schaden,
        }),
        equipped: waffe.data.data.isEquipped,
      };
    };

    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Waffe,
      tableFields,
      getFields
    );
  }

  private static getSchilde(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.inventar.schilde.name",
      "splittermond.inventar.schilde.wert",
      "splittermond.inventar.schilde.fertigkeit",
      "splittermond.inventar.schilde.vtd",
      "splittermond.inventar.schilde.merkmale",
    ];
    const getFields = (schild: Item<Schild>) => {
      const roll = CalculationService.getWaffeOrSchildValue(
        actor,
        schild.data.data,
        mods,
        schild.name
      );
      const fields = [
        `${schild.name}`,
        `${roll.total}`,
        `${schild.data.data.fertigkeit}`,
        `${schild.data.data.VTD}`,
        `${schild.data.data.merkmale}`,
      ];
      return {
        fields,
        roll: roll.total,
        rollInfo: JSON.stringify({
          explanation: roll.explanation,
          name: schild.name,
        }),
        equipped: schild.data.data.isEquipped,
      };
    };

    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Schild,
      tableFields,
      getFields
    );
  }

  private static getRuestungen(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.inventar.ruestungen.name",
      "splittermond.inventar.ruestungen.vtd",
      "splittermond.inventar.ruestungen.sr",
      "splittermond.inventar.ruestungen.beh",
      "splittermond.inventar.ruestungen.tick",
      "splittermond.inventar.ruestungen.merkmale",
    ];
    const getFields = (ruestung: Item<Ruestung>) => {
      const fields = [
        `${ruestung.name}`,
        `${ruestung.data.data.VTD}`,
        `${ruestung.data.data.SR}`,
        `${ruestung.data.data.BEH}`,
        `${ruestung.data.data.tickPlus}`,
        `${ruestung.data.data.merkmale}`,
      ];
      return {
        fields,
        equipped: ruestung.data.data.isEquipped,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Ruestung,
      tableFields,
      getFields
    );
  }

  private static getBenutzbares(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.inventar.benutzbares.name",
      "splittermond.inventar.benutzbares.ticks",
      "splittermond.inventar.benutzbares.begrenzt",
      "splittermond.inventar.benutzbares.anzahl",
    ];
    const getFields = (benutzbar: Item<Benutzbar>) => {
      const fields = [
        `${benutzbar.name}`,
        `${benutzbar.data.data.ticks}`,
        `${benutzbar.data.data.wirdVerbraucht}`,
        `${benutzbar.data.data.anzahl}`,
      ];
      return {
        fields,
        rollInfo: JSON.stringify({
          ticks: benutzbar.data.data.ticks,
          name: benutzbar.name,
        }),
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Benutzbar,
      tableFields,
      getFields
    );
  }

  private static getSonstiges(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.inventar.sonstiges.name",
      "splittermond.inventar.sonstiges.wert",
      "splittermond.inventar.sonstiges.gewicht",
      "splittermond.inventar.sonstiges.anzahl",
    ];
    const getFields = (gegenstand: Item<Gegenstand>) => {
      const fields = [
        `${gegenstand.name}`,
        `${gegenstand.data.data.wertInTellaren}`,
        `${gegenstand.data.data.gewicht}`,
        `${gegenstand.data.data.anzahl}`,
      ];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Gegenstand,
      tableFields,
      getFields
    );
  }

  public static getZauber(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.zauber.name",
      "splittermond.zauber.schule",
      "splittermond.zauber.wert",
      "splittermond.zauber.schaden",
      "splittermond.zauber.schwierigkeit",
      "splittermond.zauber.fokus",
      "splittermond.zauber.zauberdauer",
      "splittermond.zauber.reichweite",
      "splittermond.zauber.wirkungsdauer",
      "splittermond.zauber.bereich",
      "splittermond.zauber.verstaerkung",
    ];
    const getFields = (zauber: Item<Zauber>) => {
      const roll = CalculationService.getFertigkeitsValue(
        actor,
        zauber.data.data.fertigkeit,
        mods
      );
      const fields = [
        `${zauber.name}`,
        `${zauber.data.data.fertigkeit}`,
        `${roll.total}`,
        `${zauber.data.data.schaden}`,
        `${zauber.data.data.schwierigkeitString}`,
        `${buildFokusString(zauber.data.data)}`,
        `${zauber.data.data.zauberdauerString}`,
        `${zauber.data.data.reichweiteString}`,
        `${zauber.data.data.wirkungsdauerString}`,
        `${zauber.data.data.bereichString}`,
        `${zauber.data.data.verstaerkung}`,
      ];
      return {
        fields,
        roll: roll.total,
        rollInfo: JSON.stringify({
          ticks: zauber.data.data.ticks,
          fokusCost: buildFokusString(zauber.data.data),
          name: zauber.name,
          explanation: roll.explanation,
          damage: zauber.data.data.schaden,
        }),
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Zauber,
      tableFields,
      getFields
    );
  }

  public static getMeisterschaften(actor: Actor, mods: Modifiers): TableData {
    const tableFields = [
      "splittermond.meisterschaft.name",
      "splittermond.meisterschaft.fertigkeit",
      "splittermond.meisterschaft.maneuver",
    ];

    const getFields = (ms: Item<Meisterschaft>) => {
      const fields = [
        ms.name,
        ms.data.data.fertigkeit,
        ms.data.data.maneuverEffekt,
      ];
      const isManeuver = ms.data.data.isManeuver;

      let roll = undefined;
      if (isManeuver) {
        const weapon: Item<Waffe> | undefined = ms.data.data.useActiveWeapon
          ? (actor.items.find(
              (i) =>
                i.type === ItemType.Waffe &&
                (i as Item<Waffe>).data.data.isEquipped
            ) as Item<Waffe> | undefined)
          : undefined;
        roll = !ms.data.data.useActiveWeapon
          ? CalculationService.getFertigkeitsValue(
              actor,
              ms.data.data.fertigkeit,
              mods
            )
          : weapon
          ? CalculationService.getWaffeOrSchildValue(
              actor,
              weapon.data.data,
              mods,
              weapon.name
            )
          : { total: 0, explanation: "Keine ausgerüstete Waffe." };
      }

      return {
        fields,
        roll: roll ? roll.total : undefined,
        rollInfo: roll
          ? JSON.stringify({
              name: ms.name,
              explanation: roll.explanation,
              maneuver: {
                egCost: ms.data.data.egCost,
                effekt: ms.data.data.maneuverEffekt,
              },
            })
          : undefined,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Meisterschaft,
      tableFields,
      getFields
    );
  }

  private static getStaerken(
    actor: Actor<PlayerCharacter>,
    mods: Modifiers
  ): TableData {
    const tableFields = ["splittermond.staerke.name"];
    const getFields = (ms: Item<Staerke>) => {
      const fields = [ms.name];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Staerke,
      tableFields,
      getFields
    );
  }

  private static getSchwaechen(
    actor: Actor<PlayerCharacter>,
    mods: Modifiers
  ): TableData {
    const tableFields = ["splittermond.schwaeche.name"];
    const getFields = (ms: Item<Schwaeche>) => {
      const fields = [ms.name];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Schwaeche,
      tableFields,
      getFields
    );
  }

  public static getZustaende(actor: Actor, mods: Modifiers): TableData {
    const tableFields = ["splittermond.zustand.name"];
    const getFields = (ms: Item<Zustand>) => {
      const fields = [ms.name];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Zustand,
      tableFields,
      getFields
    );
  }

  public static getMerkmale(actor: Actor, mods: Modifiers): TableData {
    const tableFields = ["splittermond.merkmal.name"];
    const getFields = (ms: Item<Merkmal>) => {
      const fields = [ms.name];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Merkmal,
      tableFields,
      getFields
    );
  }

  private static getResourcen(
    actor: Actor<PlayerCharacter>,
    mods: Modifiers
  ): TableData {
    const tableFields = [
      "splittermond.resource.name",
      "splittermond.resource.punkte",
    ];
    const getFields = (ms: Item<Resource>) => {
      const fields = [ms.name, `${ms.data.data.punkte}`];
      return {
        fields,
      };
    };
    return PlayerDataService.getTableData(
      actor,
      mods,
      ItemType.Resource,
      tableFields,
      getFields
    );
  }

  private static getMondzeichen(
    actor: Actor<PlayerCharacter>,
    mods: Modifiers
  ): Partial<Mondzeichen> & { img?: string; name?: string } {
    const mondzeichen = actor.items.find(
      (i) => i.type === ItemType.Mondzeichen
    );
    return {
      ...(mondzeichen?.data.data ?? {}),
      name: mondzeichen?.name,
      img: mondzeichen?.img,
    };
  }

  private static getTableData(
    actor: Actor,
    modifiers: Modifiers,
    type: ItemType,
    tableFields: Array<string>,
    getFields: (item: Item<any>) => { fields: Array<string>; roll?: number }
  ): TableData {
    const tableData = actor.items
      .filter((i) => i.type === type)
      .map((item: Item<Fertigkeit>) => ({
        id: item.id,
        ...getFields(item),
      }));
    return {
      tableFields,
      tableData,
    };
  }

  private static getViewSpecificData(
    actor: Actor<PlayerCharacter>,
    modifiers: Modifiers,
    attributes: Record<keyof Attributes, AttributeVal>,
    derivedAttributes: Record<keyof DerivedAttributes, AttributeVal>
  ): ViewSpecificData {
    const woundLevelModifier = ModifierService.totalMod(modifiers, null, {
      modType: ModifierType.WoundLevels,
    });
    const maxHealth = derivedAttributes.LP.total * (5 + woundLevelModifier);
    const health = {
      current:
        maxHealth -
        actor.data.data.healthErschoepft -
        actor.data.data.healthKanalisiert -
        actor.data.data.healthVerzehrt,
      max: maxHealth,
      asString: CalculationService.toEKVString(
        actor.data.data.healthErschoepft,
        actor.data.data.healthKanalisiert,
        actor.data.data.healthVerzehrt
      ),
    };

    const maxFokus = derivedAttributes.FO.total;
    const fokus = {
      current:
        maxFokus -
        actor.data.data.fokusErschoepft -
        actor.data.data.fokusKanalisiert -
        actor.data.data.fokusVerzehrt,
      max: derivedAttributes.FO.total,
      asString: CalculationService.toEKVString(
        actor.data.data.fokusErschoepft,
        actor.data.data.fokusKanalisiert,
        actor.data.data.fokusVerzehrt
      ),
    };
    return {
      health,
      fokus,
    };
  }
}
