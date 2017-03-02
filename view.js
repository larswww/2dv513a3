const keymap = new Map();
const eol = require('os').EOL;

keymap.set('1', 'Show Menu');
keymap.set('2', 'Load Database');
keymap.set('3', 'Search for Word');
keymap.set('4', 'Get HSK level for Word');
keymap.set('5', 'Get definition and HSK Level');
keymap.set('6', 'Input English word, get Chinese words ordered by Frequency');
keymap.set('7', 'Get words containing character');
keymap.set('8', 'Search for English words within HSK 1-6');


module.exports = {

    keymap:  keymap,

    greeting: () => console.log('Select what you would like to do:'),

    searchChar: () => {
        console.log('Input a Chinese word to search for dictionary definitions:')
    },

    searchHSK: () => {
        console.log('Input a Chinese word to search to get its HSK level');
    },

    searchEnglish: () => {
        console.log('Input English and search the definitions and get Chinese translation:')
    },

    searchContaining: () => {
        console.log('Input single or multiple characters and youll get Chinese word containing that character(s)');
    },

    searchEnglishHSK: () => {
        console.log('Search English definitions and get Chinese words & pinyin within HSK level 1-6:')
    },

    listKeys: () => {
        // from: http://thisdavej.com/making-interactive-node-js-console-apps-that-listen-for-keypress-events/
        console.log(`${eol}Press # to:`);
        keymap.forEach((value, key) => {
            console.log(`${key} - ${value}`);
        });
        console.log();
    },
    
    wordResult: function (err, result) {
        if (err) this.errorHandle(err);
        console.log('The definition for ' + result.word + ' (' + result.pinyin + ' is: ' + result.definition);
    },
    
    HSKresult: function (err, result) {
        if (err) this.errorHandle(err);
        console.log(result.word + ' is HSK level: ' + result.level)
    },

    errorHandle: function (e) {
        console.log('Didnt get any results for that input, try something else');
        console.error(e);

    },

    cedictHSKResult: function (err, result) {
        if (err) console.log('That word is not in the HSK');
        console.log(result);
    },

    englishFreqResult: function (err, result) {
        if (err) {
            console.log('couldnt find anything for that query, heres why:', err);
        } else {
            console.log('Matches for your search sorted by common use:');
            console.log(result);
        }

    },

    containingResult: function (err, result) {
        if (err) console.error(err);
        console.log('Words containing:');
        console.log(result);
    },

    englishHSKResult: function (err, result) {
        if (err) console.error(err);
        console.log('Words in HSK:');
        console.log(result);
    }
    

};