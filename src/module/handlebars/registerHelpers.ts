export function registerHelpers(): void {
    Handlebars.registerHelper('asList', (...values: Array<any>): Array<string> => {
        return values.filter(v => typeof v === 'string');
    });

    Handlebars.registerHelper('getByKey', (object: any, key: string, ctx: any): any => {
        if (!object) {
            return undefined;
        }
        return object[key];
    });

    Handlebars.registerHelper('concat', (...values: Array<string | any>): string => {
       return values.filter(s => typeof s === 'string').join('');
    });
}
