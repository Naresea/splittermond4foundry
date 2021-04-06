import { GenesisSchema, ItemFeature } from "./genesis";
import { ItemType } from "../models/item-type";
import { PlayerCharacter } from "../models/actors/player-character";
import { Rasse } from "../models/items/rasse";
import { ModifierType } from "../models/items/modifier";
import { Abstammung } from "../models/items/abstammung";
import { Kultur } from "../models/items/kultur";
import { Ausbildung } from "../models/items/ausbildung";
import { Fertigkeit, FertigkeitType } from "../models/items/fertigkeit";
import { Meisterschaft } from "../models/items/meisterschaft";
import { Staerke } from "../models/items/staerke";
import { Schwaeche } from "../models/items/schwaeche";
import { Resource } from "../models/items/resource";
import { Gegenstand } from "../models/items/gegenstand";
import { Zauber } from "../models/items/zauber";
import { CalculationService } from "../services/calculation-service";
import { Waffe } from "../models/items/waffe";
import { Schild } from "../models/items/schild";
import { Ruestung } from "../models/items/ruestung";
import { Mondzeichen } from "../models/items/mondzeichen";

interface CreateItem<T> {
  name: string;
  type: ItemType;
  data: Partial<T>;
}

type TargetActor = Actor<PlayerCharacter>;

const KNOWN_COMBAT_SKILL_NAMES = [
  "Handgemenge",
  "Hiebwaffen",
  "Kettenwaffen",
  "Klingenwaffen",
  "Schusswaffen",
  "Stangenwaffen",
  "Wurfwaffen",
];

const KNOWN_MAGIC_SKILL_NAMES = [
  "Bannmagie",
  "Beherrschungsmagie",
  "Bewegungsmagie",
  "Erkenntnismagie",
  "Felsmagie",
  "Feuermagie",
  "Heilungsmagie",
  "Illusionsmagie",
  "Kampfmagie",
  "Lichtmagie",
  "Naturmagie",
  "Schattenmagie",
  "Schicksalsmagie",
  "Schutzmagie",
  "Stärkungsmagie",
  "Todesmagie",
  "Verwandlungsmagie",
  "Wassermagie",
  "Windmagie",
];

export class GenesisImportService {
  public static async importFromGenesis(
    targetActor: TargetActor,
    jsonString: string
  ): Promise<Entity> {
    const genesisData: GenesisSchema = JSON.parse(jsonString);
    await GenesisImportService.importActorData(targetActor, genesisData);
    await GenesisImportService.importItemData(targetActor, genesisData);
    await CalculationService.updateWoundModifier(targetActor);
    new Dialog({
      title: game.i18n.localize("splittermond.import-dialog.title"),
      content: `<p style="padding: 10px">${game.i18n.localize(
        "splittermond.import-dialog.content"
      )}</p>`,
      buttons: {
        ok: {
          icon: '<i class="fas fa-check"></i>',
          label: "Ok",
        },
      },
    }).render(true);
    return targetActor;
  }

  private static async importActorData(
    targetActor: TargetActor,
    genesisData: GenesisSchema
  ): Promise<void> {
    const data = targetActor.data.data;
    GenesisImportService.importBiography(targetActor, genesisData);
    if (genesisData.attributes) {
      genesisData.attributes.forEach((attr) => {
        switch (attr.shortName) {
          case "AUS":
            data.AUS = attr.startValue;
            data.incAUS = attr.value - attr.startValue;
            break;
          case "BEW":
            data.BEW = attr.startValue;
            data.incBEW = attr.value - attr.startValue;
            break;
          case "INT":
            data.INT = attr.startValue;
            data.incINT = attr.value - attr.startValue;
            break;
          case "KON":
            data.KON = attr.startValue;
            data.incKON = attr.value - attr.startValue;
            break;
          case "MYS":
            data.MYS = attr.startValue;
            data.incMYS = attr.value - attr.startValue;
            break;
          case "STÄ":
            data.STR = attr.startValue;
            data.incSTR = attr.value - attr.startValue;
            break;
          case "VER":
            data.VER = attr.startValue;
            data.incVER = attr.value - attr.startValue;
            break;
          case "WIL":
            data.WIL = attr.startValue;
            data.incWIL = attr.value - attr.startValue;
            break;
          case "SPL":
            data.splitterpunkte.value = attr.value;
            data.splitterpunkte.max = attr.value;
            data.splitterpunkte.min = 0;
            break;
        }
      });
    }
    await targetActor.update({
      _id: targetActor.id,
      name: targetActor.name,
      data: data,
    });
  }

  private static importBiography(
    targetActor: TargetActor,
    genesisData: GenesisSchema
  ): void {
    const data = targetActor.data.data;
    targetActor.data.name = genesisData.name ?? targetActor.name;
    data.geschlecht = genesisData.gender ?? "";
    data.haarfarbe = genesisData.hairColor ?? "";
    data.koerpergroesse = `${genesisData.size ?? ""}`;
    data.augenfarbe = genesisData.eyeColor ?? "";
    data.gewicht = `${genesisData.weight ?? ""}`;
    data.hautfarbe = genesisData.furColor ?? "";
    data.geburtsort = genesisData.birthplace ?? "";

    const xpUsed = genesisData.investedExp ?? 0;
    const xpFree = genesisData.freeExp ?? 0;

    data.erfahrungGesamt = xpFree + xpUsed;
    data.erfahrungEingesetzt = xpUsed;
    data.heldengrad =
      xpUsed < 100 ? 1 : xpUsed < 300 ? 2 : xpUsed < 600 ? 3 : 4;
  }

  private static async importItemData(
    targetActor: TargetActor,
    genesisData: GenesisSchema
  ): Promise<void> {
    const ids = targetActor.items.map((i) => i._id);
    await targetActor.deleteEmbeddedEntity("OwnedItem", ids);

    const race: CreateItem<Rasse> = GenesisImportService.getRasse(genesisData);
    const background: CreateItem<Abstammung> = GenesisImportService.getAbstammung(
      genesisData
    );
    const kultur: CreateItem<Kultur> = GenesisImportService.getKultur(
      genesisData
    );
    const ausbildung: CreateItem<Ausbildung> = GenesisImportService.getAusbildung(
      genesisData
    );
    const fertigkeiten: Array<
      CreateItem<Fertigkeit>
    > = GenesisImportService.getFertigkeiten(genesisData);
    const meisterschaften: Array<
      CreateItem<Meisterschaft>
    > = GenesisImportService.getMeisterschaften(genesisData);
    const schwaechen: Array<
      CreateItem<Schwaeche>
    > = GenesisImportService.getSchwaechen(genesisData);
    const staerken: Array<
      CreateItem<Staerke>
    > = GenesisImportService.getStaerken(genesisData);
    const resourcen: Array<
      CreateItem<Resource>
    > = GenesisImportService.getResourcen(genesisData);
    const zauber: Array<CreateItem<Zauber>> = GenesisImportService.getZauber(
      genesisData
    );
    const gegenstaende: Array<
      CreateItem<Gegenstand>
    > = GenesisImportService.getItems(genesisData);
    const waffen: Array<CreateItem<Waffe>> = GenesisImportService.getWaffen(
      genesisData
    );
    const schilde: Array<CreateItem<Schild>> = GenesisImportService.getSchilde(
      genesisData
    );
    const ruestungen: Array<
      CreateItem<Ruestung>
    > = GenesisImportService.getRuestungen(genesisData);
    const mondzeichen: CreateItem<Mondzeichen> = GenesisImportService.getMondzeichen(
      genesisData
    );

    await targetActor.createOwnedItem([
      race,
      background,
      kultur,
      ausbildung,
      ...fertigkeiten,
      ...meisterschaften,
      ...schwaechen,
      ...staerken,
      ...resourcen,
      ...zauber,
      ...gegenstaende,
      ...waffen,
      ...schilde,
      ...ruestungen,
      mondzeichen,
    ]);
  }

  private static getRasse(genesisData: GenesisSchema): CreateItem<Rasse> {
    const raceName = genesisData.race ?? "";
    const gk =
      genesisData.attributes.find((a) => a.shortName === "GK")?.value ?? 0;
    return {
      name: raceName,
      type: ItemType.Rasse,
      data: {
        modifier: [{ type: ModifierType.Attribute, target: "GK", value: gk }],
      },
    };
  }

  private static getAbstammung(
    genesisData: GenesisSchema
  ): CreateItem<Abstammung> {
    const name = genesisData.background ?? "";
    return {
      name,
      type: ItemType.Abstammung,
      data: {},
    };
  }

  private static getKultur(genesisData: GenesisSchema): CreateItem<Kultur> {
    const name = genesisData.culture ?? "";
    const lore = (genesisData.cultureLores ?? []).join(", ");
    const language = (genesisData.languages ?? []).join(", ");
    return {
      name,
      type: ItemType.Kultur,
      data: {
        sprache: language,
        kulturkunde: lore,
      },
    };
  }

  private static getAusbildung(
    genesisData: GenesisSchema
  ): CreateItem<Ausbildung> {
    const name = genesisData.education;
    return {
      name,
      type: ItemType.Ausbildung,
      data: {},
    };
  }

  private static getFertigkeiten(
    genesisData: GenesisSchema
  ): Array<CreateItem<Fertigkeit>> {
    if (!genesisData.skills) {
      return [];
    }
    return genesisData.skills.map((skill, idx) => ({
      name: skill.name ?? `Unnamed Skill ${idx}`,
      type: ItemType.Fertigkeit,
      data: {
        punkte: skill.points ?? 0,
        // do not import modifier: it will be applied automatically when the corresponding gear is equipped
        attributEins: GenesisImportService.getAttributeShortname(
          skill.attribute1
        ),
        attributZwei: GenesisImportService.getAttributeShortname(
          skill.attribute2
        ),
        type: KNOWN_COMBAT_SKILL_NAMES.includes(skill.name)
          ? FertigkeitType.Kampf
          : KNOWN_MAGIC_SKILL_NAMES.includes(skill.name)
          ? FertigkeitType.Magie
          : FertigkeitType.Allgemein,
      },
    }));
  }

  private static getAttributeShortname(name: string | undefined): string {
    if (!name) {
      return "";
    }
    switch (name) {
      case "STÄ":
        return "STR";
      default:
        return name;
    }
  }

  private static getMeisterschaften(
    genesisData: GenesisSchema
  ): Array<CreateItem<Meisterschaft>> {
    if (!genesisData.skills) {
      return [];
    }
    return genesisData.skills
      .map((skill, idx) =>
        skill.masterships.map((mastery) => ({
          name: mastery.name ?? "",
          type: ItemType.Meisterschaft,
          data: {
            schwelle: mastery.level ?? 0,
            fertigkeit: skill.name ?? `Unnamed Skill ${idx}`,
            beschreibung: `<p>${mastery.shortDescription ?? ""}</p><p>${
              mastery.longDescription ?? ""
            }</p>`,
            regelwerk: mastery.page ?? "",
          },
        }))
      )
      .reduce((accu, curr) => {
        accu.push(...curr);
        return accu;
      }, []);
  }

  private static getStaerken(
    genesisData: GenesisSchema
  ): Array<CreateItem<Staerke>> {
    if (!genesisData.powers) {
      return [];
    }
    return genesisData.powers.map((power, idx) => ({
      name: power.name ?? `Unnamed Strength ${idx}`,
      type: ItemType.Staerke,
      data: {
        beschreibung: `<p>${power.shortDescription ?? ""}</p><p>${
          power.longDescription ?? ""
        }</p>`,
        regelwerk: power.page ?? "",
        level: power.count,
      },
    }));
  }

  private static getSchwaechen(
    genesisData: GenesisSchema
  ): Array<CreateItem<Schwaeche>> {
    if (!genesisData.weaknesses) {
      return [];
    }
    return genesisData.weaknesses.map((w) => ({
      name: w,
      type: ItemType.Schwaeche,
      data: {},
    }));
  }

  private static getResourcen(
    genesisData: GenesisSchema
  ): Array<CreateItem<Resource>> {
    if (!genesisData.resources) {
      return [];
    }
    return genesisData.resources.map((res, idx) => ({
      name: res.name ?? `Unnamed Resource ${idx}`,
      type: ItemType.Resource,
      data: {
        beschreibung: `<p>${res.description ?? ""}</p>`,
        punkte: res.value ?? 0,
      },
    }));
  }

  private static getZauber(
    genesisData: GenesisSchema
  ): Array<CreateItem<Zauber>> {
    if (!genesisData.spells) {
      return [];
    }
    return genesisData.spells.map((spell, idx) => {
      const {
        erschoepft,
        verzehrt,
        kanalisiert,
      } = CalculationService.fromEKVString(spell.focus ?? "0");

      return {
        name: spell.name ?? `Unnamed Spell ${idx}`,
        type: ItemType.Zauber,
        data: {
          grad: spell.schoolGrade ?? 0,
          fertigkeit: spell.school ?? "",
          schwierigkeitString: spell.difficulty ?? "0",
          fokusErschoepft: erschoepft,
          fokusVerzehrt: verzehrt,
          fokusKanalisiert: kanalisiert,
          zauberdauerString: spell.castDuration ?? "",
          reichweiteString: spell.castRange ?? "",
          wirkungsdauerString: spell.spellDuration ?? "",
          bereichString: "",
          verstaerkung: spell.enhancement ?? "",
          beschreibung: `<p>${spell.longDescription}</p>`,
          regelwerk: spell.page ?? "",
          schaden: "",
        },
      };
    });
  }

  private static getItems(
    genesisData: GenesisSchema
  ): Array<CreateItem<Gegenstand>> {
    if (!genesisData.items) {
      return [];
    }
    return genesisData.items.map((item, idx) => ({
      name: item.name ?? `Unnamed Item ${idx}`,
      type: ItemType.Gegenstand,
      data: {
        wertInTellaren: 0,
        gewicht: 0,
        anzahl: item.count,
      },
    }));
  }

  private static getMerkmalString(feature: ItemFeature): string {
    if (feature.level < 1 || feature.name.match(/\d+$/)) {
      // level included in name
      return `${feature.name}`;
    }
    return `${feature.name} ${feature.level}`;
  }

  private static getWaffen(
    genesisData: GenesisSchema
  ): Array<CreateItem<Waffe>> {
    const weapons = [
      ...(genesisData.meleeWeapons ?? []),
      ...(genesisData.longRangeWeapons ?? []),
    ];
    return weapons.map((weapon, idx) => ({
      name: weapon.name ?? `Unnamed Weapon ${idx}`,
      type: ItemType.Waffe,
      data: {
        attribute: GenesisImportService.getAttributeShortname(
          weapon.attribute1
        ),
        attributeSecondary: GenesisImportService.getAttributeShortname(
          weapon.attribute2
        ),
        fertigkeit: weapon.skill ?? "",
        schaden: weapon.damage.replace(/W/g, "D") ?? "",
        ticks: weapon.weaponSpeed ?? 0,
        merkmale: (weapon?.features ?? [])
          .map(GenesisImportService.getMerkmalString)
          .join(", "),
        reichweite: (weapon as { range?: number })?.range ?? 0,
        isEquipped: idx === 0,
      },
    }));
  }

  private static getSchilde(
    genesisData: GenesisSchema
  ): Array<CreateItem<Schild>> {
    if (!genesisData.shields) {
      return [];
    }
    return genesisData.shields.map((shield, idx) => ({
      name: shield.name ?? `Unnamed Shield ${idx}`,
      type: ItemType.Schild,
      data: {
        VTD: shield.defensePlus,
        BEH: shield.handicap,
        schaden: shield.damage.replace(/W/g, "D") ?? "",
        fertigkeit: shield.skill ?? "",
        attribute: "INT",
        attributeSecondary: "STR",
        merkmale: (shield?.features ?? [])
          .map(GenesisImportService.getMerkmalString)
          .join(", "),
        isEquipped: idx === 0,
      },
    }));
  }

  private static getRuestungen(
    genesisData: GenesisSchema
  ): Array<CreateItem<Ruestung>> {
    if (!genesisData.armors) {
      return [];
    }
    return genesisData.armors.map((armor, idx) => ({
      name: armor.name ?? `Unnamed Armor ${idx}`,
      type: ItemType.Ruestung,
      data: {
        VTD: armor.defense,
        SR: armor.damageReduction,
        BEH: armor.handicap,
        tickPlus: armor.tickMalus ?? 0,
        merkmale: (armor?.features ?? [])
          .map(GenesisImportService.getMerkmalString)
          .join(", "),
        isEquipped: idx === 0,
      },
    }));
  }

  private static getMondzeichen(
    genesisData: GenesisSchema
  ): CreateItem<Mondzeichen> {
    if (!genesisData.moonSign) {
      return {
        name: `No moonsign`,
        type: ItemType.Mondzeichen,
        data: {},
      };
    }

    return {
      name: genesisData.moonSign.name,
      type: ItemType.Mondzeichen,
      data: {
        beschreibung: `<p>${genesisData.moonSign.description}</p>`,
      },
    };
  }
}
