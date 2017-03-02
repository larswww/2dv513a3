const keymap = new Map();
const eol = require('os').EOL;

keymap.set('1', 'Show Menu');
keymap.set('2', 'Load Database');
keymap.set('3', 'Search for Word');
keymap.set('4', 'Get HSK level for Word');

module.exports = {

    keymap:  keymap,

    greeting: () => console.log('Select what you would like to do:'),

    searchChar: () => {
        console.log('Input a Chinese word to search for dictionary definitions:')
    },

    searchHSK: () => {
        console.log('Input a Chinese word to search to get its HSK level');
    },

    listKeys: () => {
        // from: http://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
        console.log(`${eol}Press # to:`);
        keymap.forEach((value, key) => {
            console.log(`${key} - ${value}`);
        });
        console.log();
    },
    
    wordResult: function (result) {
        console.log('The definition for ' + result.word + ' (' + result.pinyin + ' is: ' + result.definition);
    },
    
    HSKresult: function (result) {
        console.log(result.word + ' is HSK level: ' + result.level)
    },

    errorHandle: function (e) {
        console.log('Didnt get any results for that input, try something else');
        console.error(e);

    }
    

};