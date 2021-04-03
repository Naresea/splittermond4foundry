import {
  ChargenOption,
  DistributePointsChoice,
  SelectNOfChoice,
} from "../models/items/chargen";

export class ChargenDistributePoints extends FormApplication<
  DistributePointsChoice<ChargenOption>
> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/popups/chargen-distribute-points.hbs",
      width: 512,
      height: 512,
      submitOnChange: true,
      submitOnClose: true,
      closeOnSubmit: false,
      editable: true,
    });
  }

  private readonly submitCallback;
  private distributedPoints: Array<number> = [];

  constructor(
    object?: DistributePointsChoice<ChargenOption>,
    options?: FormApplication.Options,
    submit?: (formData: ChargenOption | undefined) => void
  ) {
    super(object, options);
    this.submitCallback = submit;
  }

  getData(opt?: object): any | Promise<any> {
    const options = this.object.options.map((opt, idx) => ({
      ...opt,
      label: `${game.i18n.localize(
        `splittermond.chargen-option-label.type.${opt.type}`
      )} ${opt.name}${opt.points ? ` (${opt.points})` : ""}`,
      index: idx,
    }));

    const remaining =
      this.object.numPoints -
      this.distributedPoints.reduce((accu, val) => accu + val, 0);
    return {
      options,
      distributedPoints: this.distributedPoints,
      numPoints: this.object.numPoints,
      remaining: remaining,
      canSubmit: remaining === 0,
    };
  }

  protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
    super.activateListeners(html);
    if (html instanceof HTMLElement) {
      console.error("ChargenDistributePoints: html is of wrong type.");
      return;
    }
    html.find(".btn-submit").on("click", (evt) => {
      const selectedOptions = this.object.options
        .map((o, idx) => ({
          ...o,
          points: this.distributedPoints[idx],
        }))
        .filter((o) => o.points > 0);
      if (this.submitCallback) {
        this.submitCallback(selectedOptions);
      }
      this.close();
    });
  }

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: object
  ): Promise<any> {
    this.distributedPoints = [];
    for (let i = 0; i < this.object.options.length; i++) {
      const data = formData[`option.${i}`];
      this.distributedPoints[i] = data ?? 0;
    }
    this.render();
    return Promise.resolve();
  }
}
