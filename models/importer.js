import Papa from 'papaparse';
import fs from 'fs';
import { promisify } from 'util';

const readFile = promisify(fs.readFile);

export class Importer {
    import(path) {
        return readFile(path, 'utf8').then(file => Papa.parse(file));
    }

    importSync(path) {
        return Papa.parse(fs.readFileSync(path, 'utf8'));
    }
}