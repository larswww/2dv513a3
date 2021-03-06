let fs = require('fs');
let db = require('../db.js');
//let server = require('../server');
let level;

module.exports = function () {

    for (let level = 1; level < 7; level++) {

        let stream = fs.createReadStream('resources/HSK/HSK' + level +'.txt');
        stream.setEncoding('utf8');


        let saveHSKEntriesToDb = function (dataChunk) {

            let lines = dataChunk.split('\n');
            let hskArr = [];

            lines.forEach(line => {
                hskArr.push([line.substr(0, line.length - 1), level]);
            });

            db.HSK(hskArr);
        };

        stream.on('data', function (data) {
            stream.pause();
            saveHSKEntriesToDb(data);
            stream.resume();
        });

        stream.on('end', () => {
            console.log('Finished reading HSK level ' + level + ' data..')
        })

    }
};
