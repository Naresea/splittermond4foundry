const ncp = require('ncp').ncp;

const source = process.argv[2];
const target = process.argv[3];

console.log(`Copying\n${source}\nto\n${target}`);

ncp(source, target, (err) => {
    if (err) {
        console.error('Copy failed: ', err);
    } else {
        console.log('Copy done!');
    }
});
