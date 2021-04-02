import { SplimoItemSheet } from "../splimo-item-sheet";
import { Benutzbar } from "../../models/items/benutzbar";

export class BenutzbarSheet extends SplimoItemSheet<Benutzbar> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/item/benutzbar-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "usable",
        },
      ],
    });
  }

  getData(): ItemSheet.Data<Benutzbar> {
    const data = super.getData();
    console.log("Get data usabale: ", data);
    return data;
  }

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: any
  ): Promise<any> {
    console.log("Updating usable: ", formData);
    return super._updateObject(event, formData);
  }
}
