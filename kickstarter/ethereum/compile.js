
const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const sourcePath = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(sourcePath, 'utf8');
const output = solc.compile(source, 1).contracts;

fs.ensureDirSync(buildPath);

for (let contract in output) {
const filename = path.resolve(buildPath, contract.replace(':', '') + '.json');
const contractData = output[contract];
fs.outputJsonSync(filename, contractData);
}
