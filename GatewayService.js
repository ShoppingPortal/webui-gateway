var request = require("request");
function GatewayService(serviceProvider) {
	var self= this;
	self.serviceProvider = serviceProvider;
	self.loaded = false;

	self.serviceProvider.getNodeByServiceName("GATEWAY-SERVICE", function(err, node) {
		console.log(node);
		if(node) {
			self.loaded = true;
			self.baseURL = "http://" + node.Address + ":" + node.ServicePort;
		} else {
			console.log("error: gateway service down")
		}
	});
}

GatewayService.prototype.getProducts = function(callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/product/list";
		request.get(url, function(err, response, result) {
			if(err){
				callback(err);
			} else {
				result = JSON.parse(result);
				callback(null, result.data);
			}
		});
	} else {
		console.log("Service not ready.");
		callback("Service not ready.");
	}
};

GatewayService.prototype.addProduct = function(data, callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/product/addProduct";
		request({
			"method": 'POST',
			"url": url,
			"headers": {
				"content-type":"application/json"
			},
			"body": JSON.stringify(data)
		}, function(err, response, result) {
			callback(err, result);
		});
	} else {
		console.log("Service not ready.");
		callback("Service not ready.");
	}
};

GatewayService.prototype.getSellers = function(callback) {
	this.getUsers({"type" : "seller"}, callback);
};

GatewayService.prototype.getBuyers = function(callback) {
	this.getUsers({"type" : "buyer"}, callback);
};

GatewayService.prototype.getUsers = function(params, callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/user/list";
		var query = {};
		if(params) {
			if(params.type === "seller") {
				query.type = "S";
			} else if(params.type === "buyer") {
				query.type = "B";
			}
		}
		request.get({
			"url" : url,
			"qs" : query
		}, function(err, response, result) {
			if(err){
				callback(err);
			} else {
				result = JSON.parse(result);
				callback(null, result.data);
			}
		});
	} else {
		console.log("Service not ready.");
		callback("Service not ready.");
	}
};

module.exports = GatewayService;
