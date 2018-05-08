import Papa from 'papaparse';
import fs from 'fs';
import { promisify } from 'util';

const readFileAsync = promisify(fs.readFile);

export class Importer {
    async importAsync(path, files) {
        try {
            const readFilePromises = files.map(async file => await readFileAsync(`${path}/${file}`, 'utf8'));
            await Promise.all(readFilePromises).then(files => files.forEach(async file => await console.log(Papa.parse(file))))
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    importSync(path, files) {
        files.forEach(file => {
            console.log(Papa.parse(fs.readFileSync(`${path}/${file}`, 'utf8')));
        });
    }
}