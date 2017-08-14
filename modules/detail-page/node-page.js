var app = require('./app');

var db = require('dcim-db');
var objectDao = require('dcim-object-dao');
var util = require("dcim-util");
var config = require('dcim-config');

var path = require('path');
var fs = require('fs');

function getDefaultById(objectId, callback) {
	var sql = 'select o.ID,o.OBJECT_TYPE,d.DEVICE_TYPE from config.OBJECT o '
			+ 'left join config.DEVICE d on o.ID=d.ID where o.ID=?';
	db.pool.query(sql, [ objectId ], function(error, objects, fields) {
		if (error) {
			callback(error);
			return;
		}
		if (objects.length === 0) {
			callback("not found:" + objectId);
			return;
		}
		getDefaultPage(objects[0].OBJECT_TYPE, objects[0].DEVICE_TYPE, callback);
	});
}
function getDefaultPage(objectType, deviceType, callback) {
	var fileName = path.join(__dirname, 'page.json');
	try {
		fs.readFile(fileName, function(err, data) {
			if (err) {
				callback(err);
				return;
			}
			var pages = JSON.parse(data);
			var objectPage = pages[objectType];
			if (!objectPage) {
				callback(null, pages.defaultPage);
			}
			console.log(deviceType);
			console.log(objectPage.devicePages);
			if (deviceType || objectPage.devicePages) {
				var devicePage = objectPage.devicePages[deviceType];
				console.log(devicePage);
				if (devicePage) {
					callback(null, devicePage.defaultPage);
				} else {
					callback(null, objectPage.defaultPage);
				}
			} else {
				callback(null, objectPage.defaultPage)
			}
		});
	} catch (e) {
		callback(e);
	}
}

app.get('/detailPage/:id', function(req, res) {
	var objectId = parseInt(req.params.id, 10);
	var sql = 'select PAGE_NAME from detail_page.NODE_PAGE WHERE ID=?';
	db.pool.query(sql, [ objectId ], function(error, objects, fields) {
		if (error) {
			logger.error(error);
			res.status(500).send(error);
		} else {
			if (objects.length === 0) {
				getDefaultById(objectId, function(err, page) {
					if (err) {
						logger.error(err);
						res.status(500).send(err);
						return;
					}
					if (!page) {
						res.status(500).send("not found page:" + objectId);
						return;
					}
					res.send({
						page : page
					});
				});
			} else {
				res.send({
					page : objects[0].PAGE_NAME
				});
			}
		}
	});
});

app.get('/pageConfig/:id', function(req, res) {
	var objectId = parseInt(req.params.id, 10);
	var sql = 'select PAGE_NAME,CONFIG from detail_page.NODE_PAGE WHERE ID=?';
	db.pool.query(sql, [ objectId ], function(error, objects, fields) {
		if (error) {
			logger.error(error);
			res.status(500).send(error);
		} else {
			if (objects.length === 0) {
				res.status(404).send("not found:" + objectId);
			} else {
				res.send(objects[0]);
			}
		}
	});
});

app.put('/pageConfig/:id', function(req, res) {
	var objectId = parseInt(req.params.id, 10);
	var config = req.body;
	db.doTransaction(function(connection) {
		return [ function(callback) {
			var sql = 'REPLACE INTO detail_page.NODE_PAGE(ID,PAGE_NAME,CONFIG)values(?,?,?)';
			connection.query(sql, [ objectId, config.PAGE_NAME, JSON.stringify(config.CONFIG) ], function(err, result) {
				callback(err);
			});
		} ];
	}, function(error, result) {
		if (error) {
			logger.error(error);
			res.status(500).send(error);
		} else {
			res.status(204).end();
		}
	});
});

app.get('/detailPage', function(req, res) {
	var fileName = path.join(__dirname, 'page.json');
	try {
		fs.readFile(fileName, function(err, data) {
			if (err) {
				logger.error(err);
				res.status(500).send(err);
				return;
			}
			var pages = JSON.parse(data);
			var objectPage = pages[req.query.objectType];
			if (!req.body.deviceType) {
				res.send(objectPage.pages);
			} else {
				res.send(objectPage.deviceType[req.body.deviceType].pages);
			}
		});
	} catch (e) {
		logger.error(e);
		res.status(500).send(e);
	}
});