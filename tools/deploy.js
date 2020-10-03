require('dotenv').config();
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;

async function readFile(file) {
    const filename = path.resolve(file);
    return new Promise((resolve, reject) => {
        fs.readFile(filename, { encoding: 'utf-8' }, (err, data) => {
            if (err != null) {
                reject(err);
                return;
            }
            resolve(data);
        })
    });
}

async function main() {
    const distPath = path.resolve(__dirname, '..', 'dist');
    const foundrySystemPath = process.env.FOUNDRY_SYSTEM_PATH;

    if (!foundrySystemPath) {
        console.error('MISSING ENV VARIABLE: FOUNDRY_SYSTEM_PATH. Please configure it in your .env file (see .env.example in this repo for an example)');
        return;
    }

    const system = JSON.parse(await readFile(path.resolve(distPath, 'system.json')));

    console.log(`Deploying ${distPath} to ${foundrySystemPath}/${system.name}`);

    await new Promise((resolve, reject) => ncp(distPath, `${foundrySystemPath}/${system.name}`, (err) => {
       if (err) {
           reject(err);
       } else {
           console.log('Done!');
           resolve();
       }
    }));
}

main();
