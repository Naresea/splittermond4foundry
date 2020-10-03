const path = require('path');
const fs = require('fs');
const AdmZip = require('adm-zip');

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

async function main() {
    const system = JSON.parse(await readFile(path.resolve(__dirname, '..', 'dist', 'system.json')));
    const releasePath = path.resolve(__dirname, '..', 'release', `${system.version}`);
    await new Promise((resolve, reject) => fs.mkdir(releasePath, {recursive: true}, (err) => {
        if (err) {
            reject(err);
        } else {
            resolve();
        }
    }));

    await writeToFile(path.resolve(releasePath, 'system.json'), system);
    const zip = new AdmZip();
    zip.addLocalFolder(path.resolve(__dirname, '..', 'dist'));
    zip.writeZip(path.resolve(releasePath, 'system.zip'));
}

main();
