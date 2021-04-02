import { SplimoItemSheet } from "../splimo-item-sheet";
import { Fertigkeit } from "../../models/items/fertigkeit";

export class FertigkeitSheet extends SplimoItemSheet<Fertigkeit> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/item/fertigkeit-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "details",
        },
      ],
    });
  }
}
