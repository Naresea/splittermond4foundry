import {SplimoItemSheet} from '../splimo-item-sheet';
import {Zauber} from '../../models/items/zauber';

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
        const erschoepft = this.item.data.data.fokusErschoepft;
        const kanalisiert = this.item.data.data.fokusKanalisiert;
        const verzehrt = this.item.data.data.fokusVerzehrt;

        (data.data as any).parsed = {
            reichweite: this.item.data.data.reichweiteString,
            zauberdauer: this.item.data.data.zauberDauerString,
            fokus: `${erschoepft ? erschoepft : ''}${kanalisiert ? `K${kanalisiert}` : ''}${verzehrt ? `V${verzehrt}` : ''}`,
            schwierigkeit: this.item.data.data.schwierigkeitString
        };

        return data;
    }

    protected _updateObject(event: Event | JQuery.Event, formData: any): Promise<any> {
        const schwierigkeit = formData['data.schwierigkeit'];
        const zauberdauer = formData['data.zauberdauer'];
        const fokus = formData['data.fokus'];
        const reichweite = formData['data.reichweite'];

        formData['data.schwierigkeitString'] = schwierigkeit;
        formData['data.schwierigkeit'] = Number.isNumeric(schwierigkeit) ? +schwierigkeit : -1;
        formData['data.zauberDauerString'] = zauberdauer;
        formData['data.ticks'] = Number.isNumeric(zauberdauer) ? +zauberdauer : -1;
        formData['data.reichweiteString'] = reichweite;
        formData['data.reichweite'] = Number.isNumeric(reichweite.replace(/\s*m$/, ''))
            ? +reichweite.replace(/\s*m$/, '') : -1;

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
        delete formData['data.zauberdauer'];
        return super._updateObject(event, formData);
    }
}
