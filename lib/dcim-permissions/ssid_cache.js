var redis = require("dcim-redis").redis;

module.exports.set = function(ssid, user, callback) {
	var key = 'ssId:' + ssid;
	redis.set(key, JSON.stringify(user), function(err, result) {
		if (err) {
			callback(err);
		} else {
			//redis.expire(key, 300);
			callback();
		}
	});
};

module.exports.get = function(ssid, callback) {
	var key = 'ssId:' + ssid;
	redis.get(key, function(err, result) {
		if (err) {
			logger.error(err);
			callback(err);
		} else {
			if (result) {
				callback(null, JSON.parse(result));
				//redis.expire(key, 300);
			} else {
				logger.info(result);
				callback("not login");
			}
		}
	});
};

module.exports.remove = function(ssid, callback) {
	var key = 'ssId:' + ssid;
	redis.del(key, function(err, result) {
		if (err) {
			callback(err);
		} else {
			callback();
		}
	});
};