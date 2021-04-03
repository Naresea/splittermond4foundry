import {ChargenOption, ChargenOptionType, Choice, MatchMultipleChoice} from '../../models/items/chargen';
import {ChargenOptionsSheet} from './chargen-options-sheet';

export class ChoiceSheet extends FormApplication<Choice<ChargenOption>> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["splittermond"],
            template: "systems/splittermond/templates/sheets/item/choice-sheet.hbs",
            width: 512,
            height: 766,
            tabs: [],
            submitOnChange: true,
            submitOnClose: true,
            closeOnSubmit: false,
            editable: true,
        });
    }

    private readonly update;

    constructor(
        object?: Choice<ChargenOption>,
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
                "splittermond.chargen.typelabels.FixedValue",
                "splittermond.chargen.typelabels.SelectOneOf",
                "splittermond.chargen.typelabels.SelectNOf",
                "splittermond.chargen.typelabels.DistributePoints",
                "splittermond.chargen.typelabels.MatchMultiple",
            ],
            availableTypes: [
                "FixedValue",
                "SelectOneOf",
                "SelectNOf",
                "DistributePoints",
                "MatchMultiple",
            ],
            optionFields: [
                "splittermond.chargen-choices.optionType",
                "splittermond.chargen-choices.optionNames",
                "splittermond.chargen-choices.points",
            ],
            pointOptions: ((this.object as MatchMultipleChoice<ChargenOption>).pointOptions ?? []).join(', '),
            optionsTable: this.object.options.map((op) => ({
                fields: [
                    `${op.type}`,
                    `${op.name}`,
                    `${op.points ?? 0}`
                ]
            })),
        };
    }

    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        if (html instanceof HTMLElement) {
            return;
        }
        html.find(".choice-options .add-item").on('click', (evt) => {
            this.addChoice(evt);
        });
        html.find(".choice-options .edit-item").on('click', (evt) => {
            this.editChoice(evt);
        });
        html.find(".choice-options .delete-item").on('click', (evt) => {
            this.deleteChoice(evt);
        });
    }

    protected _updateObject(
        event: Event | JQuery.Event,
        formData: any
    ): Promise<any> {
        console.log('CHARGEN ChoiceSheet: updateObject');
        return this.doUpdate(formData);
    }

    private doUpdate(formData: any): Promise<any> {
        this.object.choiceType = formData.choiceType ?? this.object.choiceType;
        (this.object as any).numN = formData.numN ?? (this.object as any).numN;
        (this.object as any).numPoints = formData.numPoints ?? (this.object as any).numPoints;
        (this.object as any).pointOptions = this.parsePointOptions(formData.pointOptions) ?? (this.object as any).pointOptions;
        this.render();
        console.log('CHARGEN ChoiceSheet: calling update', {formData});
        return this.update
            ? this.update(formData as any)
            : Promise.reject("No update defined.");
    }

    private parsePointOptions(opts: string | undefined): Array<number> | undefined {
        return opts?.split(',')
            .map(s => s.trim())
            .map(s => Number.isNumeric(s) ? +s : undefined)
            .filter(s => s != null);
    }

    private addChoice(evt: JQuery.ClickEvent<any, undefined, any, any>): void {
        if (!evt || !evt.currentTarget || !evt.currentTarget.dataset) {
            return;
        }
        const opt: ChargenOption = {
            type: ChargenOptionType.Attribute,
            name: ''
        };
        this.object.options.push(opt);
        this.openChargenOptionSheet(this.object.options, this.object.options.length - 1);
    }

    private editChoice(evt: JQuery.ClickEvent<any, undefined, any, any>): void {
        if (!evt || !evt.currentTarget || !evt.currentTarget.dataset) {
            return;
        }
        const idx = evt.currentTarget.dataset['index'];
        if (Number.isNumeric(idx)) {
            this.openChargenOptionSheet(this.object.options, +idx);
        }
    }

    private deleteChoice(evt: JQuery.ClickEvent<any, undefined, any, any>): void {
        if (!evt || !evt.currentTarget || !evt.currentTarget.dataset) {
            return;
        }
        const idx = evt.currentTarget.dataset['index'];
        if (Number.isNumeric(idx)) {
            this.object.options.splice(idx, 1);
        }
    }

    private openChargenOptionSheet(options: Array<ChargenOption>, index: number): void {
        const opt = options[index];
        new ChargenOptionsSheet(opt, {}, (data) => {
            console.log('CHARGEN ChoiceSheet: doUpdate ', {data, options});
            this.doUpdate({
                'options': [...options]
            });
        }).render(true);
    }
}
