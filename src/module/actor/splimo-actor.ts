import { AnySplimoActor } from "../models/actor-type";
import { ItemType } from "../models/item-type";
import { DEFAULT_FERTIGKEITEN } from "../item/default-fertigkeiten";
import { CalculationService } from "../services/calculation-service";

export class SplimoActor extends Actor<AnySplimoActor> {
  prepareData(): void {
    super.prepareData();

    if (this.data.data.initiativeTotal == null) {
      this.data.data.initiativeTotal = CalculationService.getInitiative(this);
      this.update({
        id: this.id,
        data: { initiativeTotal: this.data.data.initiativeTotal },
      });
    }

    const fertigkeiten = this.items.filter(
      (item) => item.type === ItemType.Fertigkeit
    );
    if (fertigkeiten.length < 1) {
      this.addDefaultFertigkeiten();
    }
  }

  private addDefaultFertigkeiten(): void {
    const data = DEFAULT_FERTIGKEITEN.map((fertigkeit) => ({
      name: fertigkeit.name,
      type: ItemType.Fertigkeit,
      data: fertigkeit,
    }));

    this.createEmbeddedEntity("OwnedItem", data);
  }
}
