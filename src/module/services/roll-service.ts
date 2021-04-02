import {DiceRollDialog} from '../popups/dice-roll-dialog';
import {RollInfo} from './player-data-service';
import {changeInitiative} from '../macros/setup-macro-helpers';
import {CalculationService} from './calculation-service';
import {PlayerCharacter} from '../models/actors/player-character';
import {NonPlayerCharacter} from '../models/actors/non-player-character';

interface RollInfoExtended extends RollInfo {
    rollType?: 'sicherheit' | 'risiko' | 'standard'
}

export class RollService {

    public static roll(evt: Event, actor: Actor): void {
        const target = evt?.currentTarget;
        const dataset = (target as HTMLElement | undefined)?.dataset;
        const rollModifier = dataset?.roll;
        const rollInfo: RollInfoExtended = JSON.parse(dataset.rollInfo ?? '{}');

        const altKey = (evt as MouseEvent | undefined)?.altKey;
        const shiftKey = (evt as MouseEvent | undefined)?.shiftKey;
        const ctrlKey = (evt as MouseEvent | undefined)?.ctrlKey;

        if (rollModifier == null || !Number.isNumeric(rollModifier)) {
            return;
        }

        if (!altKey) {
            new DiceRollDialog({rollType: 'sicherheit', modifier: 0}, {}, (data) => {
                const isSicherheit = data.rollType === 'sicherheit';
                const isRisiko = data.rollType === 'risiko';
                const extraMod = data.modifier ?? 0;
                RollService.doRoll(isRisiko, isSicherheit, +rollModifier + extraMod, actor, rollInfo);
                return Promise.resolve();
            }).render(true);
        } else {
            RollService.doRoll(shiftKey, ctrlKey, +rollModifier, actor, rollInfo);
        }
    }

    private static doRoll(isRisiko: boolean, isSicherheit: boolean, rollModifier: number, actor: Actor, rollInfo: RollInfoExtended): void {
        const formula = isRisiko
            ? RollService.riskRoll(+rollModifier)
            : isSicherheit
                ? RollService.safeRoll(+rollModifier)
                : RollService.standardRoll(+rollModifier);

        rollInfo.rollType = isSicherheit ? 'sicherheit' : isRisiko ? 'risiko' : 'standard';

        const roll = new Roll(formula, actor.data.data);
        const result = roll.evaluate();
        RollService.evaluateResult(result, isSicherheit, actor, rollInfo);
    }

    public static rollInitiative(evt: Event, actor: Actor): void {
        const target = evt?.currentTarget;
        const dataset = (target as HTMLElement | undefined)?.dataset;
        const rollModifier = dataset?.roll;

        if (rollModifier == null || !Number.isNumeric(rollModifier)) {
            return;
        }
        const formula = `${rollModifier} - 1d6`;

        const roll = new Roll(formula, actor.data.data);
        const result = roll.evaluate();
        RollService.result(result, actor);
    }

    private static riskRoll(mod: number): string {
        return `4d10kh2 + ${mod}`;
    }

    private static safeRoll(mod: number): string {
        return `2d10kh1 + ${mod}`;
    }

    private static standardRoll(mod: number): string {
        return `2d10 + ${mod}`;
    }

    private static evaluateResult(roll: Roll, safe: boolean, actor: Actor, rollInfo: RollInfoExtended): void {
        const dice = roll.dice;
        const values = dice[0].results.map(r => r.result).sort((a, b) => a - b);

        if (safe) {
            RollService.result(roll, actor, rollInfo);
            return;
        }
        if (RollService.isCritFail(values)) {
            RollService.critFail(roll, actor, rollInfo);
            return;
        }
        if (RollService.isCritSuccess(values)) {
            RollService.critSuccess(roll, actor, rollInfo);
            return;
        }
        RollService.result(roll, actor, rollInfo);
    }

    private static isCritFail(sortedValues: Array<number>): boolean {
        return sortedValues[0] + sortedValues[1] <= 3;
    }

    private static isCritSuccess(sortedValues: Array<number>): boolean {
        return sortedValues[sortedValues.length - 1] + sortedValues[sortedValues.length - 2] >= 19;
    }

    private static async getMessageContent(roll: Roll, actor: Actor, rollInfo?: RollInfoExtended, critSuccess?: boolean, critFail?: boolean): Promise<string | undefined> {
        if (!rollInfo) {
            return undefined;
        }
        const partial = Handlebars.partials['systems/splittermond/templates/sheets/roll-result.hbs'];
        const renderedRoll = await roll.render();
        const rollData = {
            roll: renderedRoll,
            actor,
            critSuccess,
            critFail,
            ...rollInfo
        };
        return partial(rollData);
    }

    private static critFail(roll: Roll, actor: Actor, rollInfo?: RollInfoExtended): void {
        this.getMessageContent(roll, actor, rollInfo, false, true)
            .then((content) => {
                roll.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    content
                });
            });
    }

    private static critSuccess(roll: Roll, actor: Actor, rollInfo?: RollInfoExtended): void {
        this.getMessageContent(roll, actor, rollInfo, true, false)
            .then((content) => {
                roll.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    content
                });
            });
    }

    private static result(roll: Roll, actor: Actor, rollInfo?: RollInfoExtended): void {
        this.getMessageContent(roll, actor, rollInfo, false, false)
            .then((content) => {
                roll.toMessage({
                    speaker: ChatMessage.getSpeaker({actor}),
                    content
                });
            });
    }

    static chatMessageRendered(message: ChatMessage, html: JQuery<HTMLElement>, messageData: any): void {
        console.log('RENDERED: ', {
            message,
            html,
            messageData
        });
        html.find('.tick-button').on('click', (evt) => {
            const ticks = (evt.currentTarget as HTMLElement).dataset['splimoBtnData'];
            const actorId = (evt.currentTarget as HTMLElement).dataset['splimoActorId'];
            if (Number.isNumeric(ticks) && actorId != null) {
                changeInitiative(+ticks, undefined, actorId);
            }
        });
        html.find('.damage-button').on('click', (evt) => {
            const dmg = (evt.currentTarget as HTMLElement).dataset['splimoBtnData'];
            new Roll(dmg).evaluate().toMessage();
        });
        html.find('.fokus-button').on('click', (evt) => {
            const fokus = (evt.currentTarget as HTMLElement).dataset['splimoBtnData'];
            const actorId = (evt.currentTarget as HTMLElement).dataset['splimoActorId'];
            if (fokus && actorId) {
                const { erschoepft, kanalisiert, verzehrt } = CalculationService.fromEKVString(fokus);
                const actor = game.actors.find(a => a.id === actorId);
                if (actor) {
                    actor.update({
                        _id: actor.id,
                        data: {
                            fokusErschoepft: (actor as Actor<PlayerCharacter | NonPlayerCharacter>).data.data.fokusErschoepft + erschoepft,
                            fokusKanalisiert: (actor as Actor<PlayerCharacter | NonPlayerCharacter>).data.data.fokusKanalisiert + kanalisiert,
                            fokusVerzehrt: (actor as Actor<PlayerCharacter | NonPlayerCharacter>).data.data.fokusVerzehrt + verzehrt,
                        }
                    })
                }
            }
        });
        html.find('.tick-explanation-label').on('click', (evt) => {
            const text = html.find('.tick-explanation-text');
            if (text.hasClass('tick-explanation-text--active')) {
                text.removeClass('tick-explanation-text--active');
            } else {
                text.addClass('tick-explanation-text--active');
            }
        });
        html.find('.explanation-label').on('click', (evt) => {
            const text = html.find('.explanation-text');
            if (text.hasClass('explanation-text--active')) {
                text.removeClass('explanation-text--active');
            } else {
                text.addClass('explanation-text--active');
            }
        });
    }
}
