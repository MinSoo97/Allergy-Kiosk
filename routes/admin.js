var express = require('express');
var pool = require('../conf/mysql')
var router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'public/img', limits: { fileSize: 5 * 1024 * 1024 } });

router.get('/', function(rea, res) {
  res.send("admin main page");  
})
router.get('/', function(rea, res) {
  res.send("admin main page");  
})
router.get("/products", function(req, res) {
    res.render('admin/products',
        {message: "hellos, ejs"}
    );
})

router.get("/order", function(req, res) {

//   var orderStateSQL = "SELECT * FROM orders a, orders_info b, product c WHERE a.seq = b.orders_seq AND b.product_seq = c.seq"
//   // let param = [id, pw];
//   pool.getConnection(function(err, conn){
//     conn.query(orderStateSQL, function(err, row){
//         if(err){
//             console.log(err);
//         }else{
//             if(row[0]){
//                 console.log("데이터 가져오기 성공")
//                 console.log(data);
//             }else{
//                 console.log("아이디 및 비밀번호가 틀렸습니다.")
//             }
//         }
//     })
// })
res.render('admin/orderState',
      // {data: row}
  );
})

router.get("/product", function(req, res){

    var sess = req.session
    sess.seq = 1
    param = [sess.seq];
    var product =[]
    pool.getConnection((err, conn) => {
        if (err) throw err;

        var sql = `SELECT * FROM product WHERE COMPANY_seq = ?`
        conn.query(sql, param ,  function(err, row){
          conn.release();
            res.render("product.ejs",{
              title: "Express", 
              sess:sess.seq, 
              product:row
          })
        })

    })

  
} )

router.get("/productnew", function(req, res){
  res.render("productnew.ejs",{title: "Express"})
} )

router.post("/productnew",upload.single('product_IMG'), function(req, res){
  
  var selectUserSQL ="SELECT max(seq) as seq FROM PRODUCT"
  var allergySQL ="INSERT INTO PRODUCT_ALLERGY(PRODUCT_seq,ALLERGY_seq,main_yn) value(?, ?, ?)"
  
  var param1 = []
    const {product_NAME, product_CATEGORY, product_IMG, product_PRICE,product_DETAIL} = req.body;
    var sess = req.session.seq
    console.log(sess)
  console.log(req.body)
  console.log(req.file.filename)
  console.log(req.file)
  let body = req.body;
  let allergy = [];
  allergy = body.allergy;
  let allergy1 = []; 
  allergy1 = body.allergy1;
   // console.log(req.body);
  // const multer = require('multer')
    if(req.body.product_NAME =='' || req.body.product_CATEGORY == '' || req.body.product_IMG == ''|| req.body.product_PRICE == ''|| req.body.product_DETAIL == ''){
        res.send('<script type="text/javascript">alert("모든칸을 채워주세요");history.back();</script>');}
    else{
        pool.getConnection((err,conn)=>{
        if(err) throw err;
      
        var sql = 'INSERT INTO product VALUES(?,?,?,?,?,?,?)'
            var val = [null,product_NAME, product_CATEGORY,req.file.path.replace("public",""),product_PRICE,product_DETAIL,sess]
            conn.query(sql, val,function(err,row){
                 conn.query(selectUserSQL, param1, function(err, row){
                    if(err){ console.log(err)}
                    else{
                        console.log(row[0].seq+"sssssssssssssssssssssssssssssssssssssssssssssssssssssssss")
                        console.log("회원 번호 조회가 성공하셨습니다. 회원 알레르기 입력을 시작합니다.");
                        allergy.forEach(function(element){
                            console.log("알레르기 삭제 번호 : "+element)
                            var param2 = [row[0].seq, element,'Y']
                            conn.query(allergySQL, param2, function(err, row){
                                if(err) {console.log(err)}
                                else{
                                    console.log(element + "의 알레르기 입력 성공하셨습니다.")
                                    conn.release();
                                }
                            })
                        })
                        allergy1.forEach(function(element){
                          console.log("알레르기 삭제 번호 : "+element)
                          var param2 = [row[0].seq, element, 'N']
                          conn.query(allergySQL, param2, function(err, row){
                              if(err) {console.log(err)}
                              else{
                                  console.log(element + "의 알레르기 입력 성공하셨습니다.")
                                  conn.release();
                              }
                          })
                      })
                    }
                })


                res.redirect('/admin/product'); 
                
            })
        })
    }  


  // if(req.body.product_NAME =='' || req.body.product_CATEGORY == '' || req.body.product_IMG == ''|| req.body.product_PRICE == ''|| req.body.product_DETAIL == ''){
  //     console.log("음식 등록 실패")

  //     res.render("productnew.ejs",{title: "Express", message: "pwerr"})
  // }
  // else{
  //     console.log("음식 등록 성공")

  //     res.render('product.ejs',{title: "Express", message: "loginok"});
  // }
})
module.exports = router;