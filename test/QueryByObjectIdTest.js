const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const collection = "reserve_detail";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const usrmgr = require('../lib/usrmgr');

describe('querybyoidTest', function () {
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
                "timestamp": 1537363911,
                "uid": 2017220301024,
                "title": "sth",
                "reason": "sth",
                "info": "sth",
                "remark": "sth",
                "status": "pending",
                "teacher": 1000000
              }
            ]);
        } catch (err) {
            console.log(err);
        }
    });

    it('querybyoidTest#1', async function () {
        let result, catch_err;
        try {
          result = await usrmgr.QueryByReserveId("5ba2fdf6de61470db3cb9944", 2017220301024, 2017220301024);
        } catch (err) {
          catch_err = err;
        }
        expect(result.message).to.be.equal("OK");
        expect(result.uid).to.be.equal(2017220301024);
        expect(result.data.week).to.be.equal(3);
        expect(result.data.day).to.be.equal(1);
        expect(result.data.time).to.be.equal(2);
        expect(result.data.uid).to.be.equal(2017220301024);
        expect(result.data.title).to.be.equal("sth");
        expect(result.data.reason).to.be.equal("sth");
        expect(result.data.info).to.be.equal("sth");
        expect(result.data.remark).to.be.equal("sth");
        expect(result.data.status).to.be.equal("pending");
        expect(result.data.teacher).to.be.equal(1000000);
        expect(catch_err).to.be.an("undefined");
    });

    it('querybyoidTest#2', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId("3", 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('querybyoidTest#3', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId("5ba2fdf6de61470db3cb9944", 2017220301023, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });

    it('querybyoidTest#4', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId("5ba2fdf6de61470db3cb9944");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('querybyoidTest#5', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId("{$ne: 123}", 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('querybyoidTest#6', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('querybyoidTest#7', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId(2017220301024, "2017220301024", 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('querybyoidTest#8', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.QueryByReserveId(2017220301024, 2017220301024, "2017220301024");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

});
