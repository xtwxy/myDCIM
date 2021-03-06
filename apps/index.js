var app = require('./app');
var config = require('dcim-config');
var db = require('dcim-db');
var permissions = require('dcim-permissions');
var util = require("dcim-util");

require('./self-diagnosis');
require('./alarm-status');

app.use(function(req, res, next) {
	if (req.url.match("/roadmap/*")) {
		res.redirect("/images/blank_map.png");
	} else {
		next();
	}
});

app.put('/setPassword', function(req, res) {
	var password = req.body;
	permissions.getCurrentUser(req, res, function(error, user) {
		if (error) {
			res.status(401).send(error);
			return;
		}
		db.doTransaction(function(connection) {
			return [
					function(callback) {
						var selectSql = 'select LOGIN_PASSWORD from  portal.ACCOUNT where ID=?';
						connection.query(selectSql, [ user.ID ], function(err, result) {
							if (err) {
								callback(err);
								return;
							}
							if (result.length < 1
									|| result[0].LOGIN_PASSWORD !== util.transToSha1(password.OLD_PASSWORD)) {
								callback("口令错误");
							} else {
								callback();
							}
						});
					},
					function(callback) {
						var sql = 'update portal.ACCOUNT set LOGIN_PASSWORD=?,PASSWORD_TIME=sysdate() where ID=?';
						connection.query(sql, [ util.transToSha1(password.NEW_PASSWORD), user.ID ], function(err,
								result) {
							callback(err);
						});
					},
					function(callback) {
						var sql = 'insert into portal.ACCOUNT_PASSWORD_LOG(ACCOUNT_ID,CHANGE_TIME,'
								+ 'NEW_PASSWORD,OLD_PASSWORD)values(?,sysdate(),?,?)';
						var oldPassword = util.transToSha1(password.OLD_PASSWORD);
						var newPassword = util.transToSha1(password.NEW_PASSWORD);
						var params = [ user.ID, oldPassword, newPassword ];
						connection.query(sql, params, function(err, result) {
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
});

function getTheme(user, req, cbk) {
	if (req.cookies.theme) {
		cbk(req.cookies.theme);
	} else {
		cbk(user.DEFAULT_THEME);
	}
};

function checkRight(account, menuId) {
	if (account.IS_GOD) {
		return true;
	}
	if (!account.right) {
		account.right = {};
	}
	return account.right.menus.indexOf(menuId) >= 0;
}
function setMenu(body, account, menus, path, req) {
	var mainMenus = [];
	for ( var i = 0; i < menus.length; i++) {
		var menu = util.deepClone(menus[i]);
		menu.selected = false;
		body.url = path;
		body.border = false;
		var childMenus = [];
		for ( var j = 0; j < menu.childMenus.length; j++) {
			var childMenu = menu.childMenus[j];
			if (checkRight(account, childMenu.id)) {
				if (childMenu.url === path) {
					menu.selected = true;
					body.title = childMenu.title;
					childMenu.class = "panel-header";
					body.border = childMenu.border;
					body.scripts = childMenu.scripts ? util.deepClone(childMenu.scripts) : [];
					if (req.cookies.enableMap && childMenu.scriptsMap) {
						body.scripts = body.scripts.concat(childMenu.scriptsMap);
					}
					if (req.cookies.enable3D && childMenu.scripts3D) {
						body.scripts = body.scripts.concat(childMenu.scripts3D);
					}
					body.links = childMenu.links;
				} else {
					childMenu.class = "";
				}
				childMenus.push(childMenu);
			}
		}
		menu.childMenus = childMenus;
		if (childMenus.length > 1) {
			mainMenus.push(menu);
		}else if(childMenus.length === 1){
			menu.url=childMenus[0].url;
			menu.name=childMenus[0].name;
			menu.icon=childMenus[0].icon;
			mainMenus.push(menu);
		}
	}
	body.menus = mainMenus;
}

function findMenu(menuId) {
	for ( var i = 0; i < config.menus.length; i++) {
		var childMenus = config.menus[i].childMenus;
		for ( var j = 0; j < childMenus.length; j++) {
			if (childMenus[j].id === menuId) {
				return childMenus[j].url;
			}
		}
	}
}
app.get('/index.html', function(req, res) {
	// var isMobile = req.headers['user-agent'].match(/AppleWebKit.*Mobile.*/);
	permissions.getCurrentUser(req, res, function(error, account) {
		if (error) {
			logger.error(error);
			res.render('login', {});
			return;
		}
		getTheme(account, req, function(theme) {
			var body = {};
			body.userName = account.NAME;
			body.systemName = config.systemName;
			body.copyRightText = config.copyRightText;
			body.company = config.company;
			body.logo = config.logo;
			body.theme = theme;
			var homePage = findMenu(account.HOME_PAGE);
			var page = req.query.page || homePage || "dashboard/dashboard.html";
			setMenu(body, account, config.menus, page, req);
			res.render('index', body);
		});
	});
});

module.exports = app;