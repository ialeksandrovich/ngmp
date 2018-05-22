import EventEmitter from 'events';
import fs from 'fs';
import * as _ from 'lodash';
import { promisify } from 'util';

const readDir = promisify(fs.readdir);
const stat = promisify(fs.stat);

export class DirWatcher extends EventEmitter{
    constructor(props) {
        super(props);
        this.lastModificationDates = {};
        this.lastCheckModificationDates = {};
        this.timeoutId = null;
    }

    checkDirectory = (path, delay) => {
        return readDir(path).then(files => {
            const fileStatisticsPromises = files.map(file => stat(`${path}/${file}`).then(stat => {
                if (stat.isFile()) {
                    this.lastCheckModificationDates[`${path}/${file}`] = stat.mtime.valueOf();
                } else {
                    return this.checkDirectory(`${path}/${file}`, delay);
                }
            }));
            return Promise.all(fileStatisticsPromises);
        });
    }

    watch = (path, delay) => {
        this.checkDirectory(path, delay).then(() => {
            if (!(_.isEqual(this.lastCheckModificationDates, this.lastModificationDates))) {
                Object.assign(this.lastModificationDates, this.lastCheckModificationDates);
                this.emit('changed', Object.keys(this.lastModificationDates));
            }
            this.timeoutId = setTimeout(this.watch, delay, path, delay);
        }).catch((error) => console.log(error));
    }

    unwatch = () => {
        clearTimeout(this.timeoutId);
    }
}

