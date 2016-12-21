$(function() {
	var roleUrl = WUI.urlPath+"/account/roles";
	var rightUrl = WUI.urlPath+"/account/rights";
	$node = $('#role-grid');

	$node.datagrid({
		url : roleUrl,
		method : "get",
		singleSelect : true,
		onLoadError : function(s) {
			$.messager.alert('失败', "加载失败");
		},
		toolbar : [ {
			iconCls : 'icon-add',
			handler : function() {
				roleDialog();
			}
		}, '-', {
			iconCls : 'icon-reload',
			handler : function() {
				$node.datagrid("reload");
			}
		} ],
		columns : [ [ {
			field : 'action',
			title : '操作',
			width : 100,
			align : 'center',
			formatter : function(value, row, index) {
				var e = '<div class="icon-edit operator-tool" title="修改" onclick="WUI.role.editrow(this)"></div> ';
				var s = '<div class="separater"></div> ';
				var d = '<div class="icon-remove operator-tool" title="删除" onclick="WUI.role.deleterow(this)"></div>';
				return e + s + d;
			}
		}, {
			field : 'ID',
			title : '角色编码',
			align : 'right',
			width : 80
		}, {
			field : 'NAME',
			title : '角色名称',
			width : 180
		}, {
			field : 'DESCRIPTION',
			title : '描述',
			width : 200
		}, {
			field : 'rights',
			title : '权限',
			// width : 300,
			formatter : function(value, row, index) {
				if (row.rights) {
					var rights = [];
					for (var i = 0; i < row.rights.length; i++) {
						rights.push(row.rights[i].name);
					}
					return rights.join(',');
				} else {
					return value;
				}
			},
			styler : function(value, row, index) {
				return 'padding:0 10px;';
			}
		} ] ]
	});

	function getRowIndex(target) {
		var tr = $(target).closest('tr.datagrid-row');
		return parseInt(tr.attr('datagrid-row-index'));
	}
	WUI.role = {};
	WUI.role.editrow = function(target) {
		var role = $node.datagrid("getRows")[getRowIndex(target)];
		roleDialog(role);
	}
	WUI.role.deleterow = function(target) {
		var role = $node.datagrid("getRows")[getRowIndex(target)];
		$.messager.confirm('确认', '确定要删除角色【' + role.NAME + '】吗?', function(r) {
			if (r) {
				WUI.ajax.remove(roleUrl + "/" + role.ID, {}, function() {
					$node.datagrid("reload");
				}, function() {
					$.messager.alert('失败', "删除角色失败！");
				});
			}
		});
	}

	function roleDialog(role) {
		WUI.ajax.get(rightUrl, {}, function(accountRights) {
			$('#role-dialog').dialog(
					{
						iconCls : role ? "icon-edit" : "icon-add",
						title : role ? "修改角色" : "添加角色",
						left : ($(window).width() - 600) * 0.5,
						top : ($(window).height() - 300) * 0.5,
						width : 600,
						closed : false,
						cache : false,
						href : '/account/role/role-dialog.html',
						onLoadError : function() {
							$.messager.alert('失败', "对话框加载失败，请刷新后重试！");
						},
						onLoad : function() {
							function isRoleRight(right) {
								if (!role) {
									return false;
								}
								for (var i = 0; i < role.rights.length; i++) {
									if (right.id === role.rights[i].id) {
										return true;
									}
								}
								return false;
							}
							for (var i = 0; i < accountRights.length; i++) {
								var right = accountRights[i];
								var item = '<div style="display: inline-block; min-width: 150px;">'
										+ '<input type="checkbox" class="role-right-item" '
										+ (isRoleRight(right) ? "checked" : "") + '>' + right.name + '</div>';
								$('#rights-td').append(item);
							}
							if (role) {
								$('#role-id-txt').val(role.ID);
								$('#role-name-txt').val(role.NAME);
								$('#role-description-txt').val(role.DESCRIPTION);
								$('#role-id-txt').validatebox("isValid");
								$('#role-name-txt').validatebox("isValid");
								$('#role-description-txt').validatebox("isValid");
							}
						},
						modal : true,
						onClose : function() {
							$("#role-dialog").empty();
						},
						buttons : [ {
							text : '保存',
							handler : function() {
								if (!$('#role-name-txt').validatebox("isValid")) {
									return;
								}
								var role = {
									NAME : $('#role-name-txt').val(),
									DESCRIPTION : $('#role-description-txt').val(),
									rights : []
								};

								var rightItems = $(".role-right-item");
								for (var i = 0; i < rightItems.length; i++) {
									role.rights.push({
										id : $(rightItems[i]).prop('checked') ? true : false
									});
								}
								if (role) {
									var ID = $('#role-id-txt').val();
									WUI.ajax.put(roleUrl + "/" + ID, role, function() {
										$node.datagrid("reload");
										$('#role-dialog').dialog("close");
									}, function() {
										$.messager.alert('失败', "修改角色失败！");
									});
								} else {
									WUI.ajax.post(roleUrl, role, function() {
										$node.datagrid("reload");
										$('#role-dialog').dialog("close");
									}, function() {
										$.messager.alert('失败', "添加角色失败！");
									});
								}
							}
						}, {
							text : '取消',
							handler : function() {
								$('#role-dialog').dialog("close");
							}
						} ]
					});
		}, function() {
			$.messager.alert('失败', "获取权限信息失败！");
		});
	}
});