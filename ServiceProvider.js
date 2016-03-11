var consul = require('consul')();

function ServiceProvider() {

}
ServiceProvider.prototype.getNodesByServiceName = function(serviceName, callback) {
	consul.catalog.service.nodes(serviceName, function(err, result) {		
		if(err){
			callback(err);
		}else{
			callback(err, result);
		}
	});
};
ServiceProvider.prototype.getNodeByServiceName = function(serviceName, callback) {
	return this.getNodesByServiceName(serviceName, function(err, result) {
		if(err){
			callback("Internal server error.");
			//res.render('500.ejs', { url: req.url });
		}else{
			if(result.length == 0){				
				callback("gateway service is not ready.");
			}else{
				callback(null, result[0]);
			}
		}
	});
};
module.exports = ServiceProvider;
