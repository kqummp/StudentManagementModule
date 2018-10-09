const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const collection = "reserve_detail";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const usrmgr = require('../lib/usrmgr');

describe('querylistTest', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            let std_info = db.collection(collection);

            await std_info.deleteMany({});
            await std_info.insertMany([
              {
                "_id": new ObjectId("5ba2fdf6de61470db3cb9944"),
                "week": 3,
                "day": 1,
                "time": 2,
                "uid": 2017220301024,
                "title": "sth",
                "reason": "sth",
                "info": "sth",
                "remark": "sth",
                "status": "pending",
                "teacher": 1000000,
              },
              {
                "_id": new ObjectId("5ba2fdf6de61470db3cb9945"),
                "week": 3,
                "day": 1,
                "time": 3,
                "uid": 2017220301024,
                "title": "sth",
                "reason": "sth",
                "info": "sth",
                "remark": "sth",
                "status": "pending",
                "teacher": 1000000,
              },
              {
                "_id": new ObjectId("5ba2fdf6de61470db3cb9946"),
                "week": 3,
                "day": 1,
                "time": 4,
                "uid": 2017220301025,
                "title": "sth",
                "reason": "sth",
                "info": "sth",
                "remark": "sth",
                "status": "pending",
                "teacher": 1000000,
              }
            ]);
        } catch (err) {
            console.log(err);
        }
    });

    it('querylistTest#1', async function () {
        let result, catch_err;
        try {
          result = await usrmgr.QueryList(2017220301024, 2017220301024);
        } catch (err) {
          catch_err = err;
        }
        expect(result.message).to.be.equal("OK");
        expect(result.data.length).to.be.equal(2);
        expect(result.data[0].uid).to.be.equal(2017220301024);
        expect(result.data[0].teacher).to.be.equal(1000000);
        expect(result.data[0].time).to.be.equal(2);
        expect(result.data[1].uid).to.be.equal(2017220301024);
        expect(result.data[1].teacher).to.be.equal(1000000);
        expect(result.data[1].time).to.be.equal(3);

        expect(catch_err).to.be.an("undefined");
    });

    it('querylistTest#2', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryList();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('querylistTest#3', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryList(2017220301024, 2017220301023);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });

    it('querylistTest#4', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryList(2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('querylistTest#5', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryList("{$ne: 123}", 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

});
