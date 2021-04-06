import {Portrait} from '../../models/portrait';

export interface PortraitListener {
    getPortraitSource(): Partial<Portrait> | undefined;
    savePortraitTransform(port: Required<Portrait>): void;
}

export class PortraitSheet {

    private static readonly moveSpeedPx = 5;
    private static readonly zoomSpeed = 0.1;

    public static activatePortraitListener(htmlElem: JQuery<HTMLElement> | HTMLElement, portraitListener: PortraitListener): void {
        const html = htmlElem instanceof HTMLElement ? $(htmlElem) : htmlElem;
        html.on('click', '.portrait > .portrait-move-icon', (evt) => {
            const dataset = (evt.currentTarget as HTMLElement)?.dataset;
            if (!dataset || !dataset['move']) {
                return;
            }
            const dataMove = dataset['move'];
            switch (dataMove) {
                case 'up':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.transformY(
                            portraitListener,
                            -PortraitSheet.moveSpeedPx
                        )
                    );
                    break;
                case 'down':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.transformY(
                            portraitListener,
                            PortraitSheet.moveSpeedPx
                        )
                    );
                    break;
                case 'left':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.transformX(
                            portraitListener,
                            -PortraitSheet.moveSpeedPx
                        )
                    );
                    break;
                case 'right':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.transformX(
                            portraitListener,
                            PortraitSheet.moveSpeedPx
                        )
                    );
                    break;
                case 'zoomIn':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.scale(
                            portraitListener,
                            PortraitSheet.zoomSpeed
                        )
                    );
                    break;
                case 'zoomOut':
                    portraitListener.savePortraitTransform(
                        PortraitSheet.scale(
                            portraitListener,
                            -PortraitSheet.zoomSpeed
                        )
                    );
                    break;
            }
        });
    }

    private static getPortrait(portraitListener: PortraitListener): Required<Portrait> {
        const info = portraitListener.getPortraitSource();
        return {
            iconScale: info.iconScale ?? 1,
            iconPosY: info.iconPosY ?? 0,
            iconPosX: info.iconPosX ?? 0
        };
    }

    private static transformX(portraitListener: PortraitListener, value: number): Required<Portrait> {
        const p = PortraitSheet.getPortrait(portraitListener);
        p.iconPosX += value;
        return p;
    }

    private static transformY(portraitListener: PortraitListener, value: number): Required<Portrait> {
        const p = PortraitSheet.getPortrait(portraitListener);
        p.iconPosY += value;
        return p;
    }

    private static scale(portraitListener: PortraitListener, value: number): Required<Portrait> {
        const p = PortraitSheet.getPortrait(portraitListener);
        p.iconScale = Math.max(0.1, p.iconScale + value);
        return p;
    }
}
