var request = require("request");
function GatewayService(serviceProvider) {
	var self= this;
	self.serviceProvider = serviceProvider;
	self.loaded = false;

	self.serviceProvider.getNodeByServiceName("GATEWAY-SERVICE", function(err, node) {
		if(err) {
			console.log(err);
			//callback(err);
		} else {
			self.loaded = true;
			self.baseURL = "http://" + node.Address + ":" + node.ServicePort;
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
				if(result.status == 500){
					callback("internal server error");
				}else{
					callback(null, result.data);
				}
			}
		});
	} else {
		callback("Service not ready.");
	}
};

GatewayService.prototype.addUser = function(data, callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/user/addUser";
		request({
			"method": 'POST',
			"url": url,
			"headers": {
				"content-type":"application/json"
			},
			"body": JSON.stringify(data)
		}, function(err, response, result) {
			result = JSON.parse(result);
			if(result.status == 400){
				callback(result.description);
			}else{
				callback(err, result);
			}
		});
	} else {
		callback("Service not ready.");
	}
};

GatewayService.prototype.addInventory = function(data, callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/inventory/create";
		request({
			"method": 'POST',
			"url": url,
			"headers": {
				"content-type":"application/json"
			},
			"body": JSON.stringify(data)
		}, function(err, response, result) {
			result = JSON.parse(result);			
			if(result.status == 500){
				callback("Internal server error");
			}else{
				callback(err, result);
			}
		});
	} else {
		callback("Service not ready.");
	}
};

GatewayService.prototype.addOrder = function(data, callback) {
	self = this;
	if(self.loaded) {
		var url = self.baseURL + "/api/order/insert";
		request({
			"method": 'POST',
			"url": url,
			"headers": {
				"content-type":"application/json"
			},
			"body": JSON.stringify(data)
		}, function(err, response, result) {
			result = JSON.parse(result);
			console.dir(data);			
			if(result.status == 500){
				callback("Internal server error");
			}else{
				callback(err, result);
			}
		});
	} else {
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
			result = JSON.parse(result);
			if(result.status == 500){
				callback(result.error);
			}else{
				callback(err, result);
			}
		});
	} else {
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
			result = JSON.parse(result);	
			if(err){
				callback(err);
			} else {
				if(result.status == 500){
					callback("internal server error");
				}else{
					callback(null, result.data);
				}
			}
		});
	} else {
		callback("Service not ready.");
	}
};

module.exports = GatewayService;
