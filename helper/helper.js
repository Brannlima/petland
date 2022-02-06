const fs = require('fs')

function writeJSONFile(filename, content) {
    fs.writeFile(filename, JSON.stringify(content), (err) => {
        if (err) {
            console.log(err)
        }
    })
}


module.exports = writeJSONFile;