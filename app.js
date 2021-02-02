var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var QRCode = require('qrcode');
var MySQLStore = require('express-mysql-session')(session);

var path = require('path')
var app = express();
var port = 3000;
app.use(session({
    secret: "1",
    reseave: false,
    saveUninitialized: true, 
    store: new MySQLStore({
        host: '192.168.64.14',
        port: 3306,
        user: 'root',
        password: '1111',
        database: 'allergy3'
      })
}))

// var mongoose = require('mongoose');
// var autoIncrement = require('mongoose-auto-increment');
// var db = mongoose.connection;
// db.on('error', console.error);
// db.once('open', function() {
//     console.log('mongo db Connection');
// });

// var connect = mongoose.connect('mongodb://127.0.0.1:27017/myDbName', {useMongoClient: true});
// autoIncrement.initialize(connect);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({exrended: true}));

var admin = require("./routes/admin");
var user = require("./routes/user");
var kiosk = require("./routes/kiosk");
var company = require("./routes/company");
app.get('/', function(req, res) {
    res.send('first App');
});
// routes add
app.use(express.static('public'))
app.use(express.static('css'))
app.use(express.static('js'))
app.use(express.static('html'))
app.use('/admin', admin);
app.use("/user", user );
app.use("/company", company);
app.use("/kiosk",kiosk);
app.listen(port, function() {
    console.log('Express listening on port : ', port);
})

module.exports = app;

