import {ATTRIBUTES} from '../models/actors/attributes';
import {DERIVED_ATTRIBUTES} from '../models/actors/derived-attributes';

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

    Handlebars.registerHelper('prefix', (prefix: string, values: Array<string>, ctx): Array<string> => {
        const vals = values.filter(s => typeof s === 'string');
        return vals.map(v => prefix + v);
    });

    Handlebars.registerHelper('attrNames', (options) => {
        const base: Array<string> = [];
        if (!options) {
            return base;
        }
        if (options.hash['base'] === true) {
            base.push(...ATTRIBUTES);
        }
        if (options.hash['derived']) {
            base.push(...DERIVED_ATTRIBUTES);
        }
        if (options.hash['includeGK'] == null || options.hash['includeGK'] === false) {
            return base.filter(v => v !== 'GK');
        }
        return base;
    });
}
