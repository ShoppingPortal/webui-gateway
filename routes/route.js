var fs = require('fs');
module.exports = function(app, express) {
    app.get('/', function (req,res){
         res.render('register');
    });
   
   app.get('/seller', function (req,res){
         getProduct(__dirname+'/json/products.json', function(err, result){
          	var results = JSON.parse(result);
          	res.render('seller', {"product": results});
         });
    });
   
   app.get('/buyer', function (req,res){         
         getProduct(__dirname+'/json/products.json', function(err, result){
          	var results = JSON.parse(result);
          	res.render('buyer', {"product": results});
         });
    });
   
   app.get('/product', function (req,res){
         res.render('product');
    });

    function getProduct(filename, callback){
    	fs.readFile(filename, function (err, json) {
			  	if(err) {
			  		callback(err, null);
			  	}			 	
			 	else{
			 		console.log(JSON.parse(json));
			 		callback(null, json);			 		 
			 	}
		});
   }
}