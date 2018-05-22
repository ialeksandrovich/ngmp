import { DirWatcher } from "./models";
import { Importer } from "./models";

const dirWatcher = new DirWatcher();
const importer = new Importer();

dirWatcher.watch(`${process.cwd()}/data`, 2000);
dirWatcher.on('changed', (paths) => paths.forEach(path => importer.import(path).then(res => console.log(res)).catch(error => console.log(error))));