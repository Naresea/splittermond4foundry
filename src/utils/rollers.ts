export function normalRoll(val: number): string {
    return `2d10 + ${val}`;
}

export function riskRoll(val: number): string {
    return `4d10kh2 + ${val}`;
}

export function safeRoll(val: number): string {
    return `2d10kh1 + ${val}`;
}

export function initiativeRoll(val: number): string {
    return `1d6 - ${val}`;
}
