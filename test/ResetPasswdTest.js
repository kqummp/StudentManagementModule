const expect = require('chai').expect;
const URL = "mongodb://localhost:27017";
const database = "kqummp";
const collection = "std_userinfo";
const message = require('../lib/message');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const encrypt = require('encryptor');
const usrmgr = require('../lib/usrmgr');

describe('resetPasswdTest', function () {
    before(async function () {
        try {
            let connect = await MongoClient.connect(URL, {useNewUrlParser: true});
            let db = connect.db(database);
            let std_info = db.collection(collection);

            await std_info.deleteMany({});
            await std_info.insertMany([
                {
                    "uid": 2017220301024,
                    "passwd": encrypt.encrypt("301024")
                }
            ]);
        } catch (err) {
            console.log(err);
        }
    });

    it('resetPasswdTest#1', async function () {
        let result, catch_err;
        try {
          result = await usrmgr.ResetPassword(2017220301024, "301024", "200331", "200331");
        } catch (err) {
          catch_err = err;
        }
        expect(result).to.be.equal("OK");
        expect(catch_err).to.be.an("undefined");
    });

    it('resetPasswdTest#2', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword(2017220301024, "200331", "200331", "200331");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.not_modified);
    });

    it('resetPasswdTest#3', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword("2017220301024", "200331", "200331", "200331");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });

    it('resetPasswdTest#4', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword("2017220301024", "{$ne: '1'}", "200331", "200331");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });

    it('resetPasswdTest#5', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword(2017220301024, "200331", "200331", "20033");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.repeat_not_same);
    });

    it('resetPasswdTest#6', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword(2017220301024, "20033", "200331", "200331");
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_error);
    });

    it('resetPasswdTest#7', async function () {
      let result, catch_err;
      try {
        result = await usrmgr.ResetPassword();
      } catch (err) {
        catch_err = err;
      }
      expect(result).to.be.an("undefined");
      expect(catch_err).to.be.an('error');
      expect(catch_err.message).to.be.equal(message.uid_or_password_invalid);
    });
});
