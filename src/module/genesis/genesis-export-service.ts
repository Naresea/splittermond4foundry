import { GenesisSchema } from "./genesis";
import { PlayerCharacter } from "../models/actors/player-character";
import {
  PlayerData,
  PlayerDataService,
  RollInfo,
} from "../services/player-data-service";
import { ItemType } from "../models/item-type";
import { Kultur } from "../models/items/kultur";
import { Fertigkeit } from "../models/items/fertigkeit";
import { Meisterschaft } from "../models/items/meisterschaft";
import { Staerke } from "../models/items/staerke";
import { buildFokusString, Zauber } from "../models/items/zauber";
import { Resource } from "../models/items/resource";
import { Ruestung } from "../models/items/ruestung";
import { Schild } from "../models/items/schild";
import { Waffe } from "../models/items/waffe";
import { Gegenstand } from "../models/items/gegenstand";
import { Benutzbar } from "../models/items/benutzbar";
import { Mondzeichen } from "../models/items/mondzeichen";

type TargetActor = Actor<PlayerCharacter>;

const GENESIS_ATTRIBUTE_IDS: Record<string, string> = {
  AUS: "CHARISMA",
  BEW: "AGILITY",
  INT: "INTUITION",
  KON: "CONSTITUTION",
  MYS: "MYSTIC",
  STR: "STRENGTH",
  VER: "MIND",
  WIL: "WILLPOWER",
  SPL: "SPLINTER",
  GK: "SIZE",
  GSW: "SPEED",
  INI: "INITIATIVE",
  LP: "LIFE",
  FO: "FOCUS",
  VTD: "DEFENSE",
  SR: "DAMAGE_REDUCTION",
  GW: "MINDRESIST",
  KW: "BODYRESIST",
};

export class GenesisExportService {
  public static exportToGenesis(actor: TargetActor): void {
    const filename = `fvtt-${actor.entity}-${actor.name.replace(
      /\s/g,
      "_"
    )}.json`;
    const data = GenesisExportService.mapToGenesisJson(actor);
    saveDataToFile(JSON.stringify(data), "text/json", filename);
  }

  private static mapToGenesisJson(
    actor: TargetActor
  ): GenesisSchema | undefined {
    const data: GenesisSchema = {};
    const playerData: PlayerData = PlayerDataService.getPlayerData(actor);
    GenesisExportService.exportBiography(actor, playerData, data);
    GenesisExportService.exportAttributes(actor, playerData, data);
    GenesisExportService.exportFertigkeiten(actor, playerData, data);
    GenesisExportService.exportStaerken(actor, playerData, data);
    GenesisExportService.exportZauber(actor, playerData, data);
    GenesisExportService.exportResourcen(actor, playerData, data);
    GenesisExportService.exportRuestungen(actor, playerData, data);
    GenesisExportService.exportWaffen(actor, playerData, data);
    GenesisExportService.exportSchilde(actor, playerData, data);
    GenesisExportService.exportGegenstaende(actor, playerData, data);
    GenesisExportService.exportMondzeichen(actor, playerData, data);
    return data;
  }

  private static exportBiography(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.name = playerData.biography.name;
    data.gender = actor.data.data.geschlecht ?? null;
    data.hairColor = actor.data.data.haarfarbe ?? null;
    data.size = Number.isNumeric(actor.data.data.koerpergroesse)
      ? +actor.data.data.koerpergroesse
      : null;
    data.eyeColor = actor.data.data.augenfarbe;
    data.weight = Number.isNumeric(actor.data.data.gewicht)
      ? +actor.data.data.gewicht
      : null;
    data.furColor = actor.data.data.hautfarbe;
    data.birthplace = actor.data.data.geburtsort;
    data.investedExp = actor.data.data.erfahrungEingesetzt;
    data.freeExp =
      actor.data.data.erfahrungGesamt - actor.data.data.erfahrungEingesetzt;
    data.race = playerData.biography.rasse;
    data.education = playerData.biography.ausbildung;
    data.culture = playerData.biography.kultur;
    data.background = playerData.biography.abstammung;
    const cultureItem = actor.items.find((i) => i.type === ItemType.Kultur);
    data.cultureLores = (cultureItem as
      | Item<Kultur>
      | undefined)?.data.data.kulturkunde
      ?.split(",")
      .map((s) => s.trim());
    data.languages = (cultureItem as
      | Item<Kultur>
      | undefined)?.data.data.sprache
      ?.split(",")
      .map((s) => s.trim());
    data.weaknesses = actor.items
      .filter((i) => i.type === ItemType.Schwaeche)
      .map((i) => i.name);
  }

  private static exportAttributes(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    const attributes = Object.keys(playerData.attributes).map((shortName) => ({
      name: playerData.attributes[shortName].name,
      shortName: shortName === "STR" ? "STÄ" : (shortName as any),
      value: playerData.attributes[shortName].total,
      startValue: playerData.attributes[shortName].start,
      id: GENESIS_ATTRIBUTE_IDS[shortName],
    }));
    const derivedAttributes = Object.keys(playerData.derivedAttributes).map(
      (shortName) => ({
        name: playerData.derivedAttributes[shortName].name,
        shortName: shortName === "STR" ? "STÄ" : (shortName as any),
        value: playerData.derivedAttributes[shortName].total,
        startValue: playerData.derivedAttributes[shortName].start,
        id: GENESIS_ATTRIBUTE_IDS[shortName],
      })
    );
    data.attributes = [...attributes, ...derivedAttributes];
  }

  private static exportFertigkeiten(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.skills = [
      ...playerData.fertigkeiten.tableData,
      ...playerData.kampfFertigkeiten.tableData,
      ...playerData.magieFertigkeiten.tableData,
    ]
      .map((fertigkeit) => {
        const item: Item<Fertigkeit> | undefined = actor.getOwnedItem(
          fertigkeit.id
        ) as Item<Fertigkeit> | undefined;
        if (!item || item.type !== ItemType.Fertigkeit) {
          return undefined;
        }
        return {
          name: item.name,
          attribute1: (item.data.data.attributEins === "STR"
            ? "STÄ"
            : item.data.data.attributEins) as any,
          attribute2: (item.data.data.attributZwei === "STR"
            ? "STÄ"
            : item.data.data.attributZwei) as any,
          value: fertigkeit.roll ?? 0,
          points: item.data.data.punkte,
          modifier: 0,
          masterships: playerData.meisterschaften.tableData
            .map((mastery) => {
              const masteryItem = actor.items.get(mastery.id) as
                | Item<Meisterschaft>
                | undefined;
              if (!masteryItem || masteryItem.type !== ItemType.Meisterschaft) {
                return undefined;
              }
              if (masteryItem.data.data.fertigkeit !== item.name) {
                return undefined;
              }
              return {
                name: masteryItem.name,
                level: masteryItem.data.data.schwelle,
                shortDescription: "",
                longDescription: masteryItem.data.data.beschreibung,
                page: `${masteryItem.data.data.regelwerk} ${masteryItem.data.data.seite}`,
              };
            })
            .filter((m) => m != null),
        };
      })
      .filter((v) => v != null);
  }

  private static exportStaerken(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.powers = actor.items
      .filter((i) => i.type === ItemType.Staerke)
      .map((i: Item<Staerke>) => ({
        name: i.name,
        count: i.data.data.level,
        shortDescription: "",
        longDescription: i.data.data.beschreibung,
        page: `${i.data.data.regelwerk} ${i.data.data.seite}`,
      }));
  }

  private static exportZauber(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.spells = playerData.zauber.tableData
      .map((zauber) => {
        const item = actor.items.get(zauber.id) as Item<Zauber> | undefined;
        if (!item || item.type !== ItemType.Zauber) {
          return undefined;
        }
        return {
          name: item.name,
          value: zauber.roll,
          school: item.data.data.fertigkeit,
          schoolGrade: item.data.data.grad,
          difficulty: item.data.data.schwierigkeitString,
          focus: buildFokusString(item.data.data),
          castDuration: item.data.data.zauberdauerString,
          castRange: item.data.data.reichweiteString,
          spellDuration: item.data.data.wirkungsdauerString,
          enhancement: item.data.data.verstaerkung,
          longDescription: item.data.data.beschreibung,
          page: `${item.data.data.regelwerk} ${item.data.data.seite}`,
        };
      })
      .filter((z) => z != null);
  }

  private static exportResourcen(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.resources = actor.items
      .filter((i) => i.type === ItemType.Resource)
      .map((i: Item<Resource>) => ({
        name: i.name,
        value: i.data.data.punkte,
        description: i.data.data.beschreibung,
      }));
  }

  private static exportRuestungen(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.armors = playerData.ruestungen.tableData
      .map((ruestung) => {
        const item = actor.items.get(ruestung.id) as Item<Ruestung | undefined>;
        if (!item || item.type !== ItemType.Ruestung) {
          return undefined;
        }
        return {
          name: item.name,
          defense: item.data.data.VTD,
          handicap: item.data.data.BEH,
          damageReduction: item.data.data.SR,
          tickMalus: item.data.data.tickPlus,
          features: item.data.data.merkmale
            .split(",")
            .map((s) => s.trim())
            .map((featName) => ({
              name: featName,
            })),
        };
      })
      .filter((v) => v != null);
  }

  private static exportSchilde(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.shields = playerData.schilde.tableData
      .map((schild) => {
        const item = actor.items.get(schild.id) as Item<Schild | undefined>;
        if (!item || item.type !== ItemType.Schild) {
          return undefined;
        }
        return {
          name: item.name,
          activeDefenseValue: schild.roll,
          skill: item.data.data.fertigkeit,
          attack: schild.roll,
          damage: item.data.data.schaden,
          defensePlus: item.data.data.VTD,
          handicap: item.data.data.BEH,
          tickMalus: item.data.data.tickPlus,
          features: item.data.data.merkmale
            .split(",")
            .map((s) => s.trim())
            .map((featName) => ({
              name: featName,
            })),
        };
      })
      .filter((v) => v != null);
  }

  private static exportWaffen(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.meleeWeapons = playerData.waffen.tableData
      .map((waffe) => {
        const item = actor.items.get(waffe.id) as Item<Waffe | undefined>;
        if (
          !item ||
          item.type !== ItemType.Waffe ||
          item.data.data.reichweite
        ) {
          return undefined;
        }
        return {
          name: item.name,
          skill: item.data.data.fertigkeit,
          attribute1: item.data.data.attribute as any,
          attribute2: item.data.data.attributeSecondary as any,
          value: waffe.roll,
          damage: item.data.data.schaden,
          weaponSpeed: item.data.data.ticks,
          calculateSpeed: (JSON.parse(waffe.rollInfo) as RollInfo).ticks,
          features: item.data.data.merkmale
            .split(",")
            .map((s) => s.trim())
            .map((featName) => ({
              name: featName,
            })),
        };
      })
      .filter((v) => v != null);

    data.longRangeWeapons = playerData.waffen.tableData
      .map((waffe) => {
        const item = actor.items.get(waffe.id) as Item<Waffe | undefined>;
        if (
          !item ||
          item.type !== ItemType.Waffe ||
          !item.data.data.reichweite
        ) {
          return undefined;
        }
        return {
          name: item.name,
          skill: item.data.data.fertigkeit,
          attribute1: item.data.data.attribute as any,
          attribute2: item.data.data.attributeSecondary as any,
          value: waffe.roll,
          damage: item.data.data.schaden,
          weaponSpeed: item.data.data.ticks,
          calculateSpeed: (JSON.parse(waffe.rollInfo) as RollInfo).ticks,
          range: item.data.data.reichweite,
          features: item.data.data.merkmale
            .split(",")
            .map((s) => s.trim())
            .map((featName) => ({
              name: featName,
            })),
        };
      })
      .filter((v) => v != null);
  }

  private static exportGegenstaende(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ): void {
    data.items = [
      ...playerData.benutzbares.tableData,
      ...playerData.sonstiges.tableData,
    ]
      .map((gegenstand) => {
        const item = actor.items.get(gegenstand.id) as
          | Item<Gegenstand | Benutzbar>
          | undefined;
        if (
          !item ||
          ![ItemType.Benutzbar, ItemType.Gegenstand].includes(item.type as any)
        ) {
          return undefined;
        }
        return {
          name: item.name,
          count: item.data.data.anzahl,
        };
      })
      .filter((v) => v != null);
  }

  private static exportMondzeichen(
    actor: TargetActor,
    playerData: PlayerData,
    data: GenesisSchema
  ) {
    const moonsignItem = actor.items.find(
      (i) => i.type === ItemType.Mondzeichen
    ) as Item<Mondzeichen> | undefined;
    if (!moonsignItem) {
      return;
    }
    data.moonSign = {
      name: moonsignItem.name,
      description: moonsignItem.data.data.beschreibung,
    };
  }
}
