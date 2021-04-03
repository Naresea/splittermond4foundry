import {ItemType} from '../models/item-type';
import {
    Chargen,
    ChargenOption,
    ChargenOptionType,
    Choice,
    ChoiceType,
    FixedValueChoice,
    SelectOneOfChoice
} from '../models/items/chargen';
import {ATTRIBUTES} from '../models/actors/attributes';
import {DERIVED_ATTRIBUTES} from '../models/actors/derived-attributes';
import {Resource} from '../models/items/resource';
import {Fertigkeit} from '../models/items/fertigkeit';
import {ChargenSelectOne} from '../popups/chargen-select-one';

export class ChargenService {

    public static readonly CHARGEN_ITEM_TYPES: Array<ItemType> = [
        ItemType.Rasse, ItemType.Kultur, ItemType.Abstammung, ItemType.Ausbildung
    ];

    public static async applyChargenData(actor: Actor, chargenItem: Item<any>): Promise<void> {
        if (!ChargenService.CHARGEN_ITEM_TYPES.includes(chargenItem.type as any)) {
            return;
        }

        const data = chargenItem.data.data as Chargen;
        const sorted = data.choices.reduce((accu, choice) => {
            const arr = accu.get(choice.choiceType) ?? [];
            arr.push(choice);
            accu.set(choice.choiceType, arr);
            return accu;
        }, new Map<ChoiceType, Array<Choice<ChargenOption>>>());

        await ChargenService.applyFixed(actor, sorted.get(ChoiceType.FixedValue) ?? []);
        await ChargenService.applySelectOne(actor, sorted.get(ChoiceType.SelectOneOf) ?? []);
        await ChargenService.applySelectMany(actor, sorted.get(ChoiceType.SelectNOf) ?? []);
        await ChargenService.applyDistributePoints(actor, sorted.get(ChoiceType.DistributePoints) ?? []);
        await ChargenService.applyMatchMultiple(actor, sorted.get(ChoiceType.MatchMultiple) ?? []);
    }

    private static async applyFixed(actor: Actor, choices: Array<Choice<ChargenOption>>): Promise<void> {
        const fixedChoices = choices as Array<FixedValueChoice<ChargenOption>>;
        const options = fixedChoices.map(choice => choice.options).reduce((accu, curr) => {
            accu.push(...curr);
            return accu;
        }, []);
        return this.applySelectedOptions(actor, options);
    }

    private static async applySelectOne(actor: Actor, choices: Array<Choice<ChargenOption>>): Promise<void> {
        const selectOneChoices = choices as Array<SelectOneOfChoice<ChargenOption>>;
        const selectedOptions = await Promise.all(selectOneChoices.map(choice => {
            return new Promise((resolve) => {
                new ChargenSelectOne(choice, {}, (option) => resolve(option)).render(true)
            });
        })) as Array<ChargenOption | undefined>;
        await this.applySelectedOptions(actor, selectedOptions.filter(o => o != null));
    }

    private static async applySelectMany(actor: Actor, choices: Array<Choice<ChargenOption>>): Promise<void> {

    }

    private static async applyDistributePoints(actor: Actor, choices: Array<Choice<ChargenOption>>): Promise<void> {

    }

    private static async applyMatchMultiple(actor: Actor, choices: Array<Choice<ChargenOption>>): Promise<void> {

    }

    private static async applySelectedOptions(actor: Actor, chargenOptions: Array<ChargenOption>): Promise<void> {
        const data = await Promise.all(chargenOptions.map((option: ChargenOption) =>
            ChargenService.applyChargenOption(actor, option)
        ));
        await actor.updateEmbeddedEntity('OwnedItem', data.filter(d => d != null));
    }

    private static applyChargenOption(actor: Actor, chargenOption: ChargenOption): Promise<any | undefined> {
        if (chargenOption.type === ChargenOptionType.Attribute) {
            return ChargenService.applyAttribute(actor, chargenOption);
        }
        if (chargenOption.type === ChargenOptionType.Mastery) {
            return ChargenService.addToActor(actor, chargenOption, ItemType.Meisterschaft);
        }
        if (chargenOption.type === ChargenOptionType.Resource) {
            return ChargenService.applyPoints(actor, chargenOption, ItemType.Resource);
        }
        if (chargenOption.type === ChargenOptionType.Skill) {
            return ChargenService.applyPoints(actor, chargenOption, ItemType.Fertigkeit);
        }
        if (chargenOption.type === ChargenOptionType.Strength) {
            return ChargenService.addToActor(actor, chargenOption, ItemType.Staerke);
        }
        if (chargenOption.type === ChargenOptionType.Weakness) {
            return ChargenService.addToActor(actor, chargenOption, ItemType.Schwaeche);
        }
    }

    private static applyAttribute(actor: Actor, chargenOption: ChargenOption): Promise<any | undefined> {
        const name = chargenOption.name;
        const points = chargenOption.points;
        if ([...ATTRIBUTES, ...DERIVED_ATTRIBUTES].includes(name as any) && points != null) {
            actor.data.data[name] += points;
            return actor.update({
                _id: actor._id,
                data: {
                    [name]: actor.data.data[name]
                }
            }).then(() => undefined);
        }
    }

    private static applyPoints(actor: Actor, chargenOption: ChargenOption, type: ItemType): Promise<any | undefined> {
        const name = chargenOption.name;
        if (name == null || name.length < 1) {
            return Promise.resolve(undefined);
        }
        return ChargenService.findItem<Resource | Fertigkeit>(actor, type, name).then(i => {
            if (i) {
                i.data.data.punkte += chargenOption.points;
                return {
                    _id: i._id,
                    data: {
                        punkte: i.data.data.punkte
                    }
                };
            }
            return Promise.resolve(undefined);
        });
    }

    private static addToActor(actor: Actor, chargenOption: ChargenOption, type: ItemType): Promise<any | undefined> {
        const name = chargenOption.name;
        if (name == null || name.length < 1) {
            return Promise.resolve(undefined);
        }
        return ChargenService.findItem(actor, type, name).then(() => undefined);
    }

    private static findItem<T>(actor: Actor, type: ItemType, name: string): Promise<Item<T> | undefined> {
        const actorOwnedItem = actor.items.find(i => i.type === type && i.name === name);
        if (actorOwnedItem) {
            return Promise.resolve(actorOwnedItem as Item<T>);
        }
        const globalItem = game.items.find(i => i.type === type && i.name === name);
        if (globalItem) {
            // create a copy of the global item for the current actor
            return actor.createOwnedItem({
                type: globalItem.type,
                name: globalItem.name,
                data: globalItem.data
            }).then(i => {
                return i;
            });
        }
        return Promise.resolve(undefined);
    }
}
