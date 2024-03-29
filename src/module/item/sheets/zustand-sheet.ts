import { SplimoItemSheet } from "../splimo-item-sheet";
import { Zustand } from "../../models/items/zustand";
import { Modifier, ModifierType } from "../../models/items/modifier";
import { ModifierItemSheet } from "./modifier-item-sheet";

export class ZustandSheet extends SplimoItemSheet<Zustand> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/item/zustand-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
    });
  }

  getData(): ItemSheet.Data<Zustand> {
    const data = super.getData();
    const modifier = this.item.data.data.modifier.map((mod) => {
      return {
        fields: [mod.type, mod.target, `${mod.value}`],
      };
    });
    data.data.modifier = modifier;
    return data;
  }

  protected activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    this.registerCreateModifierClick(html);
    this.registerEditModifierClick(html);
    this.registerDeleteModifierClick(html);
  }

  private registerCreateModifierClick(html: JQuery<HTMLElement>): void {
    html.find(".zustand-modifier .add-item").on("click", async () => {
      const modifier: Modifier = {
        value: 2,
        target: "AUS",
        type: ModifierType.Attribute,
      };

      this.item.data.data.modifier.push(modifier);
      const index = this.item.data.data.modifier.length - 1;
      await this.item.update({
        _id: this.item.id,
        data: {
          modifier: [...this.item.data.data.modifier],
        },
      });
      this.renderModifierSheet(modifier, index);
    });
  }

  private registerEditModifierClick(html: JQuery<HTMLElement>): void {
    html.find(".zustand-modifier .edit-item").on("click", (evt) => {
      const index = +evt.target.dataset.index;
      const modifier: Modifier = this.item.data.data.modifier[index];
      this.item.update({
        _id: this.item.id,
        data: {
          modifier: [...this.item.data.data.modifier],
        },
      });

      this.renderModifierSheet(modifier, index);
    });
  }

  private renderModifierSheet(modifier: Modifier, index: number): void {
    new ModifierItemSheet(modifier, {}, (evt, formData) => {
      const item: Modifier = this.item.data.data.modifier[index];
      item.target = formData.target;
      item.type = formData.type;
      item.value = formData.value;
      return this.item.update({
        _id: this.item.id,
        data: {
          modifier: [...this.item.data.data.modifier],
        },
      });
    }).render(true);
  }

  private registerDeleteModifierClick(html: JQuery<HTMLElement>): void {
    html.find(".zustand-modifier .delete-item").on("click", (evt) => {
      const index = +evt.target.dataset.index;
      this.item.data.data.modifier.splice(index, 1);
      this.item.update({
        _id: this.item.id,
        data: {
          modifier: this.item.data.data.modifier,
        },
      });
    });
  }
}
