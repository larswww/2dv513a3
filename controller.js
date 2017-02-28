let view = require('./view');
let db = require('./db');
let loadCEDICT = require('./lib/loadCEDICT');
let loadHSK = require('./lib/loadHSK');
let loadSubtlex = require('./lib/loadSubtlex');
let readline = require('readline');
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true);

let interfaceController = function (view) {

    console.log(view);

    process.stdin.on('keypress', (str, key) => {

        if (key.ctrl && key.name === 'c') {
            process.exit();
        }

        console.log(key);
       handleAnswer(key.name);
    });

};

let handleAnswer = function (input) {

    let menu;

    switch (input) {
        case '1':
            console.log('hit 1');
            db.create().then(() => {
                loadCEDICT();
                loadHSK();
                loadSubtlex();
            });
            // call build script
            break;
        case '2':
            // give query menu
            break;
        case '3':
            // query 1...
        default:
            menu = view.greeting;
    }

};


module.exports = interfaceController;