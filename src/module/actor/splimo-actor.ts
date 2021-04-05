import { AnySplimoActor } from "../models/actor-type";
import { ItemType } from "../models/item-type";
import { DEFAULT_FERTIGKEITEN } from "../item/default-fertigkeiten";
import { CalculationService } from "../services/calculation-service";
import {GenesisImportService} from '../genesis/genesis-import-service';
import {PlayerCharacter} from '../models/actors/player-character';

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

    const fertigkeiten = this.items.filter(i => i.type === ItemType.Fertigkeit);
    if (fertigkeiten.length < 1) {
      this.addDefaultFertigkeiten();
    }
  }

  importFromJSON(json: string): Promise<Entity> {
    if (this.data.type === 'PlayerCharacter') {
      return GenesisImportService.importFromGenesis(this as Actor<PlayerCharacter>, json);
    } else {
      return super.importFromJSON(json);
    }
  }

  exportToJSON(): void {
    /* if (this.data.type === 'PlayerCharacter') {
      GenesisImportService.exportToGenesis(this as Actor<PlayerCharacter>);
    } else {
      super.exportToJSON();
    }*/
    super.exportToJSON();
  }

  private async addDefaultFertigkeiten(): Promise<void> {
    const data = DEFAULT_FERTIGKEITEN.map((fertigkeit) => ({
      name: fertigkeit.name,
      type: ItemType.Fertigkeit,
      data: fertigkeit,
    }));

    if (!this.data.data.isInitialized) {
      const id = this._id;
      this.createEmbeddedEntity("OwnedItem", data).then(() => {
        this.update({
          _id: id,
          data: {
            isInitialized: true
          }
        })
      });
    }
  }
}
