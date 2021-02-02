const express = require('express');
var pool = require('../conf/mysql');
const QRCode = require("qrcode");
const { param } = require('./admin');
var router = express.Router();
// var conn = mysql.connection;


router.get('/login', function(req, res) {
    res.render('user/login',
        {message: req.session.id+"2"}
    );

})
router.get('/sign', function(req, res){
    res.render('user/sign')
})
router.get('/main', function(req,res){
    
    res.render('user/user', 
        {name : req.session.name}
    );

})

router.post('/login', function(req, res) {
    var LoginSQL = "SELECT * FROM USER WHERE id = ? AND password = ?"
    var sess = req.session
    let body = req.body;
    let id = body.id;
    let pw = body.password;
    let param = [id, pw];
    console.log(body)
    console.log(id +"sssss" + pw)
    pool.getConnection(function(err, conn){
        conn.query(LoginSQL, param, function(err, row){
            
            if(err){
                console.log(err);
                return;
            }else{
                console.log(row)
                if(row.length>=1){
                    sess.id2 = row[0].id
                    sess.seq = row[0].seq
                    sess.name = row[0].name
                    console.log(sess.id2)
                    console.log(sess.seq)
                    // req.session.seq = loginSeq 
                    conn.release();   
                    res.redirect('/user/main')
                }else{
                    conn.release();
                    res.redirect('/user/login')
                }

            }
        })
    })
})
router.get("/logout", function(req, res) {
    
    if(req.session.seq){
        req.session.destroy(
            function(err){
                if(err){
                    console.log("세션 삭제시 에러");
                    return;
                }
                console.log('세션 삭제 성공');
            }
        );
    } else {
        console.log("로그인이 안됨");
        return;
    }
    res.render('/user/login/',
        {message: $2123}
    );
})
router.post("/sign", function(req, res){
    var userSQL ="INSERT INTO USER(id, password, name, phone, birth) value(?, ?, ?, ?, ?)"
    var selectUserSQL ="SELECT seq FROM USER WHERE id=?"
    var allergySQL ="INSERT INTO USER_ALLERGY(USER_seq,ALLERGY_seq) value(?, ?)"
    let body = req.body;
    let id = body.id;
    let pw = body.password;
    let nm = body.name;
    let phone = body.phone;
    let birth = body.birth;
    let allergy = body.allergy;

    var param = [id,pw,nm,phone,birth];
    var param1 = [id];
    pool.getConnection(function(err, conn){
        conn.query(userSQL, param, function(err, row){
            if(err){
                console.log(err);
            }else{
                console.log("회원 정보 입력이 성공하셨습니다 회원의 번호를 조회합니다.");
                conn.query(selectUserSQL, param1, function(err, row){
                    if(err){ console.log(err)}
                    else{
                        console.log("회원 번호 조회가 성공하셨습니다. 회원 알레르기 입력을 시작합니다.");
                        allergy.forEach(function(element){
                            console.log("알레르기 삭제 번호 : "+element)
                            var param2 = [row[0].seq, element]
                            conn.query(allergySQL, param2, function(err, row){
                                if(err) {console.log(err)}
                                else{
                                    console.log(element + "의 알레르기 입력 성공하셨습니다.")
                                }
                            })
                        })
                    }
                    conn.release();
                })
            }
        })
    })
    res.redirect("/user/login")

})
router.get("/", (req, res) => {
    sess = req.session
    const inputText = '/qrcode/'+sess.seq;
  
    QRCode.toDataURL(inputText, (err, url) => {
      const data = url.replace(/.*,/, "");
      const img = new Buffer.from(data, "base64");
  
      res.writeHead(200, {
        "Content-Type": "image/png",
        "Content-Length": img.length
      });
  
      res.end(img);
    });
  });
  

router.get("/update",function(req,res){
    var UserInsert = "SELECT * FROM USER "
                    +"JOIN USER_ALLERGY on USER.seq = USER_seq "
                    +"JOIN ALLERGY on ALLERGY.seq = ALLERGY_seq "
                    +"WHERE USER.seq = ?"
    var param = [req.session.seq]
    console.log("현재 세션 번호는 " + req.session.seq)
    pool.getConnection(function(err, conn){
        conn.query(UserInsert, param, function(err, row){
            if(err){
                conn.release();
                console.log(err);
            }else{
                conn.release();
                console.log("정보 조회 성공하셨습니다.");
                console.log(row);
            }
        })
    })
    res.render('/user/update')
})

router.post("/update",function(req, res){
    let body = req.query
    let allergy = body.allergy
    var deleteAllergy = "DELETE FROM USER_ALLERGY WHERE USER_seq = ?"
    var insertAllergy = "INSERT INTO USER_ALLERGY(USER_seq, ALLERGY_seq) values(?, ?)"

    var seq = req.session.seq;
    var param = [seq];


    pool.getConnection(function(err, conn){
        conn.query(deleteAllergy, param, function(err, row){
            if(err){
                conn.release();
                console.log(err);
            }else{
                conn.release();
                console.log("알레르기 정보 변경 성공하셨습니다.");
            }
        })
        if(allergy){
            allergy.forEach(function(e){
                var param2 = [seq, e];
                conn.query(insertAllergy, param2, function(err, row){
                    if(err){
                        conn.release();
                        console.log(err);
                    }else{
                        conn.release();
                        console.log("알레르기 수정 하셨습니다.");
                    }
                })
            })
        }
       
    })
    res.send("성공")
})

router.get("/test" , function(req,res){
var sql = 'SELECT * FROM USERS WHERE id = ?'

    pool.getConnection(function(err , conn){
        conn.query(sql, [2],function(err ,row){
            if(err){
                console.log(err)
            }else{
                if(row)
                console.log(row)
                // res.send({success: "ddddd"})
                conn.release();
         res.render('admin/products',console.log("hello"),
            {message: "hellos, ejs"}
    );

            }
        })
    })

    // conn.query("SELECT * FROM USERS", function(err, results, filed){
    //     res.render("hello");    
    //     console.log(err);
    //     console.log(results);
    //     console.log(filed);
    // })
})
module.exports = router;