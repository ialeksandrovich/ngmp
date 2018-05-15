import EventEmitter from 'events';
import fs from 'fs';
import * as _ from 'lodash';
import { promisify } from 'util';

const readDirAsync = promisify(fs.readdir);
const statAsync = promisify(fs.stat);

export class DirWatcher extends EventEmitter{
    constructor(props) {
        super(props);
        this.filesModDatesHash = {};
        this.timeoutId = null;
    }

    async checkDirectory(path, delay) {
        try {
            const filesModDatesHash = {};
            const files = await readDirAsync(path);
            const readFileStatPromises = files.map(async file => {
                const stat = await statAsync(`${path}/${file}`);
                filesModDatesHash[file] = stat.mtime;
            });
            await Promise.all(readFileStatPromises).then(() => {
                if (!(_.isEqual(filesModDatesHash, this.filesModDatesHash))) {
                    this.filesModDatesHash = filesModDatesHash;
                    this.emit('changed', path, files);
                }
            });
            this.timeoutId = setTimeout(() => this.watch(path, delay), delay);
        } catch (error) {
            console.log(error);
        }

    }

    watch(path, delay) {
        this.checkDirectory(path, delay).then(
            () => console.log("Directory was checked successfully"),
            () => console.log("Directory wasn't checked"),
        );
    }

    unwatch() {
        clearTimeout(this.timeoutId);
    }
}