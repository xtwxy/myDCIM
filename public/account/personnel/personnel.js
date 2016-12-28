$(function() {
	var personnelUrl = WUI.urlPath+"/account/personnels";
	var departmentUrl = WUI.urlPath+"/account/departments";
	$node = $('#personnel-grid');

	$node
			.datagrid({
				url : personnelUrl,
				method : "get",
				singleSelect : true,
				onLoadError : function(s) {
					$.messager.alert('失败', "加载失败");
				},
				toolbar : [ {
					iconCls : 'icon-add',
					handler : function() {
						personnelDialog();
					}
				}, '-', {
					iconCls : 'icon-reload',
					handler : function() {
						$node.datagrid("reload");
					}
				} ],
				columns : [ [
						{
							field : 'action',
							title : '操作',
							width : 100,
							align : 'center',
							formatter : function(value, row, index) {
								var e = '<div class="icon-edit operator-tool" title="修改" onclick="WUI.personnel.editrow(this)"></div> ';
								var s = '<div class="separater"></div> ';
								if (row.ENABLE) {
									var d = '<div class="icon-no operator-tool" title="禁用" onclick="WUI.personnel.disablerow(this)"></div>';
								} else {
									var d = '<div class="icon-ok operator-tool" title="启用" onclick="WUI.personnel.enablerow(this)"></div>';
								}
								return e + s + d;
							}
						},
						{
							field : 'ID',
							title : '编码',
							align : 'right',
							width : 80
						},
						{
							field : 'JOB_NUMBER',
							title : '工号',
							width : 150
						},
						{
							field : 'NAME',
							title : '姓名',
							width : 150
						},
						{
							field : 'E_MAIL',
							title : '邮箱',
							width : 100
						},
						{
							field : 'TEL',
							title : '电话',
							width : 100
						},
						{
							field : 'DEPARTMENT_NAME',
							title : '所在部门',
							width : 150
						},
						{
							field : 'ENABLE',
							title : '是否启用',
							width : 100,
							formatter : function(value, row, index) {
								return '<div class="' + (row.ENABLE ? 'icon-ok' : 'icon-no')
										+ ' operator-tool"></div> ';
							}
						}, {
							field : 'CREATE_TIME',
							title : '创建时间',
							width : 150,
							formatter : function(value, row, index) {
								return WUI.date_reformat(row.CREATE_TIME);
							}
						} ] ]
			});

	function getRowIndex(target) {
		var tr = $(target).closest('tr.datagrid-row');
		return parseInt(tr.attr('datagrid-row-index'));
	}
	function getRowData(target) {
		return $node.datagrid("getRows")[getRowIndex(target)];
	}
	WUI.personnel = {};
	WUI.personnel.editrow = function(target) {
		var personnel = getRowData(target);
		personnelDialog(personnel);
	}
	WUI.personnel.enablerow = function(target) {
		var personnel = getRowData(target);
		$.messager.confirm('确认', '确定要启用人员【' + personnel.NAME + '】吗?', function(r) {
			if (r) {
				WUI.ajax.put(personnelUrl + "/enable/" + personnel.ID, {
					ENABLE : true
				}, function() {
					$node.datagrid("reload");
				}, function() {
					$.messager.alert('失败', "启用人员失败！");
				});
			}
		});
	}
	WUI.personnel.disablerow = function(target) {
		var personnel = getRowData(target);
		$.messager.confirm('确认', '确定要禁用人员【' + personnel.NAME + '】吗?', function(r) {
			if (r) {
				WUI.ajax.put(personnelUrl + "/enable/" + personnel.ID, {
					ENABLE : false
				}, function() {
					$node.datagrid("reload");
				}, function() {
					$.messager.alert('失败', "禁用人员失败！");
				});
			}
		});
	}

	function personnelDialog(personnel) {
		WUI.ajax.get(departmentUrl, {}, function(departments) {
			$('#personnel-dialog').dialog(
					{
						iconCls : personnel ? "icon-edit" : "icon-add",
						title : personnel ? "修改人员" : "添加人员",
						left : ($(window).width() - 600) * 0.5,
						top : ($(window).height() - 300) * 0.5,
						width : 300,
						closed : false,
						cache : false,
						href : '/account/personnel/personnel-dialog.html',
						onLoadError : function() {
							$.messager.alert('失败', "对话框加载失败，请刷新后重试！");
						},
						onLoad : function() {
							for (var i = 0; i < departments.length; i++) {
								$('#personnel-department').append(
										'<option value="' + departments[i].ID + '">' + departments[i].NAME
												+ '</option>');
							}
							if (personnel) {
								$('#personnel-department').val(personnel.DEPARTMENT);
								$('#personnel-id-txt').val(personnel.ID);
								$('#personnel-number-txt').val(personnel.JOB_NUMBER);
								$('#personnel-name-txt').val(personnel.NAME);
								$('#personnel-email-txt').val(personnel.E_MAIL);
								$('#personnel-tel-txt').val(personnel.TEL);
								$('#personnel-id-txt').validatebox("isValid");
								$('#personnel-number-txt').validatebox("isValid");
								$('#personnel-email-txt').validatebox("isValid");
								$('#personnel-name-txt').validatebox("isValid");
								$('#personnel-tel-txt').validatebox("isValid");
							}
						},
						modal : true,
						onClose : function() {
							$("#personnel-dialog").empty();
						},
						buttons : [ {
							text : '保存',
							handler : function() {
								var isValid = $('#personnel-name-txt').val();
								isValid = isValid && $("#personnel-email-txt").validatebox("isValid");
								isValid = isValid && $("#personnel-tel-txt").validatebox("isValid");
								isValid = isValid && $("#personnel-number-txt").validatebox("isValid");
								isValid = isValid && $('#personnel-department').val();
								if (!isValid) {
									return;
								}

								var newPersonnel = {
									NAME : $('#personnel-name-txt').val(),
									E_MAIL : $('#personnel-email-txt').val(),
									JOB_NUMBER : $('#personnel-number-txt').val(),
									TEL : $('#personnel-tel-txt').val(),
									DEPARTMENT : $('#personnel-department').val()
								};

								if (personnel) {
									var ID = $('#personnel-id-txt').val();
									WUI.ajax.put(personnelUrl + "/" + ID, newPersonnel, function() {
										$node.datagrid("reload");
										$('#personnel-dialog').dialog("close");
									}, function() {
										$.messager.alert('失败', "修改人员失败！");
									});
								} else {
									WUI.ajax.post(personnelUrl, newPersonnel, function() {
										$node.datagrid("reload");
										$('#personnel-dialog').dialog("close");
									}, function() {
										$.messager.alert('失败', "添加人员失败！");
									});
								}
							}
						}, {
							text : '取消',
							handler : function() {
								$('#personnel-dialog').dialog("close");
							}
						} ]
					});
		}, function() {
			$.messager.alert('失败', "获取部门信息失败！");
		});
	}
});