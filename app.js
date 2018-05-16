import { DirWatcher } from "./models";
import { Importer } from "./models";

const dirWatcher = new DirWatcher();
const importer = new Importer();
dirWatcher.watch(`${process.cwd()}/data`, 3000);
dirWatcher.on('changed', importer.importAsync);
setTimeout(dirWatcher.unwatch, 50000);