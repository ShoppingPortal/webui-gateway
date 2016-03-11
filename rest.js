var mysql = require('mysql');
var async = require('async');

function REST_ROUTER(router,connection, gatewayService) {
    var self = this;
    self.gatewayService = gatewayService;
    self.handleRoutes(router,connection);
}

REST_ROUTER.prototype.getProduct= function(router,connection, callback) {
    var self = this;
    /*var query = "SELECT * FROM ??";
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
        });*/

        self.gatewayService.getProducts(function(err, result) {
            if(err) {
                callback(err);
            } else {
				callback(null, result);
			}
        });
}

REST_ROUTER.prototype.getSeller= function(router,connection,res, callback) {
    var self = this;

    /*var query = "SELECT * FROM ?? WHERE user_type='S'";
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
    });*/

    self.gatewayService.getSellers(function(err, result) {
        if(err) {
            callback(err);
        } else {
			callback(null, result);
		}
    });
}

REST_ROUTER.prototype.getBuyer= function(router,connection,res, callback) {
    var self = this;
    /*var query = "SELECT * FROM ?? WHERE user_type='B'";
    var table = ["user"];
    var buyer = [];
    query = mysql.format(query,table);
    connection.query(query,function(err,rows){
        if(err) {
            res.json({"Error" : true, "Message" : err});
        } else {
           
             for( var i in rows){               
                buyer.push(rows[i]);
            }
            callback(buyer);
        }
    });*/


    self.gatewayService.getBuyers(function(err, result) {
        if(err) {
            callback(err);
        } else {
			callback(null, result);
		}
    });
}


REST_ROUTER.prototype.handleRoutes= function(router,connection) {
    var self = this;
    router.get("/user",function(req,res){
       res.render('register');
    });

    router.get("/buyer",function(req,res){
		
		//used async node module to get product and buyer details before page render
		async.parallel([
			function(callback){
				self.getProduct(router,connection, function(err, product){
					if(err){
						callback(err);
					}else{						
						callback(err, product);
					}
				});
			},
			function(callback){
				self.getBuyer(router,connection,res,  function(err, buyer){
					if(err){
						callback(err);
					}else{						
						callback(err, buyer);
					}
				});
			}
		],
		// optional callback
		function(err, results){			
			if(err){
				res.render('500');
			}else{
				res.render('buyer', { product: results[0], buyer: results[1]});
			}				
		});
    });

    router.get("/seller",function(req,res){
        
		//used async node module to get product and seller details before page render
		async.parallel([
			function(callback){
				self.getProduct(router,connection, function(err, product){
					if(err){
						callback(err);
					}else{						
						callback(err, product);
					}
				});
			},
			function(callback){
				self.getSeller(router,connection,res,  function(err, seller){
					if(err){
						callback(err);
					}else{						
						callback(err, seller);
					}
				});
			}
		],
		// optional callback
		function(err, results){
			if(err){
				res.render('500');
			}else{
				res.render('seller', { product: results[0], seller: results[1]});
			}				
		});
    });

    router.get("/product",function(req,res){
        /*self.getProduct(router,connection, function(result){
          res.render('product', { product: result});
        });
        */
        self.gatewayService.getProducts(function(err, result) {
            if(!err) {
                res.render('product', { product: result});
            }
        });
    });

    router.post("/user",function(req,res){
		var data = {
			"userName" : req.body.username,
			"userType" : req.body.type
		}
		self.gatewayService.addUser(data, function(err, result) {
			if(err) {
				if(err == "User already exist"){
					console.log(err);
				}else{
					res.render("500");
				}
            } else {
                self.getProduct(router,connection, function(err, result){
					if(err){
						res.render("500");
					}else{
						res.render('product', { product: result});
					}
                });
            }
		});
       /*var query = "INSERT INTO ??(??,??) VALUES (?,?)";
       var type = req.body.type;
        var table = ["user","user_name","user_type",req.body.username, req.body.type];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query", err: err});
            } else {
                if(type=="S"){
                    self.getProduct(router,connection, function(err, product){
                        self.getSeller(router,connection,res,  function(err, seller){
                          res.render('seller', { product: product, seller: seller});
                       });
                    });
                }
                else{
                   self.getProduct(router,connection, function(err, product){
                        self.getBuyer(router,connection,res,  function(err, buyer){
                          res.render('buyer', { product: product, buyer: buyer});
                       });
                    });
                }
            }
        });*/
    });

	router.post("/inventory",function(req,res){
		var data = {
			"userId" : req.body.product,
			"productId" : req.body.sellerName,
			"quantity" : req.body.quantity,
			"unitPrice" : req.body.price,
		}
		
		self.gatewayService.addInventory(data, function(err, result) {
            if(err) {
                res.render("500");
            } else {
                if(result.status == 200) {
                    res.redirect("/api/seller");
                } else {
                    res.redirect("/api/seller?error=save");
                }
            }
        });
	});
	
	router.post("/order",function(req,res){
		var data = {
			"userId" : req.body.product,
			"productId" : req.body.buyerName,
			"quantity" : req.body.quantity,
			"unitPrice" : req.body.price,
			"status" : "completed"
		}
		
		self.gatewayService.addOrder(data, function(err, result) {
            if(err) {
                res.render("500");
            } else {
                if(result.status == 200) {
                    res.redirect("/api/buyer");
                } else {
                    res.redirect("/api/buyer?error=save");
                }
            }
        });
	});
	
    router.post("/product",function(req,res){
        /*var query = "INSERT INTO ??(??,??) VALUES (?,?)";
        var table = ["product","product_name","description",req.body.product, req.body.description];
        query = mysql.format(query,table);
        connection.query(query,function(err,rows){
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                self.getProduct(router,connection, function(result){
                  res.render('product', { product: result});
                });
            }
        });*/

        var data = {
            "productName" : req.body.product, 
            "description" : req.body.description
        }
        self.gatewayService.addProduct(data, function(err, result) {
            if(err) {
                res.json({"Error" : true, "Message" : "Error executing MySQL query"});
            } else {
                if(result.status == 200) {
                    res.redirect("/api/product");
                } else {
                    res.redirect("/api/product?error=save");
                }
            }
        });

    });
}

module.exports = REST_ROUTER;
