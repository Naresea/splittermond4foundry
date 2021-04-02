/**
 * This is your TypeScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your system, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your system
 */

// Import TypeScript modules
import { registerSettings } from "./module/settings/settings.js";
import { preloadTemplates } from "./module/handlebars/preloadTemplates.js";
import { SplimoActor } from "./module/actor/splimo-actor";
import { SplimoItem } from "./module/item/splimo-item";
import { SplimoActorSheet } from "./module/actor/splimo-actor-sheet";
import { SplimoItemSheet } from "./module/item/splimo-item-sheet";
import { SplimoCombat } from "./module/combat/splimo-combat";
import { SplimoPlayerSheet } from "./module/actor/sheets/splimo-player-sheet";
import { SplimoNpcSheet } from "./module/actor/sheets/splimo-npc-sheet";
import { registerActorSheets } from "./module/actor/register-actor-sheets";
import { registerItemSheets } from "./module/item/register-item-sheets";
import { registerCombat } from "./module/combat/register-combat";
import { registerHelpers } from "./module/handlebars/registerHelpers";
import { setupMacroHelpers } from "./module/macros/setup-macro-helpers";
import { RollService } from "./module/services/roll-service";

/* ------------------------------------ */
/* Initialize system					*/
/* ------------------------------------ */
Hooks.once("init", async function () {
  console.log("splittermond | Initializing splittermond");

  registerSettings();

  registerHelpers();
  await preloadTemplates();

  registerCombat();
  registerActorSheets();
  registerItemSheets();
  setupMacroHelpers();
});

Hooks.on(
  "renderChatMessage",
  (message: ChatMessage, html: JQuery<HTMLElement>, messageData: any) => {
    RollService.chatMessageRendered(message, html, messageData);
  }
);

/* ------------------------------------ */
/* Setup system							*/
/* ------------------------------------ */
Hooks.once("setup", function () {
  // Do anything after initialization but before
  // ready
});

/* ------------------------------------ */
/* When ready							*/
/* ------------------------------------ */
Hooks.once("ready", function () {
  // Do anything once the system is ready
});

// Add any additional hooks if necessary
