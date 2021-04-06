import { AnySplimoActor } from "../models/actor-type";
import { ItemType } from "../models/item-type";
import { DEFAULT_FERTIGKEITEN } from "../item/default-fertigkeiten";
import { CalculationService } from "../services/calculation-service";
import { GenesisImportService } from "../genesis/genesis-import-service";
import { PlayerCharacter } from "../models/actors/player-character";
import {GenesisExportService} from '../genesis/genesis-export-service';

export class SplimoActor extends Actor<AnySplimoActor> {

  prepareData(): void {
    super.prepareData();

    this.initInitiative().then(() => {
      const fertigkeiten = this.items.filter(
          (i) => i.type === ItemType.Fertigkeit
      );
      if (fertigkeiten.length < 1) {
        this.addDefaultFertigkeiten();
      }
    });
  }

  importFromJSON(json: string): Promise<Entity> {
    return new Promise((resolve) => {
      const d = new Dialog({
        title: game.i18n.localize('splittermond.start-import-dialog.title'),
        content: game.i18n.localize('splittermond.start-import-dialog.content'),
        buttons: {
          genesis: {
            label: game.i18n.localize('splittermond.start-import-dialog.btn-genesis'),
            callback: () => GenesisImportService.importFromGenesis(this as Actor<PlayerCharacter>, json)
          },
          default: {
            label: game.i18n.localize('splittermond.start-import-dialog.btn-default'),
            callback: () => super.importFromJSON(json)
          }
        },
        default: 'default'
      });
      d.render(true);
    });
  }

  exportToJSON(): void {
    const d = new Dialog({
        title: game.i18n.localize('splittermond.export-dialog.title'),
        content: game.i18n.localize('splittermond.export-dialog.content'),
        buttons: {
          genesis: {
            label: game.i18n.localize('splittermond.export-dialog.btn-genesis'),
            callback: () => GenesisExportService.exportToGenesis(this as Actor<PlayerCharacter>)
          },
          default: {
            label: game.i18n.localize('splittermond.export-dialog.btn-default'),
            callback: () => super.exportToJSON()
          }
        },
        default: 'default'
      });
      d.render(true);
  }

  private async initInitiative(): Promise<void> {
    if (this.data.data.initiativeTotal == null) {
      this.data.data.initiativeTotal = CalculationService.getInitiative(this);
      await this.update({
        id: this.id,
        data: { initiativeTotal: this.data.data.initiativeTotal },
      });
    }
  }

  private async addDefaultFertigkeiten(): Promise<void> {
    if (this.data.type === 'NonPlayerCharacter') {
      this.update({
        _id: this._id,
        data: {
          isInitialized: true,
        },
      });
      return;
    }

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
            isInitialized: true,
          },
        });
      });
    }
  }
}
