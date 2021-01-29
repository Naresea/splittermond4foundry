# Splittermond 4 Foundry

## Table of Contents

- Setting up your development environment
- Compiling
- Code organization

## Setting up your development environment

- Copy the contents of the ".env.example" file to a ".env" file
- In this new ".env" file, make sure the exported foundry path is correct (you will most likely have to replace the __MY_USER_NAME__ part of the foundry path)
- Run "npm i" (or "yarn install" if you're using yarn)
- Make sure to run the scripts included from a bash-like shell (e.g. git bash under windows)

## Compiling
The package.json comes with a lot of targets. If you only want to compile your TS code to JS, run "npm run build".
This will call webpack and compile all sources into one "splittermond.js" file in the "dist" directory.
If you want a full production build including linting and setting templates and json config files up, run "npm run build:prod".
This will create a fully functional, ready to go foundry system in the dist folder.
If you want to build and deploy everything into your foundry app, use "npm run build:deploy".

If you're confident that the system is ready for a release, run "npm run build:release".
This will do a production build, zip the result and create a new subdirectory in the "release" directory.

Commands in short:
- "npm run build": compiles only Typescript sources to splittermond.js
- "npm run build:prod": runs the linter, compiles handlebars, sass, typescript, generated system.json and template json and outputs a fully functional system to dist
- "npm run build:deploy": as build:prod, but also copies the result to your configured Foundry installation
- "npm run build:release": as build:prod, but also zips everything and copies it into a new subfolder of "release",
ready for users to download (after you push it to the repository)

## Code organization

### Root Folders

- all Typescript or Javascript code is organized in "src"
- all handlebars templates are organized in "templates"
- all sass files are organized in "styles"
- all compendium packs are organized in "packs"
- all language files are organized in "lang" and follow the naming "<LanguageName>_<LanguageCode>.json" (e.g. "English_en.json")
- all assets (icons, fonts, etc) are organized in "assets"
- all tolling scripts are organized in "tools"
- all published releases of the software are in "release", sorted by their version
- all documentation (aside from this readme) is in "doc"

### Source Organization

- source code follows the Model-View-Controller pattern with corresponding directories (https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller)
- the "model" is the actual data Foundry stores on its server. All interfaces in the "model/entities" folder will automatically be processed into a template.json during build time
- the "view" are the ActorSheet and ItemSheet classes. These classes will receive data as defined in the "model", but can map that data in any form they want to better fit their corresponding handlebars templates
- the "controller" are the Actor and Item classes. They will handle reading and updating the model (i.e. they will communicate with the Foundry server)
- the "main.ts" file is the entrypoint of the system and responsible for setting up all hooks, registering handlebars helpers & partials and configuring the right Actor(Sheet) and Item(Sheet) classes

### Localization Organization

- language files have a top-level "Splittermond" object, to ensure the text ids are unique to this system
- In this Splittermond object are objects for each of the three main parts of the system: model, view and controller. Most texts will probably end in the "view" part, but sometimes a translation in the controller might be needed (e.g. for confirmation popups)
- In these objects, there is one object for every class that is part of that namespace. Tha class can then organize its text ids as it sees fit
- A final text id should therefore always look like this: "Splittermond.[model | view | controller].<classname>.<id>"
