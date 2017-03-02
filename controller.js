const view = require('./view');
let db = require('./db');
let queries = require('./queries');

let loadCEDICT = require('./lib/loadCEDICT');
let loadHSK = require('./lib/loadHSK');
let loadSubtlex = require('./lib/loadSubtlex');

const readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let interfaceController = function () {

    process.stdin.on('keypress', (str, key) => {

        if (key.ctrl && key.name === 'c') {
            process.exit();
        } else if (key.name === '1') {
            view.listKeys();
        } if (view.keymap.has(str)) {
            handleAnswer(view.keymap.get(str));
        }

    });
};

let handleAnswer = function (input) {

    if (input === 'Load Database') {
        db.create().then(() => {
            loadCEDICT();
            loadHSK();
            loadSubtlex();
        });

    } else if (input === 'Search for Word') {
        view.searchChar();
        readConsole().then(input => {
            queries.word(input);
        })

    } else if (input === 'Get HSK level for Word') {
        view.searchHSK();
        readConsole().then(input => {
            queries.hsk(input);
        })

    } else if (input === 'Get definition and HSK Level') {
        view.searchChar();
        readConsole().then(input => {
            queries.wordHSK(input);
        })

    } else if (input === 'Input English word, get Chinese words ordered by Frequency') {
        view.searchEnglish();
        readConsole().then(input => {
            queries.englishFreqResult(input);
        })

    } else if (input === 'Get words containing character') {
        view.searchContaining();
        readConsole().then(input => {
            queries.containingResult(input);
        })

    } else if (input === 'Search for English words within HSK 1-6') {
        view.searchEnglishHSK();
        readConsole().then(input => {
            "use strict";
            queries.englishInHSK(input);
        })
    }
};

let readConsole = function () {

    return new Promise(function (resolve, reject) {

        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        rl.question('', (answer) => {
            // TODO: Log the answer in a database
            rl.close();
            resolve(answer);
        });
    });

};

module.exports = interfaceController;