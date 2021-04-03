import {ChargenOption, Choice, ChoiceType} from '../../models/items/chargen';
import {ChoiceSheet} from './choice-sheet';

export class ChargenSheet {

    public static getChargenData(choices: Array<Choice<ChargenOption>>) {
        const choicesForTemplate = choices.map(choice => ({
            fields: [
                `${choice.choiceType}`,
                `${choice.options?.map(o => o.type)}`,
                `${choice.options?.map(o => o.name)}`,
            ]
        }));
        return {
            choices: choicesForTemplate,
            choicesFields: [
                "splittermond.chargen-choices.choiceType",
                "splittermond.chargen-choices.optionType",
                "splittermond.chargen-choices.optionNames",
            ]
        }
    }

    public static activateChargenListeners(
        html: JQuery<HTMLElement>,
        choices: Array<Choice<ChargenOption>>,
        updateCallback: (choices: Array<Choice<ChargenOption>>) => void
    ): void {
        html.find('.chargen-item-edit').on('click', (evt) => {
            const dataset = (evt?.currentTarget as HTMLElement | undefined)?.dataset;
            if (!dataset) {
                return;
            }
            const operation = dataset['chargenOperation'];
            const index = dataset['chargenChoice'];
            if (operation === 'add') {
                ChargenSheet.addChoice(choices, updateCallback);
            }
            if (operation === 'edit' && Number.isNumeric(index)) {
                ChargenSheet.editChoice(choices, +index, updateCallback);
            }
            if (operation === 'delete' && Number.isNumeric(index)) {
                ChargenSheet.deleteChoice(choices, +index, updateCallback);
            }
        });
    }

    private static addChoice(choices: Array<Choice<ChargenOption>>, updateCallback: (choices: Array<Choice<ChargenOption>>) => void): void {
        choices.push({
            choiceType: ChoiceType.FixedValue,
            options: []
        });
        ChargenSheet.openChoiceSheet(choices, choices.length - 1, updateCallback);
    }

    private static editChoice(choices: Array<Choice<ChargenOption>>, index: number, updateCallback: (choices: Array<Choice<ChargenOption>>) => void): void {
        ChargenSheet.openChoiceSheet(choices, index, updateCallback);
    }

    private static deleteChoice(choices: Array<Choice<ChargenOption>>, index: number, updateCallback: (choices: Array<Choice<ChargenOption>>) => void): void {
        choices.splice(index, 1);
        updateCallback(choices);
    }

    private static openChoiceSheet(choices, index: number, updateCallback: (choices: Array<Choice<ChargenOption>>) => void): void {
        const choice = choices[index];
        new ChoiceSheet(choice, {}, (data) => {
            updateCallback(choices);
        }).render(true);
    }
}
