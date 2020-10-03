const fs = require('fs');
const path = require('path');

async function readJsonFile(file) {
    const filename = path.resolve(file);
    return new Promise((resolve, reject) => {
        fs.readFile(filename, (err, data) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        })
    });
}

async function writeToFile(file, data) {
    const filename = path.resolve(file);
    const serialized = JSON.stringify(data, null, 2);
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, serialized, (err, data) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        })
    });
}

function getActorTypes(jsonSchema) {
    return jsonSchema.definitions.SpliMoActorType.enum;
}

function getItemTypes(jsonSchema) {
    return jsonSchema.definitions.SpliMoItemType.enum;
}

function getExistingActors(jsonSchema, types) {
    const definitions = jsonSchema.definitions;
    return Object.keys(definitions).filter(k =>
        definitions[k]
            && definitions[k].properties
            && definitions[k].properties.type
            && types.includes(definitions[k].properties.type.const)
    ).map(k => definitions[k]);
}

function getExistingItems(jsonSchema, types) {
    const definitions = jsonSchema.definitions;
    return Object.keys(definitions).filter(k =>
        definitions[k]
        && definitions[k].properties
        && definitions[k].properties.type
        && types.includes(definitions[k].properties.type.const)
    ).map(k => definitions[k]);
}


function buildEntityTemplate(schema, definitions) {
    const title = (!!schema && !!schema.properties && !!schema.properties.type && schema.properties.type.const) || undefined;
    const parsed = Object.keys(schema.properties).reduce((accu, property) => {
        const key = property;
        const propDef = schema.properties[key];
        if (propDef == null || propDef.type == null) {
            return accu;
        }
        switch (propDef.type.toLowerCase()) {
            case 'number':
                accu[key] = 0;
                break;
            case 'string':
                accu[key] = key === 'type' ? title : '';
                break;
            case 'boolean':
                accu[key] = false;
                break;
            case 'array':
                accu[key] = [];
                break;
            case 'object':
                accu[key] = buildEntityTemplate(propDef, definitions);
                break;
        }
        return accu;
    }, {});
    return (title != null) ? {...parsed, title} : parsed;
}

function buildEntityTemplates(schemas, definitions) {
    return schemas.map(schema =>
        buildEntityTemplate(schema, definitions)
    );
}

function getActor(jsonSchema) {
    const types = getActorTypes(jsonSchema);
    const existingEntities = getExistingActors(jsonSchema, types);
    const parsedActors = buildEntityTemplates(existingEntities, jsonSchema.definitions);
    const result = parsedActors.reduce((accu, currentActor) => {
        accu[currentActor.title] = {...currentActor, title: undefined};
        return accu;
    }, {});
    return {
        types,
        ...result
    };
}

function getItem(jsonSchema) {
    const types = getItemTypes(jsonSchema);
    const existingEntities = getExistingItems(jsonSchema, types);
    const parsedItems = buildEntityTemplates(existingEntities, jsonSchema.definitions);
    const result = parsedItems.reduce((accu, currentItem) => {
        accu[currentItem.title] = {...currentItem, title: undefined};
        return accu;
    }, {});
    return {
        types,
        ...result
    };
}

async function main() {
    const jsonSchemaFile = process.argv[2];
    const outFile = process.argv[3];
    if (!jsonSchemaFile || !outFile) {
        console.log('Usage:\nnode generateTemplateJson.js <path to json schema> <path to template.json>');
        return;
    }
    console.log(`Generating ${outFile} from \n${jsonSchemaFile}\n`);
    const jsonSchema = JSON.parse(await readJsonFile(jsonSchemaFile));
    const actor = getActor(jsonSchema);
    const item = getItem(jsonSchema);
    await writeToFile(outFile, {Actor: actor, Item: item});
}

main();
