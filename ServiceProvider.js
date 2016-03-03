var consul = require('consul')();

function ServiceProvider() {

}
ServiceProvider.prototype.getNodesByServiceName = function(serviceName, callback) {
	consul.catalog.service.nodes(serviceName, function(err, result) {
		console.dir(err);
		console.dir(result);
		callback(err, result);
	});
};
ServiceProvider.prototype.getNodeByServiceName = function(serviceName, callback) {
	return this.getNodesByServiceName(serviceName, function(err, result) {
		callback(err, result[0]);
	});
};
module.exports = ServiceProvider;
