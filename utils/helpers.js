const fs = require('fs');
const path = require('path');

module.exports = {
    getFilesFromDir,
    checkFilePath
};

function getFilesFromDir(dirPath, fileType) {
    const results = [];

    checkDir(dirPath);

    function checkDir(currentPath) {
        const files = fs.readdirSync(currentPath);
        files.forEach((file) => {
            const currentFile = path.join(currentPath, file);
            if (fs.statSync(currentFile).isFile() && path.extname(currentFile).slice(1) === fileType) {
                results.push(currentFile);
            } else if (fs.statSync(currentFile).isDirectory()) {
                checkDir(currentFile);
            }
        });
    }

    return results;
}

function checkFilePath(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error('Error: Invalid file path');
    }
}