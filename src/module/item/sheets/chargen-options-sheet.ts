import { ChargenOption } from "../../models/items/chargen";

export class ChargenOptionsSheet extends FormApplication<ChargenOption> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/item/chargen-option-sheet.hbs",
      width: 512,
      height: 766,
      tabs: [
        {
          navSelector: ".sheet-tabs",
          contentSelector: ".sheet-body",
          initial: "description",
        },
      ],
      submitOnChange: true,
      submitOnClose: true,
      closeOnSubmit: false,
      editable: true,
    });
  }

  private readonly update;

  constructor(
    object?: ChargenOption,
    options?: FormApplication.Options,
    update?: (formData: any) => any
  ) {
    super(object, options);
    this.update = update;
  }

  getData(options?: object): any | Promise<any> {
    return {
      ...this.object,
      typeLabels: [
        "splittermond.chargen-option.typelabels.fertigkeit",
        "splittermond.chargen-option.typelabels.meisterschaft",
        "splittermond.chargen-option.typelabels.resource",
        "splittermond.chargen-option.typelabels.staerke",
        "splittermond.chargen-option.typelabels.schwaeche",
        "splittermond.chargen-option.typelabels.attribute",
      ],
      availableTypes: [
        "fertigkeit",
        "meisterschaft",
        "resource",
        "staerke",
        "schwaeche",
        "attribute",
      ],
      masteryLevelFilter: (this.object.masteryLevelFilter ?? []).join(", "),
    };
  }

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: any
  ): Promise<any> {
    this.object.type = formData.type ?? this.object.type;
    this.object.name = formData.name ?? this.object.name;
    this.object.points = formData.points ?? this.object.points;
    this.object.skillTypeFilter =
      formData.skillTypeFilter ?? this.object.skillTypeFilter;
    this.object.masterySkillFilter =
      formData.masterySkillFilter ?? this.object.masterySkillFilter;
    this.object.masteryLevelFilter =
      this.mapMasterySkillFilter(formData.masteryLevelFilter) ??
      this.object.masteryLevelFilter;

    this.render();
    return this.update
      ? this.update(formData as any)
      : Promise.reject("No update defined.");
  }

  private mapMasterySkillFilter(filter?: string): Array<number> {
    return filter
      ?.split(",")
      .map((s) => s.trim())
      .map((s) => (Number.isNumeric(s) ? +s : undefined))
      .filter((s) => s != null);
  }
}
