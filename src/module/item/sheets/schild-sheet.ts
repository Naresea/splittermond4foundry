import { SplimoItemSheet } from "../splimo-item-sheet";
import { Schild } from "../../models/items/schild";

export class SchildSheet extends SplimoItemSheet<Schild> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/item/schild-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "shield",
        },
      ],
    });
  }
}
