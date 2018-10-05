# StudentManagementModule

Student Management Module

## 功能实现

* 登陆
* 初始密码修改
* 提交预约请求
* 查询预约结果

## 数据库结构

* 用户数据

```json
{
  "uid": 2017220301024,
  "passwd": "asdibbdbiubquibdkqb",
  "email": "asdasd@asdasd.casdasd",
  "gender": "male",
  "major": "Embed",
  "class": "0301"
}
```

* 单天数据

```json
{
  "week": 3,
  "day": 1,
  "available": [1, 3, 7],
  "reserved": [2, 4],
  "unavailable": [5, 6, 8]
}
```

* 单个预约详情

```json
{
  "week": 3,
  "day": 1,
  "timestamp": 1537363911,
  "time": 2,
  "user": "root",
  "title": "sth",
  "reason": "sth",
  "info": "sth",
  "remark": "sth",
  "status": "pending"
}
```
