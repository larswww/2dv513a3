'use strict';
let sqlite = require('sqlite3').verbose();
let view = require('./view');
let db = new sqlite.Database('./db/firsTry.db');
let controller = require('./controller');


module.exports = {

    param: '',

    word: function(param) {
        let sql = "SELECT * FROM cedict WHERE word = '" + param + "'";
        queryAndSendToView(view.wordResult, sql);
    },

    hsk: function (param) {
        let sql = "SELECT * FROM HSK WHERE word = '" + param + "'";
        queryAndSendToView(view.HSKresult, sql);
    },

    wordHSK: function (param) {
        let sql = "SELECT cedict.word, cedict.definition, HSK.level FROM cedict INNER JOIN HSK ON cedict.word=HSK.word WHERE cedict.word = '" + param + "' ORDER BY HSK.level";
        queryAndSendToView(view.cedictHSKResult, sql);
    },

    englishFreqResult: function (param) {
        let sql = "SELECT * FROM cedict INNER JOIN subtlex ON cedict.word=subtlex.word WHERE cedict.definition LIKE '%"+ param + "%' ORDER BY subtlex.WMillion DESC;";
        queryAndSendToView(view.englishFreqResult, sql)
    },

    containingResult: function (param) {
        let sql = "SELECT * FROM cedict WHERE word LIKE '%" + param + "%'";
        queryAndSendToView(view.containingResult, sql)
    },

    englishInHSK: function (param) {
        let sql = "SELECT * FROM cedict INNER JOIN HSK ON cedict.word=HSK.word WHERE cedict.definition LIKE '%" + param + "%'";
        queryAndSendToView(view.englishHSKResult, sql);
    }
};


let runSqlQuery = function (sql) {

    return new Promise(function (resolve, reject) {
        db.all(sql, function (err, row) {
            if (err) console.error(err);
            if (row.length === 0) reject();

            resolve(row);
        });
    })
};

let queryAndSendToView = function (viewToUseFor, sql) {
    runSqlQuery(sql).then(result => {

        result.forEach(res => {
            viewToUseFor(null, res)
        });
    }).catch(e => {
        viewToUseFor(e, null);
    })
};