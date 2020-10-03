export abstract class AbstractActorSheet<ActorDataType, ViewData extends ActorDataType> extends ActorSheet<
    ActorDataType,
    Actor<ActorDataType>
> {
    public abstract getViewData(actor: Actor<ActorDataType>): ViewData;

    public abstract updateViewData(formData: FormData, actor: Actor<ActorDataType>): Promise<void>;

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
        await this.updateViewData(formData, this.actor);
        return super._updateObject(event, formData);
    }

    /** @override */
    protected activateListeners(html: JQuery<HTMLElement> | HTMLElement): void {
        super.activateListeners(html);
        const isJQuery = (e: JQuery | HTMLElement): e is JQuery => (e as { find: unknown }).find != null;
        if (isJQuery(html)) {
            this.registerEventHandlers(html);
        }
    }
}
