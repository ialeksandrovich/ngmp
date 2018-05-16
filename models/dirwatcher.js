import EventEmitter from 'events';
import fs from 'fs';
import * as _ from 'lodash';
import { promisify } from 'util';

const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

export class DirWatcher extends EventEmitter{
    constructor(props) {
        super(props);
        this.lastModificationDates = {};
        this.timeoutId = null;
    }

    async checkDirectory(path, delay) {
        try {
            const lastModificationDates = {};
            const files = await readDirAsync(path);
            const fileStatisticsPromises = files.map(async file => {
                const stat = await statAsync(`${path}/${file}`);
                lastModificationDates[file] = stat.mtime;
            });
            await Promise.all(fileStatisticsPromises).then(() => {
                if (!(_.isEqual(lastModificationDates, this.lastModificationDates))) {
                    this.lastModificationDates = lastModificationDates;
                    this.emit('changed', path, files);
                }
            });
            this.timeoutId = setTimeout(() => this.checkDirectory(path, delay), delay);
        } catch (error) {
            console.log(error);
        }

    }

    watch(path, delay) {
        this.checkDirectory(path, delay).then(
            () => console.log("Checking started"),
            () => console.log("Checking ended"),
        );
    }

    unwatch() {
        clearTimeout(this.timeoutId);
        console.log("Checking ended");
    }
}