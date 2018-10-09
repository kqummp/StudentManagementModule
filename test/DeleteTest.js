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

describe('deleteTest', function () {
    let res_summary, res_detail, ins_id;
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            res_summary = db.collection(summary_collection);
            res_detail = db.collection(detail_collection);
            await res_detail.deleteMany({});
            await res_summary.deleteMany({});
            await res_summary.insertOne({
                "week": 3,
                "day": 1,
                "teacher": 1000000,
                "available": [3, 7],
                "reserved": [1, 2, 4],
                "unavailable": [5, 6, 8]
              });
            let tmp_result = await res_detail.insertOne({
              "week": 3,
              "day": 1,
              "time": 1,
              "uid": 2017220301024,
              "title": "asd",
              "info": "asd",
              "reason": "asd",
              "remark": "asdasd",
              "status": "pending",
              "teacher": 1000000
            });
            ins_id = (tmp_result.insertedId).toString();
        } catch (err) {
            throw err;
        }
    });

    it('deleteTest#1', async function () {
      let result, catch_err;
      let oid = "";
      try {
        result = await usrmgr.Delete(oid, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('deleteTest#2', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe1e4e";
      try {
        result = await usrmgr.Delete(oid);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('deleteTest#3', async function () {
      let result, catch_err;
      let oid = "{$ne: 1}";
      try {
        result = await usrmgr.Delete(oid, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('deleteTest#4', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe1e4";
      try {
        result = await usrmgr.Delete(oid, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('deleteTest#5', async function () {
      let result, catch_err;
      let reserve_id = ins_id;
      try {
        result = await usrmgr.Delete(reserve_id, "2017220301024");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('deleteTest#6', async function () {
      let result, catch_err;
      let oid = "5bb38ef916f47987b7fe1e4f";
      try {
        result = await usrmgr.Delete(oid, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.not_permitted);
    });

    it('deleteTest#7', async function () {
      let reserve_id = ins_id;

      let result, catch_err;
      try {
        result = await usrmgr.Delete(reserve_id, 2017220301024);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.equal("OK");
      expect(catch_err).to.be.an("undefined");

      let detail_result;
      try {
        detail_result = await res_detail.find({}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(detail_result).to.be.an("array");
      expect(detail_result.length).to.be.equal(0);

      let summary_result;
      try {
        summary_result = await res_summary.find({"week": 3, "day": 1, "teacher": 1000000, "available": {$eq: 1}}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(summary_result).to.be.an("array");
      expect(summary_result.length).to.be.equal(1);
      expect(summary_result[0].available).to.include(1);
      expect(summary_result[0].reserved).to.not.include(1);
    });

});
