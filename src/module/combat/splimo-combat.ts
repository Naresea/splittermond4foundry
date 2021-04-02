import { TickDialog } from "../popups/tick-dialog";
import { ModifierService } from "../services/modifier-service";
import { ModifierType } from "../models/items/modifier";

export class SplimoCombat extends Combat {
  _sortCombatants(a: any, b: any): any {
    const ia = Number.isNumeric(a.initiative) ? a.initiative : -9999;
    const ib = Number.isNumeric(b.initiative) ? b.initiative : -9999;
    let ci = ia - ib;
    if (ci !== 0) return ci;
    let [an, bn] = [a.token?.name || "", b.token?.name || ""];
    let cn = an.localeCompare(bn);
    if (cn !== 0) return cn;
    return a.tokenId - b.tokenId;
  }

  //@ts-ignore
  get turn() {
    return 0;
  }

  //@ts-ignore
  get round() {
    return 0;
  }

  async nextRound(): Promise<void> {
    return this.changeIni();
  }

  async nextTurn(): Promise<void> {
    return;
  }

  async previousRound(): Promise<void> {
    return;
  }

  async previousTurn(): Promise<void> {
    return;
  }

  private async changeIni(): Promise<void> {
    const combatant = this.combatants.sort((a, b) =>
      this._sortCombatants(a, b)
    )[0];
    if (!combatant) {
      console.warn("Next round requested, but no combatants exist!");
      return;
    }
    return this.changeIniForCombatant(combatant);
  }

  public async changeIniForCombatant(
    combatant: any,
    iniModifier?: number
  ): Promise<void> {
    if (iniModifier != null) {
      this.setInitiative(combatant._id, combatant.initiative + iniModifier);
      return;
    }
    const mods = ModifierService.getModifiers(combatant.actor);
    const tickPlus = ModifierService.totalMod(mods, null, {
      modType: ModifierType.TickPlus,
    });
    return new Promise((resolve) => {
      new TickDialog(
        {
          tickPlus: tickPlus ?? 0,
          modifier: 0,
        },
        {},
        (data) => {
          if (data != null) {
            this.setInitiative(
              combatant._id,
              combatant.initiative + data.modifier
            );
          }
          resolve();
        }
      ).render(true);
    });
  }

  public async changeIniForCombatants(
    combatant: Array<any>,
    iniModifier?: number
  ): Promise<void> {
    if (iniModifier != null) {
      combatant.forEach((c) => {
        this.setInitiative(c._id, c.initiative + iniModifier);
      });
      return;
    }
    return new Promise((resolve) => {
      new TickDialog(
        {
          tickPlus: 0,
          modifier: 0,
        },
        {},
        (data) => {
          if (data != null) {
            combatant.forEach((c) => {
              this.setInitiative(c._id, c.initiative + data.modifier);
            });
          }
          resolve();
        }
      ).render(true);
    });
  }
}
