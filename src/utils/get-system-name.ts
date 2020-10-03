export function getSystemName(): string {
    const systemName: unknown | undefined = game?.system?.data?.name;
    if (!systemName || typeof systemName !== 'string') {
        return 'UNKNOWN_SYSTEM';
    } else {
        return systemName;
    }
}
