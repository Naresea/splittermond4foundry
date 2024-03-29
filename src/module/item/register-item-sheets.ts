import { SplimoItem } from "./splimo-item";
import { ItemType } from "../models/item-type";
import { AbstammungSheet } from "./sheets/abstammung-sheet";
import { AusbildungSheet } from "./sheets/ausbildung-sheet";
import { KulturSheet } from "./sheets/kultur-sheet";
import { RasseSheet } from "./sheets/rasse-sheet";
import { MondzeichenSheet } from "./sheets/mondzeichen-sheet";
import { StaerkeSheet } from "./sheets/staerke-sheet";
import { SchwaecheSheet } from "./sheets/schwaeche-sheet";
import { FertigkeitSheet } from "./sheets/fertigkeit-sheet";
import { MeisterschaftSheet } from "./sheets/meisterschaft-sheet";
import { ResourceSheet } from "./sheets/resource-sheet";
import { ZauberSheet } from "./sheets/zauber-sheet";
import { WaffeSheet } from "./sheets/waffe-sheet";
import { RuestungSheet } from "./sheets/ruestung-sheet";
import { SchildSheet } from "./sheets/schild-sheet";
import { GegenstandSheet } from "./sheets/gegenstand-sheet";
import { BenutzbarSheet } from "./sheets/benutzbar-sheet";
import { MerkmalSheet } from "./sheets/merkmal-sheet";
import { ZustandSheet } from "./sheets/zustand-sheet";

export function registerItemSheets(): void {
  CONFIG.Item.entityClass = SplimoItem as typeof Item;
  Items.unregisterSheet("core", ItemSheet);
  Items.registerSheet("splittermond", AbstammungSheet, {
    types: [ItemType.Abstammung],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", AusbildungSheet, {
    types: [ItemType.Ausbildung],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", KulturSheet, {
    types: [ItemType.Kultur],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", RasseSheet, {
    types: [ItemType.Rasse],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", MondzeichenSheet, {
    types: [ItemType.Mondzeichen],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", StaerkeSheet, {
    types: [ItemType.Staerke],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", SchwaecheSheet, {
    types: [ItemType.Schwaeche],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", FertigkeitSheet, {
    types: [ItemType.Fertigkeit],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", MeisterschaftSheet, {
    types: [ItemType.Meisterschaft],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", ResourceSheet, {
    types: [ItemType.Resource],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", ZauberSheet, {
    types: [ItemType.Zauber],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", WaffeSheet, {
    types: [ItemType.Waffe],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", RuestungSheet, {
    types: [ItemType.Ruestung],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", SchildSheet, {
    types: [ItemType.Schild],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", GegenstandSheet, {
    types: [ItemType.Gegenstand],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", BenutzbarSheet, {
    types: [ItemType.Benutzbar],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", MerkmalSheet, {
    types: [ItemType.Merkmal],
    makeDefault: true,
  });
  Items.registerSheet("splittermond", ZustandSheet, {
    types: [ItemType.Zustand],
    makeDefault: true,
  });
}

export function getSheetClass(type: ItemType): typeof ItemSheet | undefined {
  switch (type) {
    case ItemType.Abstammung:
      return AbstammungSheet as any;
    case ItemType.Ausbildung:
      return AusbildungSheet as any;
    case ItemType.Kultur:
      return KulturSheet as any;
    case ItemType.Rasse:
      return RasseSheet as any;
    case ItemType.Mondzeichen:
      return MondzeichenSheet as any;
    case ItemType.Staerke:
      return StaerkeSheet as any;
    case ItemType.Schwaeche:
      return SchwaecheSheet as any;
    case ItemType.Fertigkeit:
      return FertigkeitSheet as any;
    case ItemType.Meisterschaft:
      return MeisterschaftSheet as any;
    case ItemType.Resource:
      return ResourceSheet as any;
    case ItemType.Zauber:
      return ZauberSheet as any;
    case ItemType.Waffe:
      return WaffeSheet as any;
    case ItemType.Ruestung:
      return RuestungSheet as any;
    case ItemType.Schild:
      return SchildSheet as any;
    case ItemType.Gegenstand:
      return GegenstandSheet as any;
    case ItemType.Benutzbar:
      return BenutzbarSheet as any;
    case ItemType.Merkmal:
      return MerkmalSheet as any;
    case ItemType.Zustand:
      return ZustandSheet as any;
    default:
      return undefined;
  }
}
