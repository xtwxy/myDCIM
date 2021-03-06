$(document).ready(
		function() {
			var objectNodeUrl = 'logicobject/objectNodes';
			var regionUrl = "logicobject/regions";
			var $node = $('#region-datagrid');

			WUI.region = WUI.region || {};

			var currentRegionObject = null;
			function reload(publish) {
				$node.datagrid("reload");
				if (publish) {
					WUI.publishEvent('reload_object', {
						publisher : "region-configer",
						object : currentRegionObject
					});
				}
			}

			function openObject(regionObject) {
				if (!WUI.regionTypes[regionObject.REGION_TYPE]) {
					return;
				}
				currentRegionObject = regionObject;
				var toobar = [];
				for (var i = 0; i < WUI.regionTypes[regionObject.REGION_TYPE].childTypes.length; i++) {
					var childRegionTypeId = WUI.regionTypes[regionObject.REGION_TYPE].childTypes[i];
					var childRegionTypeCfg = WUI.regionTypes[childRegionTypeId];
					toobar.push({
						iconCls : 'icon-add',
						text : '添加【' + childRegionTypeCfg.name + '】',
						handler : function() {
							regionDialog(null, regionObject.ID, childRegionTypeId);
						}
					});
				}
				toobar.push('-');
				toobar.push({
					iconCls : 'icon-reload',
					text : '刷新',
					handler : function() {
						reload(true);
					}
				});
				$node.datagrid({
					url : regionUrl,
					queryParams : {
						parentId : regionObject.ID
					},
					fit : true,
					border : false,
					method : "get",
					singleSelect : true,
					onLoadError : WUI.onLoadError,
					toolbar : toobar,
					columns : [ [
							{
								field : 'action',
								title : '操作',
								width : 100,
								align : 'center',
								formatter : function(value, row, index) {
									var e = '<div class="icon-edit operator-tool" title="修改" '
											+ ' onclick="WUI.region.editrow(this)"></div> ';
									var s = '<div class="separater"></div> ';
									var d = '<div class="icon-remove operator-tool" title="删除" '
											+ ' onclick="WUI.region.deleterow(this)"></div>';
									return e + s + d;
								}
							}, {
								field : 'REGION_TYPE',
								title : '区域级别',
								width : 80,
								formatter : function(value, row, index) {
									return WUI.regionTypes[row.REGION_TYPE].name;
								}
							}, {
								field : 'CODE',
								title : '行政编码',
								align : 'right',
								width : 80
							}, {
								field : 'NAME',
								title : '名称',
								width : 150
							}, {
								field : 'ABBREVIATION',
								title : '简称',
								width : 150
							}, {
								field : 'LONGITUDE',
								title : '经度(度)',
								width : 150,
								formatter : function(value, row, index) {
									return row.LONGITUDE.toFixed(6);
								}
							}, {
								field : 'LATITUDE',
								title : '纬度(度)',
								width : 150,
								formatter : function(value, row, index) {
									return row.LATITUDE.toFixed(6);
								}
							}, WUI.pageConfiger.createConfigerColumn("region") ] ]
				});
			}
			WUI.region.editPage = function(target) {
				var region = WUI.getDatagridRow($node, target);
				WUI.pageConfiger.pageDialog(region);
			};
			window.WUI.publishEvent('request_current_object', {
				publisher : 'position-configer',
				cbk : openObject
			});

			WUI.region.editrow = function(target) {
				var region = WUI.getDatagridRow($node, target);
				regionDialog(region, region.PARENT_ID, region.REGION_TYPE);
			};
			WUI.region.deleterow = function(target) {
				var region = WUI.getDatagridRow($node, target);
				var typeName = WUI.regionTypes[region.REGION_TYPE].name;
				$.messager.confirm('确认', '确定要删除' + typeName + '【' + region.NAME + '】吗?', function(r) {
					if (r) {
						WUI.ajax.remove(objectNodeUrl + "/" + region.ID, {}, function() {
							reload(true);
						}, function() {
							$.messager.alert('失败', "删除" + typeName + "失败！");
						});
					}
				});
			};
			function regionDialog(region, parentId, regionType) {
				var typeName = WUI.regionTypes[regionType].name;
				var cfg = {
					iconCls : region ? "icon-edit" : "icon-add",
					title : (region ? "修改" : "添加") + typeName,
					left : ($(window).width() - 300) * 0.5,
					top : ($(window).height() - 300) * 0.5,
					width : 450,
					closed : false,
					cache : false,
					href : WUI.getConfigerDialogPath(WUI.objectTypes[WUI.objectTypeDef.REGION].namespace),
					onLoadError : function() {
						$.messager.alert('失败', "对话框加载失败，请刷新后重试！");
					},
					onLoad : function() {
						var $zipCodeSel = $('#region-zip-code-txt');
						$zipCodeSel.combobox({
							url : 'position-configer/regionCode',
							method : 'get',
							queryParams : {
								id : parentId
							},
							editable : false,
							required : true,
							valueField : 'code',
							textField : 'name',
							onSelect : function(rec) {
								$('#region-name-txt').textbox("setValue", rec.name);
							},
							onLoadSuccess : function() {
								if (region) {
									$zipCodeSel.combobox("setValue", region.CODE);
								}
							},
							keyHandler : {
								down : function(e) {
									$zipCodeSel.combobox("showPanel");
								}
							}
						});
						if (region) {
							$('#region-name-txt').textbox("setValue", region.NAME);
							$zipCodeSel.combobox("setValue", region.CODE);
							$('#region-ABBREVIATION-txt').textbox("setValue", region.ABBREVIATION);
							$('#region-LONGITUDE-txt').numberbox("setValue", region.LONGITUDE);
							$('#region-LATITUDE-txt').numberbox("setValue", region.LATITUDE);
							$('#region-name-txt').textbox("isValid");
							$('#region-zip-code-txt').combobox("isValid");
							$('#region-ABBREVIATION-txt').textbox("isValid");
						} else {
							$('#region-LONGITUDE-txt').numberbox("setValue", currentRegionObject.LONGITUDE);
							$('#region-LATITUDE-txt').numberbox("setValue", currentRegionObject.LATITUDE);
						}
					},
					modal : true,
					onClose : function() {
						$("#configer-dialog").empty();
					},
					buttons : [ {
						text : '保存',
						handler : function() {
							var isValid = $('#region-name-txt').textbox("isValid");
							isValid = isValid && $('#region-zip-code-txt').combobox("isValid");
							isValid = isValid && $('#region-ABBREVIATION-txt').textbox("isValid");
							if (!isValid) {
								return;
							}

							var newRegion = {
								NAME : $('#region-name-txt').textbox("getValue"),
								ABBREVIATION : $('#region-ABBREVIATION-txt').textbox("getValue"),
								CODE : $('#region-zip-code-txt').combobox("getValue"),
								LONGITUDE : parseFloat($('#region-LONGITUDE-txt').numberbox("getValue")),
								LATITUDE : parseFloat($('#region-LATITUDE-txt').numberbox("getValue")),
								OBJECT_TYPE : WUI.objectTypeDef.REGION,
								REGION_TYPE : regionType,
								PARENT_ID : parentId,
								params : {}
							};

							if (region) {
								newRegion.ID = region.ID;
								WUI.ajax.put(objectNodeUrl + "/" + newRegion.ID, newRegion, function() {
									$('#configer-dialog').dialog("close");
									reload(true);
								}, function() {
									$.messager.alert('失败', "修改" + typeName + "失败！");
								});
							} else {
								WUI.ajax.post(objectNodeUrl, newRegion, function() {
									$('#configer-dialog').dialog("close");
									reload(true);
								}, function() {
									$.messager.alert('失败', "添加" + typeName + "失败！");
								});
							}
						}
					}, {
						text : '取消',
						handler : function() {
							$('#configer-dialog').dialog("close");
						}
					} ]
				};
				$('#configer-dialog').dialog(cfg);
			}
		});
