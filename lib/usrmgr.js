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

const message = require('./message');

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
    throw new Error(message.uid_or_password_invalid); //using err.message to get message
  }

  if (!(filter.judgeNumber(uid) && filter.filter(passwd))) {
    throw new Error(message.uid_or_password_invalid);
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
    return message.success;
  } else {
    throw new Error(message.uid_or_password_error);
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
    throw new Error(message.uid_or_password_invalid);
  }

  if (!(filter.judgeNumber(uid) && filter.filter(old_passwd) &&
    filter.filter(new_passwd) && filter.filter(new_passwd_r))) {
    throw new Error(message.uid_or_password_invalid);
  }
  if (new_passwd !== new_passwd_r) {
    throw new Error(message.repeat_not_same);
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
    throw new Error(message.uid_or_password_error);
  }

  if (result.passwd === encrypt.encrypt(new_passwd)){
    throw new Error(message.not_modified);
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
    return message.success;
  } else {
    throw new Error(message.database_error);
  }
}
