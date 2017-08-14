$(function() {
	var objectNodeUrl = 'logicobject/objectNodes';
	var deviceModelUrl = "device-model/deviceModels";
	var deviceVenderUrl = "device-vender/deviceVenders";
	var statusUrl = 'detail/deviceStatus';
	var pageConfigUrl = 'detail/pageConfig/';

	var publisherName = "detail";
	var currentObject = null;
	WUI.detail = WUI.detail || {};
	var signalObjects = [];
	var requestIds = [];
	function openObject(deviceObject) {
		currentObject = deviceObject;

		$('#device-code-txt').text(currentObject.CODE);
		for (var i = 0; i < WUI.deviceTypes.length; i++) {
			if (WUI.deviceTypes[i].type === currentObject.DEVICE_TYPE) {
				$('#device-type-txt').text(WUI.deviceTypes[i].name);
				break;
			}
		}

		WUI.ajax.get(deviceModelUrl, {}, function(results) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].ID === currentObject.MODEL) {
					var model = results[i];
					$('#device-model-txt').text(model.NAME);
					break;
				}
			}
		}, function() {
			$.messager.alert('失败', "读取设备型号失败，请重试！");
		});
		WUI.ajax.get(deviceVenderUrl, {}, function(results) {
			for (var i = 0; i < results.length; i++) {
				if (results[i].ID === currentObject.VENDER) {
					var model = results[i];
					$('#device-vender-txt').text(model.NAME);
					break;
				}
			}
		}, function() {
			$.messager.alert('失败', "读取设备厂家失败，请重试！");
		});

		$('#device-rated-power').text(WUI.getPropertyValue(currentObject.properties, "ratedPower"));

		WUI.ajax.get(pageConfigUrl + currentObject.ID, {}, createPage, function() {
			createPage({
				img : 'u941.jpg',
				inputs : [ {
					name : '电流',
					type : 1,
					fixedNum : 1,
					idA : 121001,
					idB : 121001,
					idC : 121001,
					unit : 'A'
				}, {
					name : '电压',
					type : 1,
					fixedNum : 1,
					idA : 121001,
					idB : 121001,
					idC : 121001,
					unit : 'V'
				}, {
					name : '功率因素',
					type : 1,
					fixedNum : 3,
					idA : 121001,
					idB : 121001,
					idC : 121001,
					unit : ''
				}, {
					name : '功率',
					type : 1,
					fixedNum : 2,
					idA : 121001,
					idB : 121001,
					idC : 121001,
					unit : 'KW'
				} ],
				outputs : [ {
					name : '工作状态',
					type : 0,
					signalId : 025001,
				}, {
					name : '交流A',
					type : 1,
					fixedNum : 1,
					signalId : 125001,
					unit : 'A'
				}, {
					name : '交流B',
					type : 1,
					fixedNum : 1,
					signalId : 126001,
					unit : 'A'
				}, {
					name : '交流C',
					type : 1,
					fixedNum : 1,
					signalId : 127001,
					unit : 'A'
				}, {
					name : '功率',
					type : 1,
					fixedNum : 2,
					signalId : 128001,
					unit : 'KW'
				} ]
			});
		});

	}
	function createPage(pageConfig) {
		createInputPanel(pageConfig);
		createOutputPanel(pageConfig);
		requestStatus();
		WUI.detail.initImg($("#ups-img"), pageConfig.img, currentObject);
	}
	function createInputPanel(pageConfig) {
		$('#ups-input-panel').empty();
		var inputCount = WUI.getPropertyValue(currentObject.properties, "inputCount");
		if (!inputCount) {
			return;
		}
		inputCount = parseInt(inputCount, 10);
		for (var i = 0; i < inputCount; i++) {
			$('#ups-input-panel').append(createInputLoad(i, pageConfig.inputs));
		}
	}
	function createInputLoad(loadNum, inputs) {
		var $table = $(document.createElement("table"));
		$table.addClass("table");
		$table.attr("cellspacing", "0");
		$table.css("float", "left");
		$table.css("margin", "5px");
		$table.append($("<caption></caption>").html('<label>第' + (loadNum + 1) + '路</label>'));
		$table.append('<tr><th class="ups-load-item"></th><th class="ups-load-item">A相</th>'
				+ '<th class="ups-load-item">B相</th><th class="ups-load-item">C相</th></tr>');
		inputs.forEach(function(item) {
			$table.append(createInputRow(item, loadNum));
		});
		return $table;
	}

	function createValueItem($tr, signalId, loadNum, config) {
		signalId = parseInt(signalId, 10) + loadNum;
		signalObjects.push(WUI.detail.createTableItem($tr, signalId, config));
		requestIds.push({
			objectId : currentObject.ID,
			signalId : signalId
		});
	}
	function createInputRow(item, loadNum) {
		var $tr = $(document.createElement("tr"));
		WUI.detail.createTableHead($tr, "ups-load-item", item.name);
		var config = {
			className : "ups-load-value",
			type : item.type,
			unit : item.unit,
			fixedNum : item.fixedNum
		};

		createValueItem($tr, item.idA, loadNum, config);
		createValueItem($tr, item.idB, loadNum, config);
		createValueItem($tr, item.idC, loadNum, config);

		return $tr;
	}

	function createOutputPanel(pageConfig) {
		$('#ups-output-panel').empty();
		var outputCount = WUI.getPropertyValue(currentObject.properties, "outputCount");
		if (!outputCount) {
			outputCount = 0;
		}
		outputCount = parseInt(outputCount, 10);
		var $table = $(document.createElement("table"));
		$table.addClass("table");
		$table.attr("cellspacing", "0");
		$table.css("float", "left");
		$table.css("margin", "5px");
		$('#ups-output-panel').append($table);
		var $tr = $(document.createElement("tr"));
		$table.append($tr);
		$tr.append('<th class="ups-load-item"></th>');
		for (var i = 0; i < outputCount; i++) {
			$tr.append('<th class="ups-load-item">支路' + (i + 1) + '</th>');
		}
		pageConfig.outputs.forEach(function(item) {
			var $tr = $(document.createElement("tr"));
			$table.append($tr);
			$tr.append('<th class="ups-load-item">' + item.name + '</th>');
			for (var i = 0; i < outputCount; i++) {
				var config = {
					className : "ups-load-value",
					type : item.type,
					unit : item.unit,
					fixedNum : item.fixedNum
				};
				createValueItem($tr, item.signalId, i, config);
			}
		});
	}

	function setAlarmCount(alarmCount) {
		if (alarmCount) {
			$("#device-alarmLevel1-count").text(alarmCount.alarmLevel1Count);
			$("#device-alarmLevel2-count").text(alarmCount.alarmLevel2Count);
			$("#device-alarmLevel3-count").text(alarmCount.alarmLevel3Count);
			$("#device-alarmLevel4-count").text(alarmCount.alarmLevel4Count);
		}
	}
	function setValue(values) {
		signalObjects.forEach(function(item) {
			var value = WUI.detail.findValue(currentObject.ID, item.signalId, values);
			if (value) {
				WUI.detail.setTableItemValue(item, value);
			}
		});
		var linkStatus = WUI.detail.findValue(currentObject.ID, 1, values);
		if (linkStatus) {
			item.$node.html('<span class="' + (linkStatus.value ? "detail-on-icon" : "detail-off-icon") + '"></span>');
		}
	}
	function requestStatus() {
		if (WUI.detail.realtimeValueTimer) {
			clearTimeout(WUI.detail.realtimeValueTimer);
			WUI.detail.realtimeValueTimer = null;
		}
		WUI.ajax.post(statusUrl, {
			objectId : currentObject.ID,
			requestIds : requestIds
		}, function(result) {
			WUI.detail.realtimeValueTimer = setTimeout(requestStatus, WUI.monitor.REALTIME_VALUE_INTEVAL);
			if (result.alarmCount) {
				setAlarmCount(result.alarmCount);
			}
			if (result.signalValues) {
				setValue(result.signalValues);
			}
		}, function() {
			WUI.detail.realtimeValueTimer = setTimeout(requestStatus, WUI.monitor.REALTIME_VALUE_INTEVAL);
		});
	}
	window.WUI.publishEvent('request_current_object', {
		publisher : publisherName,
		cbk : function(object) {
			openObject(object);
		}
	});

});
