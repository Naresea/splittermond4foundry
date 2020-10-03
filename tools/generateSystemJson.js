const fs = require('fs');
const path = require('path');
const webpackkConfig = require('../webpack.config');
const ini = require('ini');

const system = {
  title: 'Splittermond',
  templateVersion: 2,
  gridDistance: 1,
  gridUnits: 'm'
};

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

async function readDir(dir) {
    const results = [];
    const files = await new Promise((resolve, reject) => fs.readdir(dir, (err, list) => {
        if (err) {
            reject(err);
            return;
        }
        if (!list || list.length < 1) {
            resolve([]);
            return;
        }
        Promise.all(list.map(file => {
            const filePath = path.resolve(dir, file);
            return new Promise((fileResolve, fileReject) => {
                fs.stat(filePath, (err, stat) => {
                    if (err) {
                        fileReject(err);
                        return;
                    }
                    if (stat && stat.isDirectory()) {
                        readDir(filePath).then(files => fileResolve(files)).catch(e => fileReject(e));
                    } else if (stat.isFile()) {
                        fileResolve([file]);
                    } else {
                        fileReject('Neither file nor directory??');
                    }
                })
            });
        })).then((fileLists) => {
            let fileList = [];
            fileLists.forEach(list => {
                fileList = [...fileList, ...list];
            });
            resolve(fileList);
        });
    }));
    results.push(...files);
    return results;
}

async function main() {
    const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
    const packageJson = JSON.parse(await readFile(packageJsonPath));
    system.author = packageJson.author;
    system.version = packageJson.version;
    system.name = packageJson.name;
    system.description = packageJson.description;
    system.scripts = [
        webpackkConfig.output.filename
    ];

    const styles = await readDir(path.resolve(__dirname, '..', 'dist', 'styles'));
    system.styles = styles.map(s => `styles/${s}`);

    const packs = await readDir(path.resolve(__dirname, '..', 'dist', 'packs'));
    system.packs = packs.map(p => `packs/${p}`);

    const langs = await readDir(path.resolve(__dirname, '..', 'dist', 'lang'));
    system.languages = langs.map(l => ({
        path: `lang/${l}`,
        name: l.split('/').pop().split('_')[0],
        lang: l.split('/').pop().split('.json')[0].split('_')[1]
    }));

    const gitConfig = ini.parse(fs.readFileSync(path.resolve(__dirname, '..', '.git', 'config'), 'utf-8'));
    const repoUrl = gitConfig['remote "origin"'].url.replace('.git', '');
    system.manifest = `${repoUrl}/release/${system.version}/system.json`;
    system.download = `${repoUrl}/release/${system.version}/system.zip`;
    system.url = `${repoUrl}`;

    const file = path.resolve(process.argv[2]);
    await writeToFile(file, system);
}

main();
