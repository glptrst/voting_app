const mongodb = require('mongodb');
const config = require('./config');
var MongoClient = require('mongodb').MongoClient;

module.exports = {
    connectToDb: connectToDb
};

async function connectToDb() {
    let db = await MongoClient.connect(process.env.DBURI);
    return db;
}
