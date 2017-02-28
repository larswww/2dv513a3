let fs = require('fs');
let db = require('../db');
let stream = fs.createReadStream('resources/cedict_ts.u8');
stream.setEncoding('utf8');
let remainder = '';

//一個勁兒 一个劲儿 [yi1 ge4 jin4 r5] /erhua variant of 一個勁|一个劲[yi1 ge4 jin4]/

module.exports = function () {

    let cedictChunkToArray = function (dataChunk) {

        let lines = dataChunk.split('\n');
        lines[0] = lines[0] + remainder;
        let cedicts = [];

        let lastLine = lines[lines.length - 1];

        if (lastLine.charAt(lastLine.length) !== '/') {
            remainder = lines.pop()
        }

        lines.forEach(function (line) {

            try {

                let spaceSplitLine = line.split(' ');
                let simplifiedCharacter = spaceSplitLine[1];
                let traditionalCharacter = spaceSplitLine[0];

                let pinyinStart = line.indexOf('[') + 1;
                let pinyinEnd = line.indexOf(']');
                let pinyinDefinition = line.slice(pinyinStart, pinyinEnd);


                let slashSplitLine = line.split('/');
                let definitions = slashSplitLine.slice(1, slashSplitLine.length - 1);

                cedicts.push([
                    simplifiedCharacter, pinyinDefinition, definitions.toString()
                ]);

                // { pinyin: 'ya4',
                //     traditional: '亞',
                //     simplified: '亚',
                //     _id: 58a15098a42f0736dbcc580b,
                //     definition:
                //     [ 'Asia',
                //         'Asian',
                //         'second',
                //         'next to',
                //         'inferior',
                //         'sub-',
                //         'Taiwan pr. [ya3]' ] }

            } catch (e) {

                if (e.name === 'TypeError') {
                    return remainder = lines.pop();
                }
            }
        });

        db.cedict(cedicts);

    };

    stream.on('data', function (data) {
        stream.pause();
        cedictChunkToArray(data);
        stream.resume();
    });

    stream.on('end', () => {
        console.log('Finished reading CEDICT data..')
    })

};