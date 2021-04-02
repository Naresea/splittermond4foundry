# Splittermond 4 Foundry

## Table of Contents

- License and Used Assets
- Screenshots & Features
- How to Build

## License and Used Assets

This software implements the Splittermond RPG system published by Uhrwerk Verlag.
It is an *unofficial* implementation by a fan of this RPG system and is in no way related to or approved by the Uhrwerk Verlag.

The art assets used are part of the Splittermond-Fanpaket which requires adding this text visibly to all documents that use it:

````
FOLGENDER TEXT IST GUT SICHTBAR IN JEDEM DOKUMENT ZU PLATZIEREN, DAS MATERIAL AUS DIESEM SPLITTERMOND-FANPAKET VERWENDET.

Impressum
Das Fantasy-Rollenspiel Splittermond wird entworfen und herausgegeben vom Uhrwerk-Verlag.
Bei diesem Fanwerk handelt es sich um inoffizielles Material dazu.

Layout
Daniel Bruxmeier
basierend auf Grafiken von

Brenda Clarke (http://inadesign-stock.deviantart.com/art/Moody-Blues-Texture-Pack-1-261617011),
Bethany Lerie (http://redlillith.deviantart.com/art/misc-tribal-brushes-14070868),
Alex Ruiz (http://alexruizart.deviantart.com/art/Tribal-Tech-Photoshop-Brushes-414404973),
Carsten Jünger (http://pixelmixtur-stocks.deviantart.com/art/Wood-Texture-418149743)

Dieses Layout steht unter folgender Creative Commons-Lizenz: CC BY 4.0 (http://creativecommons.org/licenses/by/4.0/deed.de)
Dies umfasst ausdrücklich nicht die eigentlichen Inhalte des Dokuments wie Texte oder zusätzliche Illustrationen.
Bei Nutzung dieses Layouts bitte wenn möglich das endgültige Werk ebenfalls unter eine Creative Commons-Lizenz stellen.
````

## Screenshots and Features
TODO

## How to Build
Setup the following variables in a "foundryconfig.json" next to this Readme:
````
{
  "dataPath": "path/to/your/foundry/data/folder",
  "repository": "",
  "rawURL": ""
}
````

Run this script in a bash-like environment (e.g. Git-Bash under windows):
npm i && npm run build

If the "link" step fails under Windows, please make sure you have "Development Mode" enabled in your Windows Settings.
Otherwise Window's won't allow creation of symlinks and you'll have to copy the files in the "dist" folder manually.
