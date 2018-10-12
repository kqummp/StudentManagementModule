"use strict";
/**
 ** UserManagement Module
 **
 ** @version 0.0.1
 **
 */

const url = "mongodb://localhost:27017";

const kqudie = require('kqudie')(url);

const filter = require('filter');

const encrypt = require('encryptor');

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

  let result;
  try {
    result = await kqudie.find(database, std_collection, option);
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
  if (typeof uid === "undefined" || typeof new_passwd === "undefined" ||
    new_passwd_r === "" || typeof old_passwd === "undefined" ||
    typeof new_passwd === "undefined" || typeof new_passwd_r == "undefined" ||
    new_passwd === "" || new_passwd_r === "") {
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

  let result;
  try {
    result = await kqudie.find(database, std_collection, option);
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

  let update_result;
  try {
    update_result = await kqudie.update(database, std_collection, update_query, update_json);
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

  let result;
  try {
    result = await kqudie.find(database, reserve_summary, option);
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
 ** QueryList
 **
 ** @param uid
 ** @param session_user
 **
 */

usrmgr.QueryList = async function (uid, session_user){
  if (typeof uid === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  let query = {
    "uid": uid
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
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

usrmgr.QueryByReserveId = async function (reserve_id, session_user, uid) {
  if (typeof reserve_id === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  let oid;
  try {
    oid = kqudie.String2ObjectId(reserve_id);
  } catch (err) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "_id": oid,
    "uid": session_user
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.not_permitted);
  } else {
    let return_data = {
      "message": message.success,
      "data": result[0],
      "uid": session_user,
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
 ** @param data.teacher
 ** @param session_user
 **
 */

usrmgr.Book = async function (data, session_user, uid) {
  if (typeof data.week === "undefined" || typeof data.day === "undefined" ||
    typeof data.time === "undefined" || typeof data.title === "undefined" ||
    typeof data.info === "undefined" || typeof data.reason === "undefined" ||
    typeof data.remark === "undefined" || typeof data.teacher === "undefined") {
      throw new Error(message.not_complete);
  }

  if (data.title === "" || data.info === "" || data.reason === "" ||
    data.remark === "") {
      throw new Error(message.not_complete);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (!(filter.judgeNumber(data.week) && filter.judgeNumber(data.day) &&
    filter.judgeNumber(data.time) && filter.judgeNumber(data.teacher))) {
      throw new Error(message.invalid_field);
  }

  for (let rec in data) {
    if (!filter.filter(data[rec])) {
      throw new Error(message.invalid_field);
      break;
    }
  }

  let query = {
    "week": data.week,
    "day": data.day,
    "teacher": data.teacher,
    "available": {
      $eq: data.time
    }
  };
  let option = {
    "find": query
  };

  let judge_result;
  try {
    judge_result = await kqudie.find(database, reserve_summary, option);
  } catch (err) {
    throw err;
  }

  if (!(judge_result.length === 1)) {
    throw new Error(message.unavailable);
  }

  let update_query = {
    "week": data.week,
    "day": data.day,
    "teacher": data.teacher
  };
  let update_summary = {
    $pull: {
      "available": data.time
    },
    $addToSet: {
      "reserved": data.time
    }
  };

  let ins_detail = {
    "week": data.week,
    "day": data.day,
    "time": data.time,
    "timestamp": Math.round(new Date().getTime()/1000),
    "uid": session_user,
    "title": data.title,
    "reason": data.reason,
    "info": data.info,
    "remark": data.remark,
    "status": "pending",
    "teacher": data.teacher
  };

  let update_result, result;
  try {
    update_result = await kqudie.update(database, reserve_summary, update_query, update_summary);
    result = await kqudie.insert(database, reserve_detail, ins_detail);
  } catch (err) {
    throw err;
  }

  if (result.result.ok === 1 && update_result.result.nModified === 1) {
    let return_data = {
      "message": message.success,
      "reserve_id": result.insertedId
    };

    return return_data;
  } else {
    throw new Error(message.database_error);
  }
}

/**
 ** Delete
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

usrmgr.Delete = async function (reserve_id, session_user, uid) {
  if (typeof reserve_id === "undefined" || reserve_id === "") {
      throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  let result;
  try {
    result = await usrmgr.QueryByReserveId(reserve_id, session_user, uid);
  } catch (err) {
    throw err;
  }

  let oid;
  try {
    oid = kqudie.String2ObjectId(result.data._id);
  } catch (err) {
    throw err;
  }

  if (!(result.message === message.success && result.uid === session_user)) {
    throw new Error(message.no_reservation);
  }

  let update_query = {
    "week": result.data.week,
    "day": result.data.day,
    "teacher": result.data.teacher
  };
  let update_summary = {
    $pull: {
      "reserved": result.data.time
    },
    $addToSet: {
      "available": result.data.time
    }
  };
  let query = {
    "_id": oid,
    "uid": session_user
  };
  let option = {
    "delete": query
  };

  let delete_result;
  try {
    await kqudie.update(database, reserve_summary, update_query, update_summary);
    delete_result = await kqudie.remove(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (delete_result) {
    return message.success;
  } else {
    throw new Error(message.database_error);
  }
}

/**
 ** Modify
 **
 ** @param reserve_id
 ** @param operation bool
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

usrmgr.Modify = async function (reserve_id, operation, session_user, uid, data) {
  if (typeof reserve_id === "undefined" || reserve_id === "" || typeof operation === "undefined") {
    throw new Error(message.invalid_field);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  let delete_result;

  try {
    delete_result = await usrmgr.Delete(reserve_id, session_user, uid);
  } catch (err) {
    throw err;
  }

  if (!(delete_result === message.success)) {
    throw new Error(message.database_error);
  }

  if (operation) {
    let insert_result;
    try {
      insert_result = await usrmgr.Book(data, session_user, uid);
    } catch (err) {
      throw err;
    }

    if (insert_result.message === message.success) {
      let return_data = {
        "message": message.success,
        "reserve_id": insert_result.reserve_id
      };

      return return_data;
    } else {
      throw new Error(message.database_error);
    }
  } else {
    return message.success;
  }
}

/**
 ** Status
 **
 ** @param reserve_id
 ** @param session_user
 **
 */

usrmgr.Status = async function (reserve_id, session_user, uid) {
  if (typeof reserve_id === "undefined" || reserve_id === "") {
    throw new Error(message.invalid_field);
  }

  if (!filter.filter(reserve_id)) {
    throw new Error(message.invalid_field);
  }

  if (typeof session_user === "undefined" || typeof uid === "undefined") {
    throw new Error(message.no_login);
  }

  if (!(filter.judgeNumber(uid) && filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  if (uid !== session_user) {
    throw new Error(message.not_permitted);
  }

  if (!(filter.judgeNumber(session_user))) {
    throw new Error(message.invalid_field);
  }

  let oid;
  try {
    oid = kqudie.String2ObjectId(reserve_id);
  } catch (err) {
    throw new Error(message.invalid_field);
  }

  let query = {
    "_id": oid,
    "uid": session_user
  };
  let option = {
    "find": query
  };

  let result;
  try {
    result = await kqudie.find(database, reserve_detail, option);
  } catch (err) {
    throw err;
  }

  if (result.length === 0) {
    throw new Error(message.not_permitted);
  } else {
    let return_data = {
      "message": message.success,
      "uid": session_user,
      "status": result[0].status
    };

    return return_data;
  }
}
