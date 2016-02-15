var mysql = require('mysql');

function REST_ROUTER(router,connection,md5) {
    var self = this;
    self.handleRoutes(router,connection,md5);
}

REST_ROUTER.prototype.getProduct= function(router,connection,md5, callback) {
    var query = "SELECT * FROM ??";
        var table = ["product"];
        var products = [];
        query = mysql.format(query,table);
     
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : err});
            } else {
               
                 for( var i in rows){               
                    products.push(rows[i]);
                }
                callback(products);
            }
        });
}

REST_ROUTER.prototype.getSeller= function(router,connection,md5,res, callback) {
    var query = "SELECT * FROM ?? WHERE user_type='S'";
        var table = ["user"];
        var seller = [];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : err});
            } else {
               
                 for( var i in rows){               
                    seller.push(rows[i]);
                }
                callback(seller);
            }
        });
}

REST_ROUTER.prototype.handleRoutes= function(router,connection,md5) {
    var self = this;
    router.get("/user",function(req,res){
       res.render('register');
    });

    router.get("/buyer",function(req,res){
         self.getProduct(router,connection,md5, function(result){
          res.render('buyer', { product: result});
        });
    });

    router.get("/seller",function(req,res){
        var product = [];
        var seller = [];
        self.getProduct(router,connection,md5, function(product){
            self.getSeller(router,connection,md5,res,  function(seller){
              res.render('seller', { product: product, seller: seller});
           });

        });

    });

    router.get("/product",function(req,res){
        self.getProduct(router,connection,md5, function(result){
          res.render('product', { product: result});
        });
    });

    router.post("/user",function(req,res){
       var query = "INSERT INTO ??(??,??) VALUES (?,?)";
       var type = req.body.type;
        var table = ["user","user_name","user_type",req.body.username, req.body.type];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                if(type=="S"){
                   self.getProduct(router,connection,md5, function(result){
                      res.render('seller', { product: result});
                    });
                }
                else{
                   self.getProduct(router,connection,md5, function(result){
                     res.render('buyer', { product: result});
                  });
                }
            }
        });
    });

    router.post("/product",function(req,res){
        var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["product","product","description",req.body.product, req.body.description];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                self.getProduct(router,connection,md5, function(result){
                  res.render('product', { product: result});
                });
            }
        });
    });


}

module.exports = REST_ROUTER;