import { SplimoActorSheet } from "../splimo-actor-sheet";
import { NonPlayerCharacter } from "../../models/actors/non-player-character";
import { CalculationService } from "../../services/calculation-service";
import {DecoratedModifier, ModifierService} from '../../services/modifier-service';
import { ModifierType } from "../../models/items/modifier";
import { PlayerDataService } from "../../services/player-data-service";
import { ATTRIBUTES } from "../../models/actors/attributes";
import { DERIVED_ATTRIBUTES } from "../../models/actors/derived-attributes";
import { FertigkeitType } from "../../models/items/fertigkeit";
import {ItemType} from '../../models/item-type';

export class SplimoNpcSheet extends SplimoActorSheet<NonPlayerCharacter> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/actor/non-player-sheet.hbs",
      width: 1024,
      height: 754,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "attributes",
        },
        {
          navSelector: ".fertigkeiten-tabs",
          contentSelector: ".fertigkeiten-content",
          initial: "allgemein",
        },
      ],
    });
  }

  getData(): ActorSheet.Data<NonPlayerCharacter> {
    const data = super.getData();
    const modifiers = {
      byType: new Map<ModifierType, Array<DecoratedModifier>>(),
      byTarget: new Map<string, Array<DecoratedModifier>>(),
      byItemType: new Map<ItemType, Array<DecoratedModifier>>(),
    };

    const npcData: NonPlayerCharacter = (this
      .actor as Actor<NonPlayerCharacter>).data.data;
    const maxHealth =
      npcData.LP *
      (5 +
        ModifierService.totalMod(modifiers, null, {
          modType: ModifierType.WoundLevels,
        }));
    const maxFokus = npcData.FO;

    (data.data as any).view = {
      health: {
        max: maxHealth,
        current:
          maxHealth -
          npcData.healthErschoepft -
          npcData.healthVerzehrt -
          npcData.healthKanalisiert,
        asString: CalculationService.toEKVString(
          npcData.healthErschoepft,
          npcData.healthKanalisiert,
          npcData.healthVerzehrt
        ),
      },
      fokus: {
        max: maxFokus,
        current:
          maxFokus -
          npcData.fokusErschoepft -
          npcData.fokusVerzehrt -
          npcData.fokusKanalisiert,
          asString: CalculationService.toEKVString(
            npcData.fokusErschoepft,
            npcData.fokusKanalisiert,
            npcData.fokusVerzehrt
          ),
      },
    };

    (data.data as any).merkmale = PlayerDataService.getMerkmale(
      this.actor,
      modifiers
    );
    (data.data as any).zustaende = PlayerDataService.getZustaende(
      this.actor,
      modifiers
    );

    (data.data as any).attributeModifier = [
      ...ATTRIBUTES,
      ...DERIVED_ATTRIBUTES,
    ].reduce((accu, attr) => {
      accu[attr] = ModifierService.totalMod(modifiers, attr, {
        modType: ModifierType.Attribute,
      });
      return accu;
    }, {});

    (data.data as any).meisterschaften = PlayerDataService.getMeisterschaften(
      this.actor,
      modifiers
    );
    (data.data as any).zauber = PlayerDataService.getZauber(
      this.actor,
      modifiers
    );

    return data;
  }

  protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
    super.activateListeners(html);
    const query = html instanceof HTMLElement ? $(html) : html;

    // trash listener for skills
    query.on('click', '.fertigkeiten .fa-trash', (evt) => {
      const targetDataset = (evt.currentTarget as HTMLElement)?.dataset;
      if (targetDataset) {
        const deleteIdx = targetDataset['index'];
        this.actor.data.data.fertigkeiten.splice(+deleteIdx, 1);
        this.actor.update({
          _id: this.actor._id,
          data: {
            fertigkeiten: this.actor.data.data.fertigkeiten
          }
        });
      }
    });

    // trash listener for weapons
    query.on('click', '.waffen .fa-trash', (evt) => {
      const targetDataset = (evt.currentTarget as HTMLElement)?.dataset;
      if (targetDataset) {
        const deleteIdx = targetDataset['index'];
        this.actor.data.data.waffen.splice(+deleteIdx, 1);
        this.actor.update({
          _id: this.actor._id,
          data: {
            waffen: this.actor.data.data.waffen
          }
        });
      }
    });
  }

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: any
  ): Promise<any> {
    formData = this.updateViewSpecificData(formData);

    const fertigkeiten = this.actor.data.data.fertigkeiten;
    for (let i = 0; i < fertigkeiten.length; i++) {
      fertigkeiten[i].name = formData[`data.fertigkeiten[${i}].name`];
      fertigkeiten[i].wert = formData[`data.fertigkeiten[${i}].wert`];
      delete formData[`data.fertigkeiten[${i}].name`];
      delete formData[`data.fertigkeiten[${i}].name`];
    }

    const newFertigkeitName = formData['data.newFertigkeit.name'];
    if (newFertigkeitName && newFertigkeitName.trim().length > 0) {
      delete formData['data.newFertigkeit.name'];
      const newFertigkeit = { name: newFertigkeitName, wert: 0};
      fertigkeiten.push(newFertigkeit);
    }

    const waffen = this.actor.data.data.waffen;
    for (let i = 0; i < waffen.length; i++) {
      waffen[i].name = formData[`data.waffen[${i}].name`];
      waffen[i].wert = formData[`data.waffen[${i}].wert`];
      waffen[i].wgs = formData[`data.waffen[${i}].wgs`];
      waffen[i].schaden = formData[`data.waffen[${i}].schaden`];
      waffen[i].merkmale = formData[`data.waffen[${i}].merkmale`];
      delete formData[`data.waffen[${i}].name`];
      delete formData[`data.waffen[${i}].wert`];
      delete formData[`data.waffen[${i}].wgs`];
      delete formData[`data.waffen[${i}].schaden`];
      delete formData[`data.waffen[${i}].merkmale`];
    }

    const newWaffeName = formData['data.newWaffe.name'];
    if (newWaffeName && newWaffeName.trim().length > 0) {
      delete formData['data.newWaffe.name'];
      waffen.push({
        name: newWaffeName,
        wgs: 0,
        wert: 0,
        schaden: '',
        merkmale: ''
      });
    }

    return this.actor.update({
      _id: this.actor.id,
      data: {
        fertigkeiten: fertigkeiten,
        waffen: waffen
      }
    }).then(() => super._updateObject(event, formData))
      .then(() => CalculationService.updateWoundModifier(this.actor));
  }
}
