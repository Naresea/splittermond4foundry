import { SplimoItemSheet } from "../splimo-item-sheet";
import { Waffe } from "../../models/items/waffe";

export class WaffeSheet extends SplimoItemSheet<Waffe> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/item/waffe-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "weapon",
        },
      ],
    });
  }
}
