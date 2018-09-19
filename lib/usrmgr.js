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

const reserve_summary = "reserve_summary"

const reserve_detail = "reserve_detail";

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

  if (result[0].passwd === encrypt.encrypt(new_passwd)){
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

/**
 ** Query
 **
 ** @param week
 **
 */

usrmgr.Query = async function (week){
  if (typeof week === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (!(filter.judgeNumber(week) && filter.filter(week))) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "week": week
  };
  let option = {
    "find": query
  };

  try {
    var result = await kqudie.find(database, reserve_summary, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.invalid_field);
  } else {
    let return_data = {
      "message": message.success,
      "data": result
    };

    return return_data;
  }
}

/**
 ** QueryByReserveId
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

usrmgr.QueryByReserveId = async function (reserve_id, session_user) {
  if (typeof reserve_id === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined") {
    throw new Error(message.no_login);
  }

  if (!filter.filter(week)) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "_id": kqudie.String2ObjectId(reserve_id),
    "user": session_user
  };
  let option = {
    "find": query
  };

  try {
    var result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.not_permitted);
  } else {
    let return_data = {
      "message": message.success,
      "user": session_user,
      "data": result[0]
    };

    return return_data;
  }
}

/**
 ** Book
 **
 ** @param data
 ** @param data.week
 ** @param data.day
 ** @param data.time
 ** @param data.title
 ** @param data.info
 ** @param data.reason
 ** @param data.remark
 ** @param session_user
 **
 */

usrmgr.Book = async function (data, session_user) {
  if (typeof data.week === "undefined" || typeof data.day === "undefined" ||
    typeof data.time === "undefined" || typeof data.title === "undefined" ||
    typeof data.info === "undefined" || typeof data.reason === "undefined" ||
    typeof data.remark === "undefined") {
      throw new Error(message.not_complete);
  }

  if (typeof session_user === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(data.week) && filter.judgeNumber(data.day) &&
    filter.judgeNumber(data.time))) {
      throw new Error(message.invalid_field);
  }

  for (let rec in data) {
    if (!filter.filter(data[rec])) {
      throw new Error(message.invalid_field);
      break;
    }
  }

  

}
