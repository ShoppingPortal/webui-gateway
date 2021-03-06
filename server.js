var express = require("express");
var mysql   = require("mysql");
var bodyParser  = require("body-parser");
//var md5 = require('MD5');
var ejs = require('ejs');
var path = require('path');

var rest = require("./rest.js");

var ServiceProvider = require("./ServiceProvider");
var serviceProvider = new ServiceProvider();

var GatewayService = require("./GatewayService");
var gatewayService = new GatewayService(serviceProvider);


var app  = express();

function REST(){
    var self = this;
    self.connectMysql();
};

REST.prototype.connectMysql = function() {
    var self = this;
    var pool = mysql.createPool({
        connectionLimit : 100,
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'shopping_portal',
        debug    :  false
    });
    pool.getConnection(function(err,connection){
        if(err) {
          self.stop(err);
        } else {
          self.configureExpress(connection);
        }
    });
}

REST.prototype.configureExpress = function(connection) {
      var self = this;
      app.use(bodyParser.urlencoded({ extended: true }));
      app.use(bodyParser.json());
      app.set('views', path.join(__dirname, 'views'));
      app.set('view engine', 'ejs');
      app.use(express.static(path.join(__dirname, 'public')));
      
      var router = express.Router();
      app.use('/api', router);
      var rest_router = new rest(router,connection, gatewayService);
      self.startServer();
}

REST.prototype.startServer = function() {
      app.listen(3002,function(){
          console.log("All right ! I am alive at Port 3002.");
      });
}

REST.prototype.stop = function(err) {
    console.log("ISSUE WITH MYSQL n" + err);
    process.exit(1);
}

new REST();

app.use(function(err, req, res, next) {
	console.log('inside error');
	//check not found error
	if(err.status == 404){
		res.render('404.ejs', { url: req.url });
	}else{
		res.render('500.ejs', { url: req.url });
	}
});