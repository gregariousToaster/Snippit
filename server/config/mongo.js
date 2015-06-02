var Promise = require('bluebird');
var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;
var Collection = mongodb.Collection;
Promise.promisifyAll(MongoClient);
Promise.promisifyAll(Collection.prototype);

module.exports = MongoClient.connectAsync('mongodb://localhost/GregariousToaster');
