var express = require('express');
const { response } = require('../app');
var pool = require('../conf/mysql')
var router = express.Router();
// var conn = mysql.connection;

router.get("/login", function(req, res){

    res.render('company/login',
        {message: "hello"}
    );
})

router.post("/login", function(req, res){
    var LoginSQL = "SELECT * FROM company WHERE id = ? AND password = ?"
    let body = req.body;
    let sess = req.session;
    
    let id = body.id;
    let pw = body.password;
    console.log(id, pw)
    let param = [id, pw];
    pool.getConnection(function(err, conn){
        conn.query(LoginSQL, param, function(err, row, filed){
            
            if(err){
                console.log(err);
            }else{
                if(row.length>=1){
                    sess.id = row[0].id
                    sess.seq = row[0].seq
                    console.log(sess.id)
                    console.log(sess.seq)
                    // req.session.seq = loginSeq
                }else{
                    
                }

            }conn.release();
        })
    })
    res.redirect("/company/orderState");
})

router.get("/orderState", function(req, res){

    var OrderStateSQL = "SELECT * FROM orders a, orders_info b, product c WHERE a.seq = b.ORDERS_seq AND b.PRODUCT_seq = c.seq AND a.yn = 'n'"
    var allergy = 'select orders_info_seq as seq, Allprice, createAt, p.name, (select group_concat(" ",name) from user_allergy join allergy on user_allergy.allergy_seq = allergy.seq where user_allergy.user_seq = orders.user_seq and user_allergy.allergy_seq in (select allergy_seq from product_allergy where product_allergy.PRODUCT_seq = p.seq)) as allergy from orders join orders_info oi on oi.orders_seq = orders.seq join product p on p.seq = oi.PRODUCT_seq where oi.yn = "n"';
    var results;
    data = [];
    result = [];
    data2 = {};
    pool.getConnection(function(err, conn){
        conn.query(allergy, function(err, row, filed){
            conn.release();
            res.render('company/orderState',
                {data: row,
                   sess :1
                }
            );
        })
    })
})

router.get("/orderfinish/:seq", function(req, res){
    var OrderFinishSQL = "UPDATE orders_info SET yn = 'y' where orders_info_seq = ?"
    let body = req.params;
    let order_seq = body.seq;
    console.log(order_seq)
    let param = [order_seq];

    pool.getConnection(function(err, conn){
        conn.query(OrderFinishSQL, param, function(err, row){
            if(err){
                console.log(err);
            }conn.release();
        })
    })
    res.redirect("/company/orderState");
})

router.get("/logout", function(req, res) {
    if(req.session.id){
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

    }
    res.render('admin/products',
        {message: "hello"}
    );
})

router.post("/sign", function(req, res){
    let body = req.query;
    let id = body.id;
    let pw = body.password;
    let name = body.name;
    let business = body.business;
    let phone = body.phone;

    var LoginSQL = "INSERT INTO COMPANY(id, password, name, business, phone) values(?,?,?,?,?)" ;
    var LoginParam = [id,pw,name,business,phone];
    pool.getConnection(function(err, conn){
        conn.query(LoginSQL, LoginParam, function(err, row, filed){
            if(err){
                console.log(err);
            }else{
                console.log("회사 회원가입 성공 하셨습니다.");
                if(row){

                }else{
                    
                }

            }conn.release();
        })
    })
    res.send("성공")
})

router.get("/",function(req, res){
    
    productSQL = "SELECT * FROM company " + 
                 "JOIN product on company_seq = company.seq " +
                 "JOIN product_allergy on product_allergy.product_seq = product.seq " +
                 "JOIN allergy on allergy.seq = product_allergy.allergy_seq " +
                 "where company.seq = ?"
    orderSQL = "SELECT * FROM product "+
            "JOIN product_allergy on product_allergy.PRODUCT_seq = product.seq "+
            "join allergy on product_allergy.ALLERGY_seq = allergy.seq "+
            "join user_allergy on user_allergy.ALLERGY_seq = allergy.seq "+
            "join orders_info on orders_info.PRODUCT_seq = product.seq " +
            "join orders on orders.seq = orders_info.ORDERS_seq " +
            "where product.COMPANY_seq = ?"
    let id =req.session.seq 
    var param = [seq];
    var product;
    var order;
    pool.getConnection(function(err, conn){
        conn.query(productSQL, param, function(err, row, filed){
            if(err){
                console.log(err);
            }else{
                console.log("상품 조회 성공 하셨습니다.");
                if(row){
                    product = row;
                    console.log(product)
                }else{
                    
                }
                conn.release();
            }
        })
        conn.query(orderSQL, param, function(err, row, filed){
            if(err){
                console.log(err);
            }else{
                console.log("주문 조회 성공 하셨습니다.");
                if(row){
                    order = row;
                    console.log(order)
                }else{
                    
                }
                conn.release();
            }
        })
    })
    console.log("----조회 결과 ----")
    console.log(order);
    console.log(product);
    res.send("성공")
})

router.post("/product", function(req,res){
    
    var productSQL ="INSERT INTO PRODUCT(name, category, img, price, detail, COMPANY_seq) value(?,?, ?, ?, ?, ?)"
    var selectProductSQL ="SELECT MAX(seq) as seq FROM PRODUCT "
    var allergySQL ="INSERT INTO PRODUCT_ALLERGY(PRODUCT_seq,ALLERGY_seq) value(?, ?)"
  
    let body = req.query
    let company = 1
    let category = body.category;
    let name = body.name;
    let img = body.img;
    let price = body.price;
    let detail = body.detail;
    let allergy = body.allergy
    var param = [name, category, img, price, detail, company]
    var param1 = [name, company]
    pool.getConnection(function(err, conn){
        conn.query(productSQL, param, function(err, row){
            if(err){
                console.log(err);
            }else{
                console.log("상품 정보 입력이 성공하셨습니다 상품의 번호를 조회합니다.");
                conn.query(selectProductSQL, function(err, row){
                    if(err){ console.log(err)}
                    else{
                        console.log("상품 번호 조회가 성공하셨습니다. 상품 알레르기 입력을 시작합니다.");
                        if(allergy){
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
                    }conn.release();
                })
            }
        })
    })
    res.send("성공")

})
router.get("/product/update/:num",function(req,res){
    let num = req.params.num;
    var SQL = "SELECT * FROM PRODUCT WHERE seq = ?"
    var param = [num];
    var data;
    pool.getConnection(function(err, conn){
        conn.query(SQL, param, function(err, row, filed){
            if(err){
                console.log(err);
            }else{
                console.log("회사 상품 업데이트 조회 성공 하셨습니다.");
                if(row){
                    console.log(row)
                    data = row;
                }else{
                    
                }
            }conn.release();
        })
    })
    res.send("성공")
})
router.post("/product/update/:num", function(req,res){
    let body = req.query
    let allergy = body.allergy
    var deleteAllergy = "DELETE FROM PRODUCT_ALLERGY WHERE PRODUCT_seq = ?"
    var insertAllergy = "INSERT INTO PRODUCT_ALLERGY(PRODUCT_seq, ALLERGY_seq) values(?, ?)"

    var seq = req.params.num;
    var param = [seq];


    pool.getConnection(function(err, conn){
        conn.query(deleteAllergy, param, function(err, row){
            if(err){
                console.log(err);
            }else{
                console.log("알레르기 정보 변경 성공하셨습니다.");
            }conn.release();
        })
        allergy.forEach(function(e){
            var param2 = [seq, e];
            conn.query(insertAllergy, param2, function(err, row){
                if(err){
                    console.log(err);
                }else{
                    console.log("알레르기 수정 하셨습니다.");
                }conn.release();
            })
        })
       
    })
    res.send("성공")
})

router.get("/product/delete/:num", function(req,res){
    
    let seq = req.params.num;
    var SQL = "DELETE FROM PRODUCT WHERE seq = ?"
    var param = [seq];
    pool.getConnection(function(err, conn){
        conn.query(SQL, param, function(err, row, filed){
            if(err){
                console.log(err);
            }else{
                console.log("상품 삭제 성공 하셨습니다.");
                if(row){
                    data = row;
                }else{
                    
                }
            }conn.release();
        })
    })
    res.send("성공")
})

module.exports = router;