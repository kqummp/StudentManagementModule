const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const summary_collection = "reserve_summary";
const detail_collection = "reserve_detail";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const usrmgr = require('../lib/usrmgr');

describe('bookTest', function () {
    let res_summary, res_detail;
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            res_summary = db.collection(summary_collection);
            res_detail = db.collection(detail_collection);
            await res_detail.deleteMany({});
            await res_summary.deleteMany({});
            await res_summary.insertMany([
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
                "teacher": 1000000,
                "available": [1, 3],
                "reserved": [2, 4, 7],
                "unavailable": [5, 6, 8]
              }
            ]);
        } catch (err) {
            throw err;
        }
    });

    it('bookTest#1', async function () {
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };

      let result, catch_err;
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result.message).to.be.equal("OK");
      expect(catch_err).to.be.an("undefined");

      let detail_result;
      try {
        detail_result = await res_detail.find({}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(detail_result).to.be.an("array");
      expect(detail_result.length).to.be.equal(1);
      expect((detail_result[0]._id).toString()).to.be.equal(result.reserve_id.toString());
      expect(detail_result[0].week).to.be.equal(3);
      expect(detail_result[0].day).to.be.equal(1);
      expect(detail_result[0].time).to.be.equal(1);
      expect(detail_result[0].title).to.be.equal("asd");
      expect(detail_result[0].info).to.be.equal("asd");
      expect(detail_result[0].reason).to.be.equal("asd");
      expect(detail_result[0].remark).to.be.equal("asdasd");
      expect(detail_result[0].teacher).to.be.equal(1000000);
      expect(detail_result[0].uid).to.be.equal(2017220301024);

      let summary_result;
      try {
        summary_result = await res_summary.find({"week": 3, "day": 1, "teacher": 1000000, "available": {$eq: 1}}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(summary_result).to.be.an("array");
      expect(summary_result.length).to.be.equal(0);
    });

    it('bookTest#2', async function () {
      let result, catch_err;
      let data = {};
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_complete);
    });

    it('bookTest#3', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd"
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_complete);
    });

    it('bookTest#4', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('bookTest#5', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, "2017220301024", 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('bookTest#6', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "{$eq: 1}",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('bookTest#7', async function () {
      let result, catch_err;
      let data = {
        "week": "3",
        "day": 1,
        "time": 1,
        "title": "{$eq: 1}",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('bookTest#8', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301024);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.unavailable);
    });

    it('bookTest#9', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, "2017220301024");
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('bookTest#10', async function () {
      let result, catch_err;
      let data = {
        "week": 3,
        "day": 1,
        "time": 1,
        "title": "asd",
        "info": "asd",
        "reason": "asd",
        "remark": "asdasd",
        "teacher": 1000000
      };
      try {
        result = await usrmgr.Book(data, 2017220301024, 2017220301023);
      } catch (err) {
        catch_err = err;
      }

      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });
});
