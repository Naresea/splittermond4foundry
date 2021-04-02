import { Fertigkeit, FertigkeitType } from "../models/items/fertigkeit";

export const DEFAULT_FERTIGKEITEN: Array<Fertigkeit & { name: string }> = [
  {
    attributEins: "BEW",
    attributZwei: "STR",
    punkte: 0,
    mod: 0,
    name: "Akrobatik",
    beschreibung: "",
    regelwerk: "",
    seite: 0,
    type: FertigkeitType.Allgemein,
  },
];
