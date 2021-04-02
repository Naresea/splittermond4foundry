export interface DiceRollOption {
  rollType: "sicherheit" | "risiko" | "standard";
  modifier: number;
}

export class DiceRollDialog extends FormApplication<DiceRollOption> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template:
        "systems/splittermond/templates/sheets/popups/dice-roll-dialog.hbs",
      width: 512,
      height: 340,
      submitOnChange: false,
      submitOnClose: false,
      closeOnSubmit: true,
      editable: true,
    });
  }

  private readonly submitCallback;

  constructor(
    object?: DiceRollOption,
    options?: FormApplication.Options,
    submit?: (formData: any) => Promise<any>
  ) {
    super(object, options);
    this.submitCallback = submit;
  }

  getData(options?: object): any | Promise<any> {
    return this.object;
  }

  protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
    super.activateListeners(html);
    if (html instanceof HTMLElement) {
      console.error("DiceRollDialog: html is of wrong type.");
      return;
    }
    html.find(".clickable").on("click", (evt) => {
      const dataset = evt?.currentTarget?.dataset;
      if (dataset) {
        const submitValue = dataset["dicerollSubmit"];
        const modifier = html.find('input[name="data.modifier"]').get()[0];
        const value = +(modifier as HTMLInputElement)?.value ?? 0;
        if (this.submitCallback) {
          this.submitCallback({
            modifier: value,
            rollType: submitValue,
          });
        }
        this.close();
      }
    });
  }

  protected _updateObject(
    event: Event | JQuery.Event,
    formData: object
  ): Promise<any> {
    return Promise.resolve();
  }
}
