"use strict";

let sqlite = require("sqlite3").verbose();
let db;

let createDb = function(){

    return new Promise(function (resolve, reject) {
        db = new sqlite.Database("db/firsTry.db");
        db.on("open", () => {

            console.log("database connection open. \n Creating db tables...");

            try {
                // let pragmaRel = db.prepare("PRAGMA foreign_keys = ON");

                let hskRelation = db.prepare("CREATE TABLE HSK (word NVARCHAR PRIMARY KEY NOT NULL, level INT NOT NULL)");
                let cedictRelation = db.prepare("CREATE TABLE cedict (word NVARCHAR NOT NULL, pinyin VARCHAR(10), definition TEXT NOT NULL)");
                let frequencyRelation = db.prepare("CREATE TABLE subtlex (word NVARCHAR, length INT, WCount INT, WMillion INT, logTenW INT, logTenCD INT, WCD INT, WCDp INT, dominantPoS VARCHAR(2), dPoSFreq INT, allPoS TEXT, allPoSFreq TEXT)");

                cedictRelation.run();
                hskRelation.run();
                frequencyRelation.run();
                console.log('SQL Tables created. \n Ready to input data..')
                resolve();

            } catch (e) {
                console.error('Error whilst creating database:', e);
                console.log('Make sure you have a "db" directory in root, that the db file doesnt exist already. If second run delete the previous db or rename it')
                reject();
            }
        });

    });
};

let addCEDICT = function (cedictTuplesArray) {
    let sql = "INSERT INTO cedict (word, pinyin, definition) VALUES (?, ?, ?)";
    transactAndCommitToDb(cedictTuplesArray, sql);
};


let addSubtlex = function (subtlexTuplesArray) {
    let sql = "INSERT INTO subtlex (word, length, WCount, WMillion, logTenW, logTenCD, WCD, WCDp, dominantPoS, dPoSFreq, allPoS, allPoSFreq) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    transactAndCommitToDb(subtlexTuplesArray, sql);
};

let addHSK = function (tuplesArray) {
    let sql = "INSERT INTO HSK (word, level) VALUES (?, ?)";
    transactAndCommitToDb(tuplesArray, sql);
};

let transactAndCommitToDb = function (tuplesArray, sql) {

    db.serialize(function () {

        try {
            db.run("BEGIN TRANSACTION");
            let relation = db.prepare(sql);

            tuplesArray.forEach(tuple => {
                relation.run(tuple, function (err) {
                    if (err){
                        console.log(tuple);
                        console.error(err);
                    }
                });
            });

            db.run("COMMIT");

        } catch (e) {
            console.error(e);
        }
    })
};


module.exports = {
    create: createDb,
    subtlex: addSubtlex,
    HSK: addHSK,
    cedict: addCEDICT,
    db: db
};