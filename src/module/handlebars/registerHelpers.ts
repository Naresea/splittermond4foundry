import { ATTRIBUTES } from "../models/actors/attributes";
import { DERIVED_ATTRIBUTES } from "../models/actors/derived-attributes";
import {Portrait} from '../models/portrait';
import {RollInfo} from '../services/player-data-service';

export function registerHelpers(): void {
  Handlebars.registerHelper(
    "asList",
    (...values: Array<any>): Array<string> => {
      return values.filter((v) => typeof v === "string");
    }
  );

  Handlebars.registerHelper(
    "getByKey",
    (object: any, key: string, ctx: any): any => {
      if (!object) {
        return undefined;
      }
      return object[key];
    }
  );

  Handlebars.registerHelper(
    "concat",
    (...values: Array<string | any>): string => {
      return values.filter((s) => typeof s === "string").join("");
    }
  );

  Handlebars.registerHelper(
    "prefix",
    (prefix: string, values: Array<string>, ctx): Array<string> => {
      const vals = values.filter((s) => typeof s === "string");
      return vals.map((v) => prefix + v);
    }
  );

  Handlebars.registerHelper("attrNames", (options) => {
    const base: Array<string> = [];
    if (!options) {
      return base;
    }
    if (options.hash["base"] === true) {
      base.push(...ATTRIBUTES);
    }
    if (options.hash["derived"]) {
      base.push(...DERIVED_ATTRIBUTES);
    }
    if (
      options.hash["includeGK"] == null ||
      options.hash["includeGK"] === false
    ) {
      return base.filter((v) => v !== "GK");
    }
    return base;
  });

  Handlebars.registerHelper(
    "modifierTableHeaders",
    (): Array<string> => {
      return [
        "splittermond.modifier.type",
        "splittermond.modifier.target",
        "splittermond.modifier.value",
      ];
    }
  );

  Handlebars.registerHelper(
    "memeText",
    (color: string, shadowColor: string, width: string, ctx) => {
      return `
        letter-spacing: 1px;
        color: ${color};
        text-shadow: ${width} ${width} 0 ${shadowColor},
          -${width} -${width} 0 ${shadowColor},
          ${width} -${width} 0 ${shadowColor},
          -${width} ${width} 0 ${shadowColor},
          0px ${width} 0 ${shadowColor},
          ${width} 0px 0 ${shadowColor},
          0px -${width} 0 ${shadowColor},
          -${width} 0px 0 ${shadowColor},
          ${width} ${width} 5px ${shadowColor};
        `;
    }
  );

  Handlebars.registerHelper(
    "repeatTimes",
    (times: number, ctx): Array<number> => {
      const arr = [];
      for (let i = 0; i < times; i++) {
        arr[i] = i;
      }
      return arr;
    }
  );

  Handlebars.registerHelper(
    "subtractClamp",
    (numA: number, numB: number, ctx): number => {
      return Math.max(0, numA - numB);
    }
  );

  Handlebars.registerHelper("sum", (numA: number, numB: number, ctx) => {
    return numA + numB;
  });

  Handlebars.registerHelper(
    "clampMax",
    (numA: number, numB: number, ctx): number => {
      return Math.min(numA, numB);
    }
  );

  Handlebars.registerHelper("print", (options): any => {
    return new Handlebars.SafeString(options.hash["content"]);
  });

  Handlebars.registerHelper("isNotNull", (val: unknown) => {
    return val !== null && val !== undefined;
  });

  Handlebars.registerHelper("simpleRollInfo", (name: string) => {
    return JSON.stringify({
      name,
    });
  });

  Handlebars.registerHelper(
    "oneOf",
    (val: string | number, ...values: Array<unknown>) => {
      const options = Array.isArray(values[0])
        ? values[0].filter(
            (v) => typeof v === "string" || typeof v === "number"
          )
        : values.filter((v) => typeof v === "string" || typeof v === "number");
      return options.includes(val);
    }
  );

  Handlebars.registerHelper('portraitPosition', (port: Partial<Portrait> | undefined): string => {
      if (!port) {
          return `transform: translate(0px, 0px) scale(1.0);`
      }
      return `transform: translate(${port.iconPosX ?? 0}px, ${port.iconPosY}px) scale(${Math.max(0.1, port.iconScale ?? 1)})`;
  });

  Handlebars.registerHelper('npcWeaponRollInfo', (weapon: {name: string; wert: number; schaden: string; wgs: number}): string => {
      return JSON.stringify({
          name: weapon.name,
          damage: weapon.schaden,
          ticks: weapon.wgs
      });
  });

    Handlebars.registerHelper('npcSkillRollInfo', (weapon: {name: string; wert: number;}): string => {
        return JSON.stringify({
            name: weapon.name,
        });
    });
}
