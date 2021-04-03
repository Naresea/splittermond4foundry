import {ChargenOption, SelectOneOfChoice} from '../models/items/chargen';

export class ChargenSelectOne extends FormApplication<SelectOneOfChoice<ChargenOption>> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["splittermond"],
            template:
                "systems/splittermond/templates/sheets/popups/chargen-select-one.hbs",
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
        object?: SelectOneOfChoice<ChargenOption>,
        options?: FormApplication.Options,
        submit?: (formData: ChargenOption | undefined) => void
    ) {
        super(object, options);
        this.submitCallback = submit;
    }

    getData(options?: object): any | Promise<any> {
        return {
            labels: this.object.options.map(opt => `${game.i18n.localize(`splittermond.chargen-option-label.type.${opt.type}`)} ${opt.name}${opt.points ? ` (${opt.points})` : ''}`),
            values: this.object.options.map(opt => opt.name)
        };
    }

    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        if (html instanceof HTMLElement) {
            console.error("ChargenSelectOne: html is of wrong type.");
            return;
        }
        html.find(".btn-submit").on("click", (evt) => {
            const select = html.find('select[name="selectedOption"]').get()[0];
            const selectedIndex = +(select as HTMLSelectElement)?.selectedIndex ?? 0;
            const option = this.object.options[selectedIndex];
            if (this.submitCallback) {
                this.submitCallback(option);
            }
            this.close();
        });
    }

    protected _updateObject(
        event: Event | JQuery.Event,
        formData: object
    ): Promise<any> {
        return Promise.resolve();
    }
}
