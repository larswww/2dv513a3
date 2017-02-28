'use strict';
let fs = require('fs');
let stream = fs.createReadStream('resources/SUBTLEX_CH_131210_CE.utf8');
stream.setEncoding('utf8');
let remainder = '';
let db = require('../db');

module.exports = function () {

    let dataStreamHandler = function (data) {
        let lines = data.split(/\n/);
        let subtlexes = [];

        lines.forEach(line => {

            try {
                let splitLine = line.split(/\t/);

                if (splitLine.length !== 15) {
                    return remainder = lines.pop();
                } else {
                    subtlexes.push(handleSubtlex(splitLine));
                }


            } catch (e) {

                if (e.name === "SyntaxError") {
                    return remainder = lines.pop();
                }

                console.error(e);
                throw e;
            }
        });

        return saveToDb(subtlexes);
    };

    let saveToDb = function (data) {

        db.subtlex(data);
        ;
    };


    let handleSubtlex = function (splitLine) {
        //let frequencyRelation = db.prepare("CREATE TABLE subtlex (word (NVARCHAR(25), length INT, WCount INT, WMillion INT, logTenW INT, WCD INT, WCDp INT, dominantPoS VARCHAR(2), dPoSFreq INT, allPoS TEXT, allPoSFreq TEXT)");

        try {
            // was cumbersome to use an object with node-sqlite3.
            // return {
            //     word: splitLine[0].trim(),
            //     length: parseFloat(splitLine[1]),
            //     WCount: parseFloat(splitLine[4]),
            //     WMillion: parseFloat(splitLine[5]),
            //     logTenW: parseFloat(splitLine[6]),
            //     WCD: parseFloat(splitLine[7]),
            //     WCDp: parseFloat(splitLine[8]),
            //     logTenCD: parseFloat(splitLine[9]),
            //     dominantPoS: splitLine[10].trim(),
            //     dPoSFreq: parseFloat(splitLine[11]),
            //     allPoS: splitLine[12].trim(),
            //     allPoSFreq: splitLine[13].trim()
            // }

            return [
                splitLine[0].trim(), parseFloat(splitLine[1]), parseFloat(splitLine[4]), parseFloat(splitLine[5]), parseFloat(splitLine[6]),
                parseFloat(splitLine[7]), parseFloat(splitLine[8]), parseFloat(splitLine[9]), splitLine[10].trim(), parseFloat(splitLine[11]),
                splitLine[12].trim(), splitLine[13].trim()
            ]


        } catch (e) {
            console.error('handleSubtlex obj create', e);
        }


    };

    stream.on("data", (data) => {
        stream.pause();
        dataStreamHandler(data);
        stream.resume();
    });

    stream.on('end', () => {
        console.log('Finished reading Subtlex data..')
    })


};

