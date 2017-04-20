var objectExt = require('./object-ext');

module.exports.getByPositionParent = function(pool, parentId, callback) {
	var sql = 'select o.ID,o.NAME,o.OBJECT_TYPE,p.PARENT_ID,a.REGION_TYPE,a.ABBREVIATION,a.ZIP_CODE,'
			+ 'a.LONGITUDE,a.LATITUDE from config.OBJECT o ' + 'join config.POSITION_RELATION p on o.ID=p.ID '
			+ 'join config.ADMINISTRATIVE_REGION a on o.ID=a.ID where p.PARENT_ID=?';
	pool.query(sql, [ parentId ], function(error, objects, fields) {
		if (error) {
			callback(error);
			return;
		}
		objectExt.getByPositionParent(pool, parentId, function(error, objectExts) {
			if (error) {
				callback(error);
				return;
			}
			for (var i = 0; i < objects.length; i++) {
				objects[i].properties = [];
				for (var j = 0; j < objectExts.length; j++) {
					objects[i].properties.push({
						PRO_NAME : objectExts[j].PRO_NAME,
						VALUE_TYPE : objectExts[j].VALUE_TYPE,
						PRO_VALUE : objectExts[j].PRO_VALUE
					});
				}
			}
			callback(error, objects);
		});
	});
};

module.exports.getById = function(pool, id, callback) {
	var sql = 'select o.ID,o.NAME,o.OBJECT_TYPE,p.PARENT_ID,a.REGION_TYPE,a.ABBREVIATION,a.ZIP_CODE,'
			+ 'a.LONGITUDE,a.LATITUDE from config.OBJECT o ' + 'left join config.POSITION_RELATION p on o.ID=p.ID '
			+ 'left join config.ADMINISTRATIVE_REGION a on o.ID=a.ID where o.ID=?';
	pool.query(sql, [ id ], function(error, objects, fields) {
		if (error) {
			callback(error);
			return;
		}
		if (objects.length === 0) {
			callback("not found object:" + id);
			return;
		}
		objectExt.getByObjectId(pool, id, function(error, objectExts) {
			if (error) {
				callback(error);
				return;
			}
			objects[0].properties = objectExts;
			callback(error, objects[0]);
		});
	});
};

module.exports.createInsertTasks = function(connection, tasks, region) {
	tasks.push(function(regionId, callback) {
		var sql = 'INSERT INTO config.ADMINISTRATIVE_REGION(ID,REGION_TYPE,ABBREVIATION,ZIP_CODE,'
				+ 'LONGITUDE,LATITUDE)values(?,?,?,?,?,?)';
		connection.query(sql, [ regionId, region.REGION_TYPE, region.ABBREVIATION, region.ZIP_CODE, region.LONGITUDE,
				region.LATITUDE ], function(err, result) {
			callback(err, regionId);
		});
	});
};

module.exports.createUpdateTasks = function(connection, tasks, region) {
	tasks.push(function(regionId, callback) {
		var sql = 'update config.ADMINISTRATIVE_REGION set REGION_TYPE=?,ABBREVIATION=?,'
				+ 'ZIP_CODE=?,LONGITUDE=?,LATITUDE=? where ID=?';
		connection.query(sql, [ region.REGION_TYPE, region.ABBREVIATION, region.ZIP_CODE, region.LONGITUDE,
				region.LATITUDE, regionId ], function(err, result) {
			callback(err, regionId);
		});
	});
};

module.exports.createDeleteTasks = function(connection, tasks, objectId) {
	tasks.push(function(callback) {
		var sql = 'delete from config.ADMINISTRATIVE_REGION where ID=?';
		connection.query(sql, [ objectId ], function(err, result) {
			callback(err);
		});
	});
};