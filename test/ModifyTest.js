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

describe('modifyTest', function () {
    let res_summary, res_detail, ins_id, aft_id;
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
                "timestamp": 1537363911,
                "available": [3, 7],
                "reserved": [1, 2, 4],
                "unavailable": [5, 6, 8]
              });
            let tmp_result = await res_detail.insertOne({
              "week": 3,
              "day": 1,
              "time": 1,
              "user": "root",
              "title": "asd",
              "info": "asd",
              "reason": "asd",
              "remark": "asdasd"
            });
            ins_id = (tmp_result.insertedId).toString();
        } catch (err) {
            throw err;
        }
    });

    it('modifyTest#1', async function () {
      let reserve_id = "";
      let result, catch_err;
      try {
        result = await usrmgr.Modify(reserve_id, true, "root");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('modifyTest#2', async function () {
      let reserve_id = ins_id;
      let result, catch_err;
      try {
        result = await usrmgr.Modify(reserve_id);
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.invalid_field);
    });

    it('modifyTest#3', async function () {
      let reserve_id = ins_id;
      let result, catch_err;
      try {
        result = await usrmgr.Modify(reserve_id, "root");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an("Error");
      expect(catch_err.message).to.be.equal(message.no_login);
    });

    it('modifyTest#4', async function () {
      let data = {
        "week": 3,
        "day": 1,
        "time": 3,
        "title": "asdf",
        "info": "asdf",
        "reason": "asdf",
        "remark": "asdasdf"
      };
      let reserve_id = ins_id;
      let result, catch_err;
      try {
        result = await usrmgr.Modify(reserve_id, true, "root", data);
      } catch (err) {
        catch_err = err;
      }
      aft_id = result.reserve_id.toString();
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
      expect(detail_result[0].time).to.be.equal(3);
      expect(detail_result[0].title).to.be.equal("asdf");
      expect(detail_result[0].info).to.be.equal("asdf");
      expect(detail_result[0].reason).to.be.equal("asdf");
      expect(detail_result[0].remark).to.be.equal("asdasdf");
      expect(detail_result[0].user).to.be.equal("root");

      let summary_result;
      try {
        summary_result = await res_summary.find({"week": 3, "day": 1, "available": {$eq: 1}}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(summary_result).to.be.an("array");
      expect(summary_result.length).to.be.equal(1);
      expect(summary_result[0].available).to.include(1);
      expect(summary_result[0].reserved).to.not.include(1);
      expect(summary_result[0].available).to.not.include(3);
      expect(summary_result[0].reserved).to.include(3);

      let summary_result_2;
      try {
        summary_result_2 = await res_summary.find({"week": 3, "day": 1, "available": {$eq: 3}}).sort({}).toArray();
      } catch (err) {
        throw err;
      }
      expect(summary_result_2).to.be.an("array");
      expect(summary_result_2.length).to.be.equal(0);
    });

    it('modifyTest#5', async function () {
      let reserve_id = aft_id;
      let result, catch_err;
      try {
        result = await usrmgr.Modify(reserve_id, false, "root");
      } catch (err) {
        catch_err = err;
      }
      expect(catch_err).to.be.an("undefined");
      expect(result).to.be.equal(message.success);
    });

});
