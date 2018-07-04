var db = require('./db');

var create = function(body, callback) {
  console.log(body);
  db.query(`
    INSERT INTO budget (AccountIdx,CostIdx,DepIdx,team,pdate,m1,m2,m3,m4,m5,m6,m7,m8,m9,m10,m11,m12) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
  `, [body.account, body.cost, body.department, body.team, body.date.split('T')[0], body.m1, body.m2, body.m3,
      body.m4, body.m5, body.m6, body.m7, body.m8, body.m9, body.m10, body.m11, body.m12],
  function(err)
  {
    if(err){
      if (err.code === 'ER_DUP_ENTRY') {
        // If we somehow generated a duplicate user id, try again
        return create(body, callback);
      }
      return callback(err);
    }
    return callback(null, true);
  })
}

var add = function(body, callback) {  
  db.query('SELECT * FROM budget WHERE AccountIdx = ? AND CostIdx = ? AND DepIdx = ? AND team = ? AND pdate = ?',
    [body.account, body.cost, body.department, body.team, body.date.split('T')[0]], function(err, rows) {
      if(err) {
        return callback(err);
      }
      if (rows.length) {
        return callback(null, false);
      } else {
        // No user exists, create the user
        return create(body, callback);
      }
    }
  )
}

var find_all = function(body, callback) {
  console.log(body);
  var q = ' WHERE ';
  var arr = [];
  if(body.account != null) {
    q += 'AccountIdx = ? AND';
    arr.push(body.account.Idx);
  }
  if(body.cost != null) {
    q += 'CostIdx = ? AND';
    arr.push(body.cost.CostcenterIdx);
  }
  if(body.department != null) {
    q += 'DepIdx = ? AND';
    arr.push(body.department.DeptIdx);
  }
  if(body.team != ''){
    q += 'team = ? AND';
    arr.push(body.team);
  }
  if(body.date != '') {
    q += 'pdate = ? AND';
    arr.push(body.date.split('T')[0]);
  }
  if(arr.length > 0) {
    q = 'SELECT * FROM budget' + q;
    q = q.substring(0, q.lastIndexOf(" "));
  } else {
    q = 'SELECT * FROM budget';
  }
  console.log(q);
  db.query(q, arr, function(err, rows) {
    callback(err, rows);
  });
}

var remove = function(idx, callback) {
  db.query('DELETE FROM budget WHERE Idx = ?', [idx], function(err){
    if(err){
      return callback(err);
    }else{
      return callback(null);
    }
  })
}

var edit = function(body, callback) {
  console.log(body);
  db.query('UPDATE budget SET ? WHERE Idx = ?',
    [{AccountIdx: body.account, CostIdx: body.cost, DepIdx: body.department, team: body.team, pdate: body.date.split('T')[0],
      m1: body.m1, m2: body.m2, m3: body.m3, m4: body.m4, m5: body.m5, m6: body.m6, m7: body.m7, m8: body.m8, m9: body.m9, m10: body.m10, m11: body.m11, m12: body.m12
    }, body.idx],
  function(err){
    console.log(err);
    if(err)
      return callback(err);
    return callback(null);
  })
}

exports.add = add;
exports.find_all = find_all;
exports.remove = remove;
exports.edit = edit;