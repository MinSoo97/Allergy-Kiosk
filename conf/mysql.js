var express = require('express');
const { utc } = require('moment');
var router = express.Router();
var mysql = require('mysql');
 
 
var connection = mysql.createPool({

        host : '192.168.64.14',
        port : 3306,
        user : 'root',
        password : '1111',
        database:'allergy3',
        timezone :utc,
        multipleStatements: true
});
 
// connection.connect(function(err) {
//   if (err) {
//       res.render('mysql', { connect: '연결 실패',err:err });
//       console.error(err);
//       throw err;
//   }else{
//       res.render('mysql', { connect: '연결 성공',err:'없음' });
//   }
//   console.log(results);
// });

// connection.end();

module.exports = connection;