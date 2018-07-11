const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const through2 = require('through2');
const csvtojson = require('csvtojson');
const MultiStream = require('multistream');
const request = require('request');
const helpers = require('./helpers');

const warning = `
Wrong input!
`;

const help = `
Available commands:

--help, -h  (List available commands)

--action=reverse, -a reverse  (Reverse string data from process.stdin to process.stdout)

--action=transform, -a transform   (Convert data from process.stdin to upper-cased data on process.stdout)

--action=outputFile, -a outputFile   (Pipe the given file provided by --file option to process.stdout)

--action=convertFromFile, -a convertFromFile   (Convert file provided by --file option from csv to json and output data to process.stdout)

--action=convertToFile, -a convertToFile   (Convert file provided by --file option from csv to json and output data to a result file with the same name but json extension)
`;

function reverse() {
    process.stdin
        .pipe(through2(function(chunk, enc, callback) {
            this.push(chunk.toString().split('').reverse().join('').concat('\n'));
            callback();
        }))
        .pipe(process.stdout);
}

function transform() {
    process.stdin
        .pipe(through2(function(chunk, enc, callback) {
            this.push(chunk.toString().toUpperCase());
            callback();
        }))
        .pipe(process.stdout);
}

function outputFile(filePath) {
    helpers.checkFilePath(filePath);
    const reader = fs.createReadStream(filePath);
    reader.pipe(process.stdout);
}

function convertFromFile(filePath) {
    helpers.checkFilePath(filePath);
    const reader = fs.createReadStream(filePath);
    const writer = process.stdout;
    reader.pipe(csvtojson()).pipe(writer);
}

function convertToFile(filePath) {
    helpers.checkFilePath(filePath);
    const reader = fs.createReadStream(filePath);
    const newFileName = `${filePath.slice(0, filePath.lastIndexOf('.'))}.json`;
    const writer = fs.createWriteStream(newFileName);
    reader.pipe(csvtojson()).pipe(writer);
}

function cssBundler(dirPath) {
    helpers.checkFilePath(filePath);
    const files = helpers.getFilesFromDir(dirPath, 'css');
    const streams = [];
    files.forEach(file => streams.push(fs.createReadStream(file)));
    streams.push(request('https://drive.google.com/uc?export=download&id=1tCm9Xb4mok4Egy2WjGqdYYkrGia0eh7X'));
    MultiStream(streams).pipe(fs.createWriteStream(path.join(dirPath, 'bundle.css')));
}

const argv = process.argv.slice(2)
const args = minimist(argv);

if(!argv.length) {
    process.stdout.write(warning);
    process.stdout.write(help);
} else if(argv[0] === '--help' || argv[0] === '-h' || !argv.length) {
    process.stdout.write(help);
} else {
    const action = args['action'] || args['a'];
    const filePath = args['file'] || args['f'];
    const dirPath = args['path'] || args['p'];

    switch(action) {
        case 'reverse':
            reverse();
            break;
        case 'transform':
            transform();
            break;
        case 'outputFile':
            outputFile(filePath);
            break;
        case 'convertFromFile':
            convertFromFile(filePath);
            break;
        case 'convertToFile':
            convertToFile(filePath);
            break;
        case 'cssBundler':
            cssBundler(dirPath);
            break;
        default:
            process.stdout.write(warning);
            process.stdout.write(help);
    }
}