"use strict";
/**
 ** UserManagement Module
 **
 ** @version 0.0.1
 **
 */

const url = "mongodb://mongo:27017";

const kqudie = require('kqudie')(url);

const filter = require('filter');

const encrypt = require('encrypt');

const database = "kqummp";

const std_collection = "std_userinfo";

var usrmgr = module.exports;

/**
 ** Login
 **
 ** @param uid
 ** @param passwd
 **
 */

usrmgr.Login = async function(uid, passwd){
  if (typeof uid === "undefined" || typeof passwd === "undefined" || passwd === "") {
    throw new Error("UID_OR_PASSWORD_INVALID"); //using err.message to get message
  }

  if (!(filter.judgeNumber(uid) && filter.filter(passwd))) {
    throw new Error("UID_OR_PASSWORD_INVALID");
  }

  let encrypted = encrypt.encrypt(passwd);
  let query = {
    "uid": uid,
    "passwd": encrypted
  };
  let option = {
    "find": query
  };

  try {
    var result = await kqudie.find(database, std_collection, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 1) {
    let message = {
      "message": "OK"
    };
    return message;
  } else {
    throw new Error("UID_OR_PASSWORD_ERROR");
  }
}

/**
 ** ResetPassword
 **
 ** @param uid
 ** @param old_passwd
 ** @param new_passwd
 ** @param new_passwd_r
 **
 */

usrmgr.ResetPassword = async function(uid, old_passwd, new_passwd, new_passwd_r){
  if (typeof uid === "undefined" || typeof passwd === "undefined" || passwd === "") {
    throw new Error("UID_OR_PASSWORD_INVALID");
  }

  if (!(filter.judgeNumber(uid) && filter.filter(old_passwd) &&
    filter.filter(new_passwd) && filter.filter(new_passwd_r))) {
    throw new Error("UID_OR_PASSWORD_OR_NEW_PASSWORD_INVALID");
  }
  if (new_passwd !== new_passwd_r) {
    throw new Error("NEW_REPEAT_PASSWORD_NOT_SAME");
  }

  let encrypted = encrypt.encrypt(old_passwd);
  let query = {
    "uid": uid,
    "passwd": encrypted
  };
  let option = {
    "find": query
  };
  try {
    var result = await kqudie.find(database, std_collection, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error("UID_OR_PASSWORD_ERROR");
  }

  if (result.passwd === encrypt.encrypt(new_passwd)){
    throw new Error("NEW_PASSWORD_SAME_AS_OLD_ONE");
  }

  let update_query = {
    "_id": result[0]._id
  };
  let new_encrypted = encrypt.encrypt(new_passwd);
  let update_json = {
    "uid": uid,
    "passwd": new_encrypted
  };
  try {
    var update_result = await kqudie.update(database, std_collection, update_query, update_json);
  } catch (err) {
    throw err;
  }

  if (update_result.result.nModified === 1) {
    let message = {
      "message": "OK"
    };
    return message;
  } else {
    throw new Error("DATABASE_ERROR");
  }
}
