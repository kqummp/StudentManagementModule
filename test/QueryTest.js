const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const collection = "reserve_summary";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const usrmgr = require('../lib/usrmgr');

describe('queryTest', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            let std_info = db.collection(collection);

            await std_info.deleteMany({});
            await std_info.insertMany([
              {
                "week": 3,
                "day": 1,
                "teacher": 1000000,
                "available": [1, 3, 7],
                "reserved": [2, 4],
                "unavailable": [5, 6, 8]
              },
              {
                "week": 3,
                "day": 2,
                "teacher": 1000001,
                "available": [1, 3],
                "reserved": [2, 4, 7],
                "unavailable": [5, 6, 8]
              },
              {
                "week": 4,
                "day": 1,
                "teacher": 1000000,
                "available": [1, 3, 7],
                "reserved": [2, 4],
                "unavailable": [5, 6, 8]
              }
            ]);
        } catch (err) {
            console.log(err);
        }
    });

    it('queryTest#1', async function () {
        let result, catch_err;
        try {
          result = await usrmgr.Query(3);
        } catch (err) {
          catch_err = err;
        }
        expect(result.message).to.be.equal("OK");
        expect(result.data.length).to.be.equal(2);
        expect(result.data[0].week).to.be.equal(3);
        expect(result.data[0].day).to.be.equal(1);
        expect(result.data[0].available.length).to.be.equal(3);
        expect(result.data[0].reserved.length).to.be.equal(2);
        expect(result.data[0].unavailable.length).to.be.equal(3);
        expect(result.data[1].week).to.be.equal(3);
        expect(result.data[1].day).to.be.equal(2);
        expect(result.data[1].available.length).to.be.equal(2);
        expect(result.data[1].reserved.length).to.be.equal(3);
        expect(result.data[1].unavailable.length).to.be.equal(3);
        expect(catch_err).to.be.an("undefined");
    });

    it('queryTest#2', async function () {
        let result, catch_err;
        try {
          result = await usrmgr.Query(4);
        } catch (err) {
          catch_err = err;
        }
        expect(result.message).to.be.equal("OK");
        expect(result.data.length).to.be.equal(1);
        expect(result.data[0].week).to.be.equal(4);
        expect(result.data[0].day).to.be.equal(1);
        expect(result.data[0].available.length).to.be.equal(3);
        expect(result.data[0].reserved.length).to.be.equal(2);
        expect(result.data[0].unavailable.length).to.be.equal(3);
        expect(catch_err).to.be.an("undefined");
    });

    it('queryTest#3', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.Query("3");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('queryTest#4', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.Query("{$ne: 3}");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('queryTest#5', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.Query();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('queryTest#5', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.Query(5);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

});
