import {SplimoActorSheet} from '../splimo-actor-sheet';
import {NonPlayerCharacter} from '../../models/actors/non-player-character';
import {CalculationService} from '../../services/calculation-service';
import {ModifierService} from '../../services/modifier-service';
import {ModifierType} from '../../models/items/modifier';
import {PlayerDataService} from '../../services/player-data-service';
import {ATTRIBUTES} from '../../models/actors/attributes';
import {DERIVED_ATTRIBUTES} from '../../models/actors/derived-attributes';
import {FertigkeitType} from '../../models/items/fertigkeit';

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
    const modifiers = ModifierService.getModifiers(this.actor);
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

    (data.data as any).waffen = PlayerDataService.getWaffen(
      this.actor,
      modifiers
    );
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

    (data.data as any).fertigkeiten = PlayerDataService.getFertigkeitenByType(
      this.actor,
      modifiers,
      FertigkeitType.Allgemein
    );

    (data.data as any).kampfFertigkeiten = PlayerDataService.getFertigkeitenByType(
        this.actor,
        modifiers,
        FertigkeitType.Kampf
    );

    (data.data as any).magieFertigkeiten = PlayerDataService.getFertigkeitenByType(
        this.actor,
        modifiers,
        FertigkeitType.Magie
    );

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

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: any
  ): Promise<any> {
    formData = this.updateViewSpecificData(formData);
    return super._updateObject(event, formData);
  }
}
