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
            viewToUseFor(res)
        });
    }).catch(e => {
        view.errorHandle(e);
    })
};