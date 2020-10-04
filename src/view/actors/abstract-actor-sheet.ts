import { getRollableSelector } from '../../utils/get-rollable-selector';
import { normalRoll, riskRoll, safeRoll } from '../../utils/rollers';

export abstract class AbstractActorSheet<ActorDataType, ViewData extends ActorDataType> extends ActorSheet<
    ActorDataType,
    Actor<ActorDataType>
> {
    public abstract getViewData(actor: Actor<ActorDataType>): ViewData;

    public abstract updateViewData(
        formData: Record<string, any>,
        actor: Actor<ActorDataType>
    ): Promise<Record<string, any>>;

    public registerEventHandlers(html: JQuery<HTMLElement>): void {
        console.log('ActorSheet: registering event handlers...');
    }

    /** @override */
    public getData(): ActorSheetData<ActorDataType> {
        const actorSheetData = super.getData();
        actorSheetData.data.data = this.getViewData(this.actor);
        return actorSheetData;
    }

    /** @override */
    protected async _updateObject(event: Event | JQuery.Event, formData: FormData): Promise<unknown> {
        const updateData = await this.updateViewData(formData, this.actor);
        return super._updateObject(event, updateData);
    }

    /** @override */
    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        const isJQuery = (e: JQuery | HTMLElement): e is JQuery => (e as { find: unknown }).find != null;
        if (isJQuery(html)) {
            this.registerEventHandlers(html);
            html.find(getRollableSelector()).on('click', (evt) => {
                evt.preventDefault();
                const rollData: string | undefined = evt.currentTarget?.dataset?.roll;
                if (rollData == null) {
                    return;
                }
                const rollValue = +rollData;
                if (isNaN(rollValue)) {
                    return;
                }

                const roll = (formula: string, isRisk: boolean, isSafety: boolean, isNormal: boolean) => {
                    const activeRoll = new Roll(formula);
                    const rollResult = activeRoll.roll();

                    console.log('Roll result: ', rollResult);
                    console.log('ActiveRoll: ', activeRoll);

                    const diceResults: Array<number> = rollResult.dice[0].results ?? [];
                    const diceAsc = diceResults.sort((a, b) => a - b);
                    const diceDesc = diceResults.sort((a, b) => b - a);
                    const isFail = diceAsc[0] + diceAsc[1] <= 3;
                    const isCrit = diceDesc[0] + diceDesc[1] >= 19;

                    const critSuccess = isSafety ? false : isRisk ? !isFail && isCrit : isCrit;
                    const critFail = isSafety ? false : isFail;

                    const flavor = critFail ? 'Critical Fail' : critSuccess ? 'Critical Success' : '';

                    const chatData = {
                        speaker: ChatMessage.getSpeaker({
                            actor: this.actor,
                        }),
                        flavor,
                    };
                    void rollResult.toMessage(chatData);
                };

                const rollTypeDialog = new Dialog({
                    title: game.i18n.localize('Splittermond.View.AbstractActorSheet.rollTypeDialog.title'),
                    content: `<p>${game.i18n.localize(
                        'Splittermond.View.AbstractActorSheet.rollTypeDialog.content'
                    )}</p>`,
                    buttons: {
                        safety: {
                            icon: '<i class="fas fa-lock"></i>',
                            label: game.i18n.localize(
                                'Splittermond.View.AbstractActorSheet.rollTypeDialog.buttons.safety'
                            ),
                            callback: () => roll(safeRoll(rollValue), false, true, false),
                        },
                        normal: {
                            icon: '<i class="fas fa-check"></i>',
                            label: game.i18n.localize(
                                'Splittermond.View.AbstractActorSheet.rollTypeDialog.buttons.normal'
                            ),
                            callback: () => roll(normalRoll(rollValue), false, false, true),
                        },
                        risk: {
                            icon: '<i class="fas fa-exclamation-circle"></i>',
                            label: game.i18n.localize(
                                'Splittermond.View.AbstractActorSheet.rollTypeDialog.buttons.risk'
                            ),
                            callback: () => roll(riskRoll(rollValue), true, false, false),
                        },
                    },
                    default: 'normal',
                });
                rollTypeDialog.render(true);
            });
        }
    }
}
