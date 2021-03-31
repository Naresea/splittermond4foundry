import {SplimoItemSheet} from '../splimo-item-sheet';
import {buildFokusString, Zauber} from '../../models/items/zauber';

export class ZauberSheet extends SplimoItemSheet<Zauber> {
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ['splittermond'],
            template: 'systems/splittermond/templates/sheets/item/zauber-sheet.hbs',
            width: 512,
            height: 766,
            tabs: [
                { navSelector: '.sheet-tabs', contentSelector: '.sheet-body', initial: 'details' }
            ]
        });
    }

    getData(): ItemSheet.Data<Zauber> {
        const data = super.getData();

        (data.data as any).parsed = {
            fokus: buildFokusString(this.item.data.data)
        };

        return data;
    }

    protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
        const schwierigkeit = formData['data.schwierigkeitString'];
        const zauberdauer = formData['data.zauberdauerString'];
        const fokus = formData['data.fokus'];
        const reichweite = formData['data.reichweiteString'];
        const bereich = formData['data.bereichString'];
        const wirkungsdauer = formData['data.wirkungsdauerString'];

        formData['data.schwierigkeit'] = Number.isNumeric(schwierigkeit) ? +schwierigkeit : -1;
        formData['data.ticks'] = Number.isNumeric(zauberdauer) ? +zauberdauer : -1;
        formData['data.reichweite'] = Number.isNumeric(reichweite.replace(/\s*m$/, ''))
            ? +reichweite.replace(/\s*m$/, '') : -1;
        formData['data.bereich'] = Number.isNumeric(bereich.replace(/\s*m$/, ''))
            ? +bereich.replace(/\s*m$/, '') : -1;
        formData['data.wirkungsdauer'] = Number.isNumeric(wirkungsdauer) ? +wirkungsdauer : -1;

        if (fokus) {
            const kanalisiertMatch = fokus.match(/[Kk]\d+/);
            const kanalisiert = kanalisiertMatch ? +(kanalisiertMatch[0].replace(/[Kk]/, '')) : 0;

            const verzehrtMatch = fokus.match(/[Vv]\d+/);
            const verzehrt = verzehrtMatch ? +(verzehrtMatch[0].replace(/[Vv]/, '')) : 0;

            const erschoepftMatch = fokus.match(/\d+/);
            const erschoepft = erschoepftMatch ? +(erschoepftMatch[0]) : 0;

            formData['data.fokusKanalisiert'] = kanalisiert;
            formData['data.fokusVerzehrt'] = verzehrt;
            formData['data.fokusErschoepft'] = erschoepft;
        }

        delete formData['data.fokus'];
        return super._updateObject(event, formData);
    }
}
