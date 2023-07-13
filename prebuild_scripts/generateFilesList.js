const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, '.././dist/posts/markdown-posts');

fs.readdir(folderPath, (err, files) => {
    if (err) {
        console.error(err);
        return;
    }
    const fileNames = files.filter(file => file.endsWith('.md')).reverse();
    const fileContent = `export default ${JSON.stringify(fileNames)};`;

    fs.writeFile(path.join(__dirname, '../src/settings', 'files.js'), fileContent, err => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('File list generated successfully!');
    });
});
