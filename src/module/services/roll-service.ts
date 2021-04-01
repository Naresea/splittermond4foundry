export class RollService {

    public static roll(evt: Event, actor: Actor): void {
        const target = evt?.currentTarget;
        const dataset = (target as HTMLElement | undefined)?.dataset;
        const rollModifier = dataset?.roll;
        const altKey = (evt as MouseEvent | undefined)?.altKey;
        const shiftKey = (evt as MouseEvent | undefined)?.shiftKey;
        const ctrlKey = (evt as MouseEvent | undefined)?.ctrlKey;

        if (rollModifier == null || !Number.isNumeric(rollModifier)) {
            return;
        }
        const formula = shiftKey
            ? RollService.riskRoll(+rollModifier)
            : ctrlKey
                ? RollService.safeRoll(+rollModifier)
                : RollService.standardRoll(+rollModifier);

        const roll = new Roll(formula, actor.data.data);
        const result = roll.evaluate();
        RollService.evaluateResult(result, ctrlKey, actor);
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

    private static evaluateResult(roll: Roll, safe: boolean, actor): void {
        const dice = roll.dice;
        const values = dice[0].results.map(r => r.result).sort((a, b) => a - b);
        console.log('Values: ', values);

        if (safe) {
            RollService.result(roll, actor);
            return;
        }
        if (RollService.isCritFail(values)) {
            RollService.critFail(roll, actor);
            return;
        }
        if (RollService.isCritSuccess(values)) {
            RollService.critSuccess(roll, actor);
            return;
        }
        RollService.result(roll, actor);
    }

    private static isCritFail(sortedValues: Array<number>): boolean {
        return sortedValues[0] + sortedValues[1] <= 3;
    }

    private static isCritSuccess(sortedValues: Array<number>): boolean {
        return sortedValues[sortedValues.length - 1] + sortedValues[sortedValues.length - 2] >= 19;
    }

    private static critFail(roll: Roll, actor: Actor): void {
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({actor}),
            flavor: 'CRIT FAIL!'
        });
    }

    private static critSuccess(roll: Roll, actor: Actor): void {
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({actor}),
            flavor: 'CRIT SUCCESS!'
        });
    }

    private static result(roll: Roll, actor: Actor): void {
        roll.toMessage({
            speaker: ChatMessage.getSpeaker({actor})
        });
    }
}
