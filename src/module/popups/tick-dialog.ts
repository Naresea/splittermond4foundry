export interface TickInput {
  tickPlus: number;
  modifier: number;
}

export class TickDialog extends FormApplication<TickInput> {
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["splittermond"],
      template: "systems/splittermond/templates/sheets/popups/tick-dialog.hbs",
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
    object?: TickInput,
    options?: FormApplication.Options,
    submit?: (formData: any) => void
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
      console.error("TickDialog: html is of wrong type.");
      return;
    }
    html.find(".clickable").on("click", (evt) => {
      const dataset = evt?.currentTarget?.dataset;
      if (dataset) {
        const submitValue = dataset["ticksSubmit"];
        if (submitValue === "ok") {
          const modifier = html.find('input[name="data.ticks"]').get()[0];
          const value = +(modifier as HTMLInputElement)?.value ?? 0;
          if (this.submitCallback) {
            this.submitCallback({
              modifier: value,
            });
          }
        } else {
          if (this.submitCallback) {
            this.submitCallback(undefined);
          }
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
