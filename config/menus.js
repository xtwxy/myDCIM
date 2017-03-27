module.exports = [ {
	id : 1,
	name : "实时监控",
	childMenus : [ {
		id : 11,
		title : "主页",
		url : "dashboard/dashboard.html",
		border : false,
		name : "主页"
	}, {
		id : 12,
		title : "监控系统",
		url : "monitor/monitor.html",
		scripts : [ {
			type : "text/javascript",
			src : "mapfiles/mapapi.js"//"http://api.map.baidu.com/api?v=2.0&ak=ViOy1lFYqsLHS3nyhwYtLPTTifS24qcY"
		} ],
		border : false,
		name : "监控系统"
	}, {
		id : 13,
		title : "活动告警",
		url : "alarm/active-alarm.html",
		border : true,
		name : "活动告警"
	}, {
		id : 14,
		title : "历史告警",
		url : "alarm/history-alarm.html",
		border : true,
		name : "历史告警"
	}, {
		id : 15,
		title : "温度场图",
		url : "heatmap/heatmap.html",
		border : true,
		name : "温度场图"
	} ]
}, {
	id : 2,
	name : "门禁管理",
	childMenus : [ {
		id : 21,
		title : "门禁监控",
		url : "door/monitor-workspace.html",
		border : false,
		name : "门禁监控"
	}, {
		id : 22,
		title : "门禁配置",
		url : "door/configer.html",
		border : false,
		name : "门禁配置"
	}, {
		id : 23,
		title : "门卡管理",
		url : "door/card.html",
		border : false,
		name : "门卡管理"
	}, {
		id : 24,
		title : "门卡授权",
		url : "door/card-auth.html",
		border : false,
		name : "门卡授权"
	}, {
		id : 25,
		title : "开门记录统计",
		url : "door/record.html",
		border : true,
		name : "开门记录统计"
	} ]
}, {
	id : 3,
	name : "权限管理",
	childMenus : [ {
		id : 31,
		title : "部门管理",
		url : "account/department/department-wokspace.html",
		border : false,
		name : "部门管理"
	}, {
		id : 34,
		title : "角色管理",
		url : "account/role/role-wokspace.html",
		border : false,
		name : "角色管理"
	}, {
		id : 32,
		title : "人员管理",
		url : "account/personnel/personnel-wokspace.html",
		border : false,
		name : "人员管理"
	}, {
		id : 33,
		title : "帐号管理",
		url : "account/account/account-wokspace.html",
		border : false,
		name : "帐号管理"
	} ]
}, {
	id : 4,
	name : "基础设施管理",
	childMenus : [ {
		id : 41,
		title : "业务配置",
		url : "configer/object/wokspace.html",
		border : false,
		name : "业务配置"
	}, {
		id : 41,
		title : "机柜电源插座管理",
		url : "configer/power-panel/wokspace.html",
		border : false,
		name : "机柜电源插座管理"
	}, {
		id : 42,
		title : "机柜网口管理",
		url : "configer/net-panel/wokspace.html",
		border : false,
		name : "机柜网口管理"
	}, {
		id : 43,
		title : "机柜型号管理",
		url : "configer/cabinet-model/wokspace.html",
		border : false,
		name : "机柜型号管理"
	}, {
		id : 44,
		title : "设备厂家管理",
		url : "configer/vender/wokspace.html",
		border : false,
		name : "设备厂家管理"
	}, {
		id : 45,
		title : "设备型号管理",
		url : "configer/model/wokspace.html",
		border : false,
		name : "设备型号管理"
	} ]
}, {
	id : 5,
	name : "动环设施管理",
	childMenus : [ {
		id : 51,
		title : "环境设施管理",
		url : "PE/environment/wokspace.html",
		border : false,
		name : "环境设施管理"
	}, {
		id : 52,
		title : "动力设施管理",
		url : "PE/power/wokspace.html",
		border : false,
		name : "动力设施管理"
	}, {
		id : 53,
		title : "安防设施管理",
		url : "PE/safety/wokspace.html",
		border : false,
		name : "安防设施管理"
	}, {
		id : 54,
		title : "门禁设备管理",
		url : "PE-door.html",
		url : "../PE/door/wokspace.html",
		border : false,
		name : "门禁设备管理"
	}, {
		id : 55,
		title : "视频设备管理",
		url : "PE/vedio/wokspace.html",
		border : false,
		name : "视频设备管理"
	} ]
}, {
	id : 6,
	name : "IT设备管理",
	childMenus : [ {
		id : 65,
		title : "机架列管理",
		url : "configer/cabinet-column/wokspace.html",
		border : false,
		name : "机架列管理"
	}, {
		id : 66,
		title : "机架管理",
		url : "configer/cabinet/wokspace.html",
		border : false,
		name : "机架管理"
	}, {
		id : 61,
		title : "服务器管理",
		url : "itdevice-server.html",
		url : "../configer/server/server-wokspace.html",
		border : false,
		name : "服务器管理"
	}, {
		id : 62,
		title : "交换机管理",
		url : "configer/switch/switch-wokspace.html",
		border : false,
		name : "交换机管理"
	}, {
		id : 63,
		title : "路由器管理",
		url : "configer/route/route-wokspace.html",
		border : false,
		name : "路由器管理"
	}, {
		id : 64,
		title : "终端设备管理",
		url : "configer/terminal/terminal-equipment-wokspace.html",
		border : false,
		name : "终端设备管理"
	}, {
		id : 67,
		title : "机架机位申请",
		url : "itdevice/cabinet-unit/wokspace.html",
		border : false,
		name : "机架机位申请"
	} ]
}, {
	id : 7,
	name : "资产管理",
	childMenus : [ {
		id : 71,
		title : "器材管理",
		url : "assets/equipment/equipment-wokspace.html",
		border : false,
		name : "器材管理"
	}, {
		id : 72,
		title : "配件管理",
		url : "assets/accessories/accessories-wokspace.html",
		border : false,
		name : "配件管理"
	}, {
		id : 73,
		title : "资产报表",
		url : "assets/report/report-wokspace.html",
		border : false,
		name : "资产报表"
	} ]
} ];