"use strict";

let sqlite = require("sqlite3");
let db = new sqlite.Database("db/firsTry.db");

let createDb = function(){

    db.on("open", () => {

        console.log("db open");

        try {
            let pragmaRel = db.prepare("PRAGMA foreign_keys = ON");

            let hskRelation = db.prepare("CREATE TABLE HSK (level INT NOT NULL, word PRIMARY KEY NOT NULL NVARCHAR(4) UNIQUE)");
            let cedictRelation = db.prepare("CREATE TABLE definitions (word NVARCHAR(19) PRIMARY KEY NOT NULL UNIQUE, pinyin VARCHAR(10), definition TEXT");
            let characterRelation = db.prepare("CREATE TABLE characters (character NVARCHAR(1) PRIMARY KEY NOT NULL UNIQUE, word NVARCHAR(25) NOT NULL UNIQUE");
            let frequencyRelation = db.prepare("CREATE TABLE subtlex (word (NVARCHAR(25), length INT, WCount INT, WMillion INT, logTenW INT, WCD INT, WCDp INT, dominantPoS VARCHAR(2), dPoSFreq INT, allPoS TEXT, allPoSFreq TEXT)");


            //Word	Length	Pinyin	Pinyin.Input	WCount	W.million	log10W	W-CD	W-CD%	log10CD	Dominant.PoS	Dominant.PoS.Freq	All.PoS	All.PoS.Freq	Eng.Tran.

            // let subredditRelation = db.prepare("CREATE TABLE Subreddit (subreddit_id VARCHAR(8) PRIMARY KEY NOT NULL, subreddit VARCHAR(24) NOT NULL UNIQUE)");
            // let postRelation = db.prepare("CREATE TABLE Post (id VARCHAR(7) PRIMARY KEY NOT NULL, name TEXT NOT NULL UNIQUE, parent_id VARCHAR(10) NOT NULL, link_id VARCHAR(9) NOT NULL, author TEXT NOT NULL, body TEXT NOT NULL, subreddit_id VARCHAR(8) NOT NULL, score INT NOT NULL, created_UTC INT NOT NULL, FOREIGN KEY(subreddit_id) REFERENCES Subreddit(subreddit_id), CHECK(link_id LIKE 't3_%'))");
            //
            // let subredditRelation = db.prepare("CREATE TABLE Subreddit (subreddit_id VARCHAR, subreddit TEXT)");
            // let postRelation = db.prepare("CREATE TABLE Post (id VARCHAR, name TEXT, parent_id VARCHAR, link_id VARCHAR, author TEXT, body TEXT, subreddit_id VARCHAR, score INT, created_UTC INT, FOREIGN KEY (subreddit_id) REFERENCES Subreddit(subreddit_id))");
            //
            //
            pragmaRel.run();
            // subredditRelation.run();
            // postRelation.run();

        } catch (e) {
            console.error(e);

        }
    });

};



let addRedditComment = function (postTuples, subredditTuples) {

    db.serialize(function () {

        db.run("BEGIN TRANSACTION");
        let postRelation = db.prepare("INSERT INTO Post(id, name, parent_id, link_id, author, body, subreddit_id, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
        // let subredditRelation = db.prepare("INSERT OR IGNORE INTO Subreddit(subreddit_id, subreddit) VALUES(?, ?)");


        postTuples.forEach(tuple => {
            // db.run("INSERT OR IGNORE INTO Post (id, name, parent_id, link_id, author, body, subreddit_id, score, created_utc) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", tuple);
            postRelation.run(tuple);
        });

        // subredditTuples.forEach(tuple => {
        //     // db.run("INSERT OR IGNORE INTO Subreddit (subreddit_id, subreddit) VALUES (?, ?)", tuple);
        //     subredditRelation.run(tuple);
        // });

        db.run("COMMIT");

    });
};


module.exports = {
    create: createDb,
    addRedditComment: addRedditComment,
    db: db
};