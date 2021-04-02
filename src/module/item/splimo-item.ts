import { AnySplimoItem } from "../models/item-type";

export class SplimoItem extends Item<AnySplimoItem> {
  static get config(): Entity.Config<Item> {
    const conf = super.config;
    conf.embeddedEntities = {
      ...conf.embeddedEntities,
      OwnedItem: "OwnedItem",
    };
    return conf;
  }
}
