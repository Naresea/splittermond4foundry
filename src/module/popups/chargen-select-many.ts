import {ChargenOption, SelectNOfChoice} from '../models/items/chargen';

export class ChargenSelectMany extends FormApplication<SelectNOfChoice<ChargenOption>> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["splittermond"],
            template:
                "systems/splittermond/templates/sheets/popups/chargen-select-many.hbs",
            width: 512,
            height: 340,
            submitOnChange: true,
            submitOnClose: true,
            closeOnSubmit: false,
            editable: true,
        });
    }

    private readonly submitCallback;
    private selectedIndices: Array<number> = [];

    constructor(
        object?: SelectNOfChoice<ChargenOption>,
        options?: FormApplication.Options,
        submit?: (formData: ChargenOption | undefined) => void
    ) {
        super(object, options);
        this.submitCallback = submit;
    }

    getData(opt?: object): any | Promise<any> {

        const options = this.object.options.map((opt, idx) => ({
            ...opt,
            label:  `${opt.type} ${opt.name}${opt.points ? ` (${opt.points})` : ''}`,
            index: idx
        }));

        const remaining = this.object.numN - this.selectedIndices.length;
        return {
            options,
            selectedIndices: this.selectedIndices,
            numN: this.object.numN,
            remaining: remaining,
            canSubmit: remaining === 0
        };
    }

    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        if (html instanceof HTMLElement) {
            console.error("ChargenSelectMany: html is of wrong type.");
            return;
        }
        html.find(".btn-submit").on("click", (evt) => {
            const select = html.find('select[name="selectedOption"]').get()[0];
            const selectedOptions = this.object.options.filter((o, idx) => this.selectedIndices.includes(idx));
            if (this.submitCallback) {
                console.log('Calling submit callback with ', selectedOptions);
                this.submitCallback(selectedOptions);
            }
            this.close();
        });
    }

    protected _updateObject(
        event: Event | JQuery.Event,
        formData: object
    ): Promise<any> {
        this.selectedIndices = [];
        for (let i = 0; i < this.object.options.length; i++) {
            const data = formData[`option.${i}`];
            if (data === true) {
                this.selectedIndices.push(i);
            }
        }
        this.render();
        return Promise.resolve();
    }
}
