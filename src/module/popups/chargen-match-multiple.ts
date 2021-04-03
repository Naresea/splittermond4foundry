import {ChargenOption, MatchMultipleChoice} from '../models/items/chargen';

export class ChargenMatchMultiple extends FormApplication<MatchMultipleChoice<ChargenOption>> {

    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["splittermond"],
            template:
                "systems/splittermond/templates/sheets/popups/chargen-match-multiple.hbs",
            width: 512,
            height: 512,
            submitOnChange: false,
            submitOnClose: false,
            closeOnSubmit: false,
            editable: true,
        });
    }

    private readonly submitCallback;
    private confirmedMatches: Array<ChargenOption> = [];
    private confirmedPointsIndices: Array<number> = [];

    constructor(
        object?: MatchMultipleChoice<ChargenOption>,
        options?: FormApplication.Options,
        submit?: (formData: ChargenOption | undefined) => void
    ) {
        super(object, options);
        this.submitCallback = submit;
    }

    getData(opt?: object): any | Promise<any> {

        const options = this.object.options
            .map((opt, idx) => ({
                option: opt,
                label:  `${opt.type} ${opt.name}${opt.points ? ` (${opt.points})` : ''}`,
                value: idx
            })).filter(opt => !this.confirmedMatches.includes(opt.option));

        const pointOptions = this.object.pointOptions
            .map((pt, idx) => ({
                value: idx,
                label: `${pt}`
            }))
            .filter(pt => !this.confirmedPointsIndices.includes(pt.value));

        const confirmed = this.confirmedMatches.map(cm => ({
            fields: [
                `${cm.type}`,
                `${cm.name}`,
                `${cm.points}`
            ]
        }));
        const confirmedHeaders = [
            "splittermond.chargen-match-multiple.header-type",
            "splittermond.chargen-match-multiple.header-name",
            "splittermond.chargen-match-multiple.header-points",
        ];

        const canSubmit = this.confirmedMatches.length === Math.min(this.object.pointOptions.length, this.object.options.length);

        return {
            canSubmit,
            confirmed,
            confirmedHeaders,
            pointOptions,
            options
        };
    }

    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        if (html instanceof HTMLElement) {
            console.error("ChargenMatchMultiple: html is of wrong type.");
            return;
        }
        html.find(".btn-submit").on("click", (evt) => {
            const selectedOptions = this.confirmedMatches.filter(o => o.points != null && o.points !== 0);

            if (this.submitCallback) {
                console.log('Calling submit callback with ', selectedOptions);
                this.submitCallback(selectedOptions);
            }
            this.close();
        });

        html.find(".btn-match-multiple-match").on("click", (evt) => {

            const selectedKey = html.find('input[name="keys"]:checked').get()[0];
            const selectedPoints = html.find('input[name="points"]:checked').get()[0];

            console.log('Found inputs: ', {selectedKey, selectedPoints});

            if (!selectedKey || !selectedPoints) {
                return;
            }

            const pointIndex = +(selectedPoints as HTMLInputElement).value;
            const optionIndex = +(selectedKey as HTMLInputElement).value;
            const option = this.object.options[optionIndex];
            const point = this.object.pointOptions[pointIndex];
            if (option && point) {
                option.points = +point;
                this.confirmedMatches.push(option);
                this.confirmedPointsIndices.push(pointIndex);
            }
            console.log('Applied ', {option, point});
            this.render();
        });
    }

    protected _updateObject(
        event: Event | JQuery.Event,
        formData: object
    ): Promise<any> {
        return Promise.resolve();
    }
}
