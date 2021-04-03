import { AnySplimoActor } from "../models/actor-type";
import { ItemType } from "../models/item-type";
import { RollService } from "../services/roll-service";
import { getSheetClass } from "../item/register-item-sheets";
import { CalculationService } from "../services/calculation-service";
import { ChargenService } from "../services/chargen-service";

export abstract class SplimoActorSheet<
  T extends AnySplimoActor
> extends ActorSheet<T> {
  protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
    super.activateListeners(html);
    if (html instanceof HTMLElement) {
      console.error(
        "activateListeners: html is wrong element, should be JQuery but is HTMLElement"
      );
      return;
    }
    this.registerClick(html);
  }

  protected _onDrop(event: Event | JQuery.Event): Promise<boolean | any> {
    const dataTransfer = (event as DragEvent)?.dataTransfer?.getData(
      "text/plain"
    );
    if (dataTransfer) {
      const { type, id } = JSON.parse(dataTransfer);
      if (type === "Item") {
        const item = game.items.get(id);
        if (
          item &&
          ChargenService.CHARGEN_ITEM_TYPES.includes(item.type as any)
        ) {
          ChargenService.applyChargenData(this.actor, item);
        }
      }
    }
    return super._onDrop(event);
  }

  private registerClick(html: JQuery<HTMLElement>): void {
    html.find(`.clickable`).on("click", (evt) => {
      const target = evt?.target;
      const operation = target?.dataset?.operation;
      const type = target?.dataset?.type;
      const id = target?.dataset["clickId"];
      if (operation === "add" && type != null) {
        this.createItem(type as ItemType);
      }
      if (operation === "edit" && type != null) {
        this.editItem(type as ItemType, id);
      }
      if (operation === "delete" && type != null) {
        this.deleteItem(type as ItemType, id);
      }
      if (operation === "equip") {
        this.equipItem(type as ItemType, id);
      }
      if (operation === "unequip") {
        this.unequipItem(type as ItemType, id);
      }
      if (operation === "sp-add") {
        this.addSplitterpunkt();
      }
      if (operation === "sp-reduce") {
        this.removeSplitterpunkt();
      }
      if (operation === "roll") {
        RollService.roll((evt as unknown) as Event, this.actor);
      }
      if (operation === "iniRoll") {
        if (game.combats.active) {
          const combat = game.combats.active;
          const combatant = combat.combatants?.find(
            (c) => c?.actor?._id === this.actor.id
          );
          if (combatant) {
            // @ts-ignore
            combat.rollInitiative(combatant._id);
          } else {
            RollService.rollInitiative((evt as unknown) as Event, this.actor);
          }
        } else {
          RollService.rollInitiative((evt as unknown) as Event, this.actor);
        }
      }
    });
  }

  private createItem(type: ItemType): void {
    this.actor.createOwnedItem(
      { type, name: `New ${type}` },
      { renderSheet: true }
    );
  }

  private editItem(type: ItemType, id?: string): void {
    const item = this.actor.items.find(
      (item) => item.type === type && (id == null || item.id === id)
    );
    const sheet = getSheetClass(type);
    if (item && sheet) {
      new sheet(item).render(true);
    }
  }

  private deleteItem(type: ItemType, id?: string): void {
    const item = this.actor.items.find(
      (item) => item.type === type && (id == null || item.id === id)
    );
    if (item) {
      this.actor.deleteOwnedItem(item.id);
    }
  }

  private addSplitterpunkt(): void {
    this.actor
      .update({
        id: this.actor.id,
        data: {
          splitterpunkte: {
            value: Math.min(15, this.actor.data.data.splitterpunkte.value + 1),
          },
        },
      })
      .then(() => this.render());
  }

  private removeSplitterpunkt() {
    this.actor
      .update({
        id: this.actor.id,
        data: {
          splitterpunkte: {
            value: Math.max(0, this.actor.data.data.splitterpunkte.value - 1),
          },
        },
      })
      .then(() => this.render());
  }

  protected updateViewSpecificData(formData: any): any {
    const viewHealth = formData["data.view.health.asString"];
    const viewMaxHealth = formData["data.view.health.max"];

    const viewFokus = formData["data.view.fokus.asString"];
    const viewMaxFokus = formData["data.view.fokus.max"];

    const viewInitiative = formData["data.view.initiative"];

    if (viewHealth) {
      const health = CalculationService.fromEKVString(viewHealth);
      formData["data.healthErschoepft"] = health.erschoepft;
      formData["data.healthKanalisiert"] = health.kanalisiert;
      formData["data.healthVerzehrt"] = health.verzehrt;
      delete formData["data.view.health.asString"];
      if (viewMaxHealth != null) {
        formData["data.health.value"] =
          viewMaxHealth -
          health.erschoepft -
          health.kanalisiert -
          health.verzehrt;
        formData["data.health.max"] = viewMaxHealth;
        formData["data.health.min"] = 0;
        delete formData["data.view.health.max"];
      }
    }

    if (viewFokus) {
      const fokus = CalculationService.fromEKVString(viewFokus);
      formData["data.fokusErschoepft"] = fokus.erschoepft;
      formData["data.fokusKanalisiert"] = fokus.kanalisiert;
      formData["data.fokusVerzehrt"] = fokus.verzehrt;
      delete formData["data.view.fokus.asString"];
      if (viewMaxFokus != null) {
        formData["data.fokus.value"] =
          viewMaxFokus - fokus.erschoepft - fokus.kanalisiert - fokus.verzehrt;
        formData["data.fokus.max"] = viewMaxFokus;
        formData["data.fokus.min"] = 0;
        delete formData["data.view.fokus.max"];
      }
    }

    if (viewInitiative != null) {
      formData["data.initiativeTotal"] = viewInitiative;
      delete formData["data.view.initiative"];
    }

    return formData;
  }

  private equipItem(type: ItemType, id: string): void {
    const item = this.actor.items.find(
      (item) => item.type === type && (id == null || item.id === id)
    );
    if (item) {
      const toUnequip = this.actor.items
        .filter((i) => i.type === type && i._id !== item._id)
        .map((i) => ({
          _id: i._id,
          data: {
            isEquipped: false,
          },
        }));
      this.actor.updateOwnedItem([
        ...toUnequip,
        {
          _id: item.id,
          data: {
            isEquipped: true,
          },
        },
      ]);
    }
  }

  private unequipItem(type: ItemType, id: string): void {
    const item = this.actor.items.find(
      (item) => item.type === type && (id == null || item.id === id)
    );
    if (item) {
      this.actor.updateOwnedItem({
        _id: item.id,
        data: {
          isEquipped: false,
        },
      });
    }
  }
}
