const { render } = require('ejs');
const express = require('express');
var pool = require('../conf/mysql')
var router = express.Router();
// var conn = mysql.connection;

router.get("/",function(req, res){
    var SQL = "SELECT * FROM product WHERE category = ?"
    var allergy = 'select name, seq, category, img, price, detail from product a left join product_allergy c on a.seq = c.product_seq where seq NOT IN (select seq from product a join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?)) and category = ? group by seq';

    var allergy2 = 'select seq, name,  category, img, price, detail, main_yn, PRODUCT_seq from product a left join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?) and category =? group by seq having main_yn = \'y\'';
    
    var allergy3 = 'select seq, name,  category, img, price, detail, main_yn, PRODUCT_seq from product a left join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?) and category =? group by seq having main_yn != \'y\'';    var param = [1];
    var data = [];
    var sess = req.session;
    console.log(sess.userSeq)
    if(sess.userSeq){
            
        var param1 = [sess.userSeq,1];
        var param2 = [sess.userSeq,1];
        var param3 = [sess.userSeq,1];
        console.log(param1)
        pool.getConnection(function(err, conn){
            conn.query(allergy, param1, function(err, row, filed){
                console.log(row)
                if(row){
                    for(var k = 0 ; k< row.length ; k++){
                        row[k].allergy = 0
                        data.push(row[k])
                    }
                }
                conn.query(allergy2, param2, function(err, row2, filed){
                if(row){
                    for(var i = 0 ; i< row2.length ; i++){
                        row2[i].allergy=1
                        data.push(row2[i])
                    }
                    
                }
                    conn.query(allergy3, param3, function(err, row3, filed){
                        if(row){
                            for(var i = 0 ; i < row3.length ; i++){
                                row3[i].allergy = 2
                                data.push(row3[i])
                            }
                            console.log("-----------------------------------------")
                            console.log(data);
                            
                            console.log("-----------------------------------------")
                            conn.release();
                            res.render("user/kiosk", {
                                data: data
                            });
                        }
                        else{
                            console.log("-----------------------------------------")
                            console.log(data);
                            
                            console.log("-----------------------------------------")
                            conn.release();
                            res.render("user/kiosk", {
                                data: data
                            });
                        }
                    })
                })
            })
        })
    }
    else{
        pool.getConnection(function(err, conn){
            conn.query(SQL, param, function(err, row, filed){
                if(err){
                    console.log(err);
                }else{
                    console.log("상품 조회 성공 하셨습니다.");
                    if(row){
                        for(var i =0 ; i < row.length ; i++){
                            row[i].allergy = 0;
                        }
                        console.log(data)
                        res.render("user/kiosk", {
                            data: row
                        });
                    }
                }conn.release();
            })
        })
    }
   
})

router.get("/order2", function(req, res) {
    
    // var param = [req.session.]
    res.render('user/order',
        {message: "2323"}
    );
})

router.get("/orderEnd", function(req, res) {
    
    var SQL = "SELECT max(seq) AS order_seq FROM orders"
    // var param = [req.session.]
    pool.getConnection(function(err, conn){
        conn.query(SQL, function(err, row, filed){
            if(row){
                console.log(row[0]);
                res.render('user/orderEnd',
                {data: row[0]}
            ); 
            }
        })
    })
})


router.get("/category/:category_seq", function(req, res){
    var SQL = "SELECT * FROM product WHERE category = ?"
    var allergy = 'select name, seq, category, img, price, detail from product a left join product_allergy c on a.seq = c.product_seq where seq NOT IN (select seq from product a join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?)) and category = ? group by seq';

    var allergy2 = 'select seq, name,  category, img, price, detail, main_yn, PRODUCT_seq from product a left join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?) and category =? group by seq having main_yn = \'y\'';
    
    var allergy3 = 'select seq, name,  category, img, price, detail, main_yn, PRODUCT_seq from product a left join product_allergy c on a.seq = c.product_seq where c.allergy_seq  IN (select allergy_seq from user_allergy where user_seq = ?) and category =? group by seq having main_yn != \'y\'';
    var param = [req.params.category_seq];
    var data = [];
    var sess = req.session;
    console.log(sess.userSeq)
    if(sess.userSeq){
            
        var param1 = [sess.userSeq,req.params.category_seq];
        var param2 = [sess.userSeq,req.params.category_seq];
        var param3 = [sess.userSeq,req.params.category_seq];
        console.log(param1)
        pool.getConnection(function(err, conn){
            conn.query(allergy, param1, function(err, row, filed){
                console.log(row)
                if(row){
                    for(var k = 0 ; k< row.length ; k++){
                        row[k].allergy = 0
                        data.push(row[k])
                    }
                }
                conn.query(allergy2, param2, function(err, row2, filed){
                if(row){
                    for(var i = 0 ; i< row2.length ; i++){
                        row2[i].allergy=1
                        data.push(row2[i])
                    }
                    
                }
                    conn.query(allergy3, param3, function(err, row3, filed){
                        if(row){
                            for(var i = 0 ; i < row3.length ; i++){
                                row3[i].allergy = 2
                                data.push(row3[i])
                            }
                            console.log("-----------------------------------------")
                            console.log(data);
                            
                            console.log("-----------------------------------------")
                            conn.release();
                            return res.json(data);
                        }
                        else{
                            console.log("-----------------------------------------")
                            console.log(data);
                            
                            console.log("-----------------------------------------")
                            conn.release();
                            return res.json(data);
                        }
                    })
                })
            })
        })
    }
    else{
        pool.getConnection(function(err, conn){
            conn.query(SQL, param, function(err, row, filed){
                if(err){
                    console.log(err);
                }else{
                    console.log("상품 조회 성공 하셨습니다.");
                    if(row){
                        conn.release();
                        return res.json(row);
                    }
                }
            })
        })
    }
   
})

router.post("/order", function(req, res){
    var OrderSQL = "INSERT orders(Allprice, user_seq, yn) values (?, ?, 'n')"
    var OrderSelectSQL = "SELECT max(seq)as seq FROM ORDERS"
    var OrderInsertSQL = "INSERT ORDERS_INFO(ORDERS_seq,PRODUCT_seq, COUNT) value(?,?,?)"

    let body = req.body;
    var sess = req.session.userSeq;

    console.log(body);
    console.log(sess);
    
    // var order_num = Object.keys(body).length;

    var order_num = Object.values(body.Price).length;
    // console.log(order_num);
    console.log(order_num);
    
    // console.log(body[0]);
    
    // let count =  body[i].count;
    // let seq =  body[i].seq; 
    // body.forEach((function(body){
    //     console.log(body);
    // }));
    var Price = [];
    var Seq = [];
    var qty = [];
    var yn = "n";
    for (var j=0; j<order_num; j++) {
        Price[j] = body.Price[j];
        Seq[j] = body.Seq[j];
        qty[j] = body.qty[j];
    }
   
    let price = body.Price;
    let Allprice = 0;
    price.forEach((function(price){
        Allprice = Allprice + parseInt(price)
    }));

    console.log(Allprice);
    
    param = [Allprice, sess, yn];
    pool.getConnection(function(err, conn){
        conn.query(OrderSQL, param, function(err, row){
            if(err){
                console.log(err);
            }else{
                console.log("주문 번호 생성 완료 했습니다 번호를 조회합니다.");
                conn.query(OrderSelectSQL, function(err, row){
                    if(err){
                        console.log(err);
                    }
                    else{
                        console.log("주문 번호 조회 했습니다 주문 상세 정보를 입력합니다")
                        for(var i = 0 ; i < order_num; i++){
                            var param2 = [row[0].seq, Seq[i], qty[i]]
                            conn.query(OrderInsertSQL, param2, function(err, row){
                                if(err){
                                    console.log(err);
                                }else{
                                    console.log("주문 상세 정보를 입력 완료 했습니다")
                                   
                                }
                            })
                        }
                    }
                })
            }
        })
    })
})
router.get("/qrcode/:seq", function(req, res){
    param = req.params.seq;
    sess = req.session;
    console.log("파라메터값",param);
    sess.userSeq = param
    console.log("session값", sess.userSeq);
    res.redirect("/kiosk")
})
module.exports = router;