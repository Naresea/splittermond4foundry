export abstract class AbstractItemSheet<ItemDataType, ViewData extends ItemDataType> extends ItemSheet<
    ItemDataType,
    Item<ItemDataType>
> {
    public abstract getViewData(item: Item<ItemDataType>): ViewData;

    public abstract updateViewData(formData: FormData, item: Item<ItemDataType>): Promise<void>;

    public registerEventHandlers(html: JQuery<HTMLElement>): void {
        console.log('ItemSheet: registering event handlers...');
    }

    /** @override */
    public getData(): ItemSheetData<ItemDataType> {
        const itemSheetData = super.getData();
        itemSheetData.data.data = this.getViewData(this.item);
        return itemSheetData;
    }

    /** @override */
    protected async _updateObject(event: Event | JQuery.Event, formData: FormData): Promise<unknown> {
        await this.updateViewData(formData, this.item);
        return super._updateObject(event, formData);
    }

    /** @override */
    protected activateListeners(html: JQuery<HTMLElement>): void {
        super.activateListeners(html);
        this.registerEventHandlers(html);
    }
}
