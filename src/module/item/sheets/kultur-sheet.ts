import { SplimoItemSheet } from "../splimo-item-sheet";
import { Kultur } from "../../models/items/kultur";
import { Modifier, ModifierType } from "../../models/items/modifier";
import { ModifierItemSheet } from "./modifier-item-sheet";
import { ChargenSheet } from "./chargen-sheet";

export class KulturSheet extends SplimoItemSheet<Kultur> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/item/kultur-sheet.hbs",
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

  getData(): ItemSheet.Data<Kultur> {
    const data = super.getData();
    const modifier = this.item.data.data.modifier.map((mod) => {
      return {
        fields: [mod.type, mod.target, `${mod.value}`],
      };
    });
    data.data.modifier = modifier;
    data.data.chargen = ChargenSheet.getChargenData(
      (this.object as Item<Kultur>).data.data.choices ?? []
    );
    return data;
  }

  protected activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    this.registerCreateModifierClick(html);
    this.registerEditModifierClick(html);
    this.registerDeleteModifierClick(html);
    ChargenSheet.activateChargenListeners(
      html,
      (this.object as Item<Kultur>).data.data.choices ?? [],
      (choices) => {
        this.object.update({
          _id: this.object._id,
          data: {
            choices: choices,
          },
        });
      }
    );
  }

  private registerCreateModifierClick(html: JQuery<HTMLElement>): void {
    html.find(".kultur-modifier .add-item").on("click", async () => {
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
    html.find(".kultur-modifier .edit-item").on("click", (evt) => {
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
    html.find(".kultur-modifier .delete-item").on("click", (evt) => {
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
