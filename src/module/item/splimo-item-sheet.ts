import { AnySplimoItem } from "../models/item-type";

export abstract class SplimoItemSheet<
  T extends AnySplimoItem
> extends ItemSheet<T> {
  protected activateListeners(html: JQuery<HTMLElement>): void {
    super.activateListeners(html);
    // ignore: TS types not yet available
    // @ts-ignore
    const dragDrop = new DragDrop({
      dragSelector: ".item",
      dropSelector: ".items",
      permissions: {
        dragstart: this._canDragStart.bind(this),
        drop: this._canDragDrop.bind(this),
      },
      callbacks: {
        dragstart: this._onDragStart.bind(this),
        drop: this._onDragDrop.bind(this),
      },
    });
    const htmlElement = html.get()[0];
    console.log("Binding drag&drop to HTML: ", { htmlElement });
    // @ts-ignore
    dragDrop.bind(htmlElement);
  }

  protected _canDragStart(selector: string): boolean {
    console.log("Can Drag start: ", selector);
    return true;
  }

  protected _canDragDrop(selector: string): boolean {
    console.log("Can drag drop: ", selector);
    return true;
  }

  protected _onDragStart(event: DragEvent): void {
    console.log("OnDragStart: ", event);
    super._onDragStart(event);
  }

  protected _onDragDrop(event: DragEvent): void {
    console.log("OnDragDrop:", event);
  }
}
