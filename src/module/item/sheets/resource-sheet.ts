import { SplimoItemSheet } from "../splimo-item-sheet";
import { Resource } from "../../models/items/resource";

export class ResourceSheet extends SplimoItemSheet<Resource> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/item/resource-sheet.hbs",
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
