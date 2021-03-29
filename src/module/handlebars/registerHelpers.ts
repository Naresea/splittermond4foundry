export function registerHelpers(): void {
    Handlebars.registerHelper('asList', (...values: Array<any>): Array<string> => {
        return values.filter(v => typeof v === 'string');
    })
}
