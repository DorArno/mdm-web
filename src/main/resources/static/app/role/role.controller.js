angular.module('role').controller(
		'RoleCrl',
		function($scope, $modal, httpService, $rootScope) {

			$scope.sourceSystemType = [];
			$scope.levelZeroCount= 0;
			$scope.selection = [];
			$scope.selectionRole = [];
			
            // Toggle selection for a given user by id
            $scope.toggleSelection = function toggleSelection(role) {
                var idx = $scope.selection.indexOf(role.id);
                
                
                // Is currently selected
                if (idx > -1) {
                    $scope.selection.splice(idx, 1);
                    $scope.selectionRole.splice(role,1);
                    if(role.level==0)
                    	$scope.levelZeroCount--;
                }

                // Is newly selected
                else {
                    $scope.selection.push(role.id);
                    $scope.selectionRole.push(role);
                    if(role.level==0)
                    	$scope.levelZeroCount++;
                }
            };

            $scope.toggleSelectionAll = function toggleSelection() {
                if($scope.selection.length == $scope.roleList.length){
                    $scope.selectionAll = true;
                }

                $scope.selection = [];
            	if(!!!$scope.selectionAll){
                    //$scope.selection = [];
                    angular.forEach($scope.roleList,function (role) {
                        $scope.selection.push(role.id);
                    });
				}
                $scope.selectionAll = !!!$scope.selectionAll;
            }
			
			$scope.queryParams = {// 定义分页入参
				// 默认第一页，每页10条
				pageNum : 1,
				pageSize : 10,
			};

			// 页面初期化查询
			$scope.init = function() {
				$scope.queryRoleInfoList();
			};

			$scope.moduleStates = [ {
				title : '启用',
				value : 0
			}, {
				title : '停用',
				value : 1
			} ];
			// 查询系统信息
			$scope.queryRoleInfoList = function() {
				$scope.querySystemInfo();
				httpService.req("GET", "/web/mdm/role/roleInfos", $scope.queryParams, function(result) {
					if (result && result.data) {
						$scope.roleList = result.data.list;
						$scope.totalItems = result.data.totalCount;
					}
				}, true);
			};

			$scope.querySystemType = function(id) {
				console.log(id);
				for (var z = 0; z < $scope.sourceSystemType.length; z++) {
					if ($scope.sourceSystemType[z].id == id) {
						if( $scope.sourceSystemType[z].sysCode=='CSS' ||$scope.sourceSystemType[z].sysCode=='ACRM' || $scope.sourceSystemType[z].sysCode=='SFYON' || $scope.sourceSystemType[z].sysCode=='SFYOFF'){
							return $scope.sourceSystemType[z].sysCode;
						}
					}
				}
				return null;

			}

			// 查询系统信息
			$scope.querySystemInfo = function() {
				httpService.req("GET", "/web/mdm/global/systemInfos", {}, function(result) {
					if (result && result.data) {
						$scope.systemInfoList = result.data;
						$scope.sourceSystemType = [];
						for (var z = 0; z < result.data.length; z++) {
							if (result.data[z].sysCode == 'CSS') {
								$scope.sourceSystemType.push(result.data[z]);
							} else if (result.data[z].sysCode == 'ACRM') {
								$scope.sourceSystemType.push(result.data[z]);
							}else if (result.data[z].sysCode == 'SFYOFF') {
								$scope.sourceSystemType.push(result.data[z]);
							} else if (result.data[z].sysCode == 'SFYON') {
								$scope.sourceSystemType.push(result.data[z]);
							}
						}
					}
				}, true);
			};

			// 打开新增页面
			$scope.addSystemInfo = function() {
				$scope.addParams = {};
				if (!$scope.systemInfoList) {
					$scope.querySystemInfo();
				}
				$scope.addModal = $modal.open({
					templateUrl : "app/role/addRole.html",
					scope : $scope,
					backdrop : 'static'
				});
			};

			// 新增确认
			$scope.addConfirm = function() {
				if (!$scope.checkEdit($scope.addParams)) {
					return;
				}

				httpService.req("POST", "/web/mdm/role/queryRoleNameExist", {}, function(data) {
					if (data && data.data == 0) {
						httpService.req("POST", "/web/mdm/role/roleInfos", {}, function(data) {
							if (data && data.data == 1) {
								$rootScope.addAlert("success", "操作成功");
								$scope.addModal.close();
								$scope.queryRoleInfoList();
							}
						}, true, $scope.addParams);
					} else {
						$rootScope.addAlert("error", "名称在子系统中已存在");
						return;
					}
				}, true, $scope.addParams);
			};

			// 关闭新增商品
			$scope.cancelAdd = function() {
				$scope.addModal.close();
			};

			// 打开编辑界面
			$scope.goEdit = function(index) {
				$scope.editIndex = index;
				$scope.editParams = {};
				
				httpService.req("GET", "/web/mdm/role/queryRole/"+$scope.roleList[index].id, {
				}, function(data) {

					if (data.resCode == 200) {
						$scope.editParams = data.data;
						if (!$scope.systemInfoList) {
							$scope.querySystemInfo();
						}
						$scope.editModal = $modal.open({
							templateUrl : "app/role/editRole.html",
							scope : $scope,
							backdrop : 'static'
						});
					} else {
						$rootScope.addAlert("error", "获取数据失败");
					}
				}, true);
				
				
				//angular.copy($scope.roleList[index], $scope.editParams);

			};

			// 校验新增&编辑参数
			$scope.checkEdit = function(checkParams) {
				if (!checkParams.name) {
					$rootScope.addAlert("error", "名称不能为空");
					return false;
				}
				
				if($scope.querySystemType(checkParams.systemId) == 'CSS' || $scope.querySystemType(checkParams.systemId) == 'ACRM'){
					if(checkParams.type=='' || checkParams.type==undefined){
						$rootScope.addAlert("error", "请选择类型");
						return false;
					}
				}

				if (!checkParams.level) {
					$rootScope.addAlert("error", "请选择级别");
					return false;
				}
				// if (!checkParams.status &&
				// checkParams.status !== 0) {
				// $rootScope.addAlert("error",
				// "请选择状态");
				// return false;
				// }
				if (!checkParams.systemId) {
					$rootScope.addAlert("error", "系统来源不能为空");
					return false;
				}
				return true;
			};

			// 确认编辑
			$scope.editConfirm = function() {
				if (!$scope.checkEdit($scope.editParams)) {
					return;
				}
				httpService.req("PUT", "/web/mdm/role/roleInfos/" + $scope.editParams.id, {
					level : $scope.roleList[$scope.editIndex].level
				}, function(data) {
					if (data && data.data == 1) {
						$rootScope.addAlert("success", "操作成功!");
						$scope.editModal.close();
						$scope.queryRoleInfoList();
					}
				}, true, $scope.editParams);
			};

			// 取消编辑
			$scope.cancelEdit = function() {
				$scope.editModal.close();
			};

			// 分页
			$scope.maxSize = 10;
			$scope.pageChanged = function(pageNo) {
				$scope.queryParams.pageNum = pageNo;
				$scope.queryRoleInfoList();// 这里需要改为当前查询的请求方法
			};

			// 确认删除
			$scope.doDel = function(index) {
				layer.confirm('确认要删除吗？', {
					btn : [ '确定', '取消' ],
					title : "确定"
				}, function(flag) {
					layer.close(flag);
					httpService.req("DELETE", "/web/mdm/role/roleInfos/" + $scope.roleList[index].id, {
						level : $scope.roleList[index].level
					}, function(data) {
						if (data && data.data > 0) {
							$rootScope.addAlert("success", "操作成功!");
							$scope.queryRoleInfoList();
						}
					}, true);
				});
			};

			// 设置权限
			$scope.setOperation = function(index) {
				$scope.role = $scope.roleList[index];
				$scope.chooseModal = $modal.open({
					templateUrl : "app/role/operation.html",
					scope : $scope,
					backdrop : 'static'
				});
			};

			$scope.addChooseConfirm = function() {
				var nodes = tree.getCheckedNodes(true);
				var result = [];
				for (var i = 0, len = nodes.length; i < len; i++) {
					var node = {};
					node.id = nodes[i].id;
					node.type = nodes[i].info.type;
					node.parentId = nodes[i].parentId;
					result.push(node);
				}
				httpService.req("POST", "/web/mdm/role/setOperation/" + $scope.role.id, {}, function(
						data) {
					if (data && data.data > 0) {
						$rootScope.addAlert("success", "操作成功!");
						$scope.cancelChooseAdd();
					}
				}, true, result);
			};

			$scope.cancelChooseAdd = function() {
				$scope.chooseModal.close();
			};

			// 修改状态
			$scope.updateStatus = function(index, status) {
				$scope.editParams = {};
				angular.copy($scope.roleList[index], $scope.editParams);
				$scope.editParams.status = status;
				httpService.req("PUT", "/web/mdm/role/updateRoleStatus/" + $scope.editParams.id, {},
						function(data) {
							if (data && data.data == 1) {
								$rootScope.addAlert("success", "操作成功!");
								$scope.queryRoleInfoList();
							}
						}, true, $scope.editParams);
			};

			// 打开新增页面
			$scope.viewUserRole = function(index) {
				$scope.role = $scope.roleList[index];
				$scope.userRoleModal = $modal.open({
					templateUrl : "app/role/userRole.html",
					scope : $scope,
					backdrop : 'static'
				});
			};
			$scope.userRoleParams = {
				pageNum : 1,
				pageSize : 10,
			};
			$scope.userRoleSexs = [ {
				name : '男',
				value : 1
			}, {
				name : '女',
				value : 2
			}, {
				name : '保密',
				value : 0
			} ];
			$scope.queryUserRoleList = function() {
				httpService.req("GET", "/web/mdm/role/userRoleInfos/" + $scope.role.id,
						$scope.userRoleParams, function(result) {
							if (result && result.data) {
								$scope.userRoleList = result.data.list;
								$scope.userRoletotalItems = result.data.totalCount;
							}
						}, true);
			};

			$scope.userRolePageChanged = function(pageNo) {
				$scope.userRoleParams.pageNum = pageNo;
				$scope.queryUserRoleList();
			};

			$scope.userRoleClose = function() {
				$scope.userRoleModal.close();
			};

			// 批量修改状态
			$scope.batchUpdateRoleStatus = function(status) {
				if ($scope.selectionRole.length == 0) {
					$rootScope.addAlert("error", "请选择角色!");
					return;
				}
				
				if($scope.levelZeroCount>0){
						$rootScope.addAlert("error", "级别为0的角色不允许修改!");
						return;
				}
				httpService.req("PUT", "/web/mdm/role/batchUpdateRoleStatus", {}, function(data) {
					if (data && data.data == list.length) {
						$rootScope.addAlert("success", "操作成功!");
						$scope.queryRoleInfoList();
					}
				}, true, $scope.selectionRole);
			};

			// 批量删除
			$scope.batchDeleteRole = function(status) {
				if ($scope.selectionRole.length == 0) {
					$rootScope.addAlert("error", "请选择角色!");
					return;
				}
				layer.confirm('确认要删除吗？', {
					btn : [ '确定', '取消' ],
					title : "确定"
				}, function(flag) {
					layer.close(flag);
					if($scope.levelZeroCount>0){
						$rootScope.addAlert("error", "级别为0的角色不允许修改!");
						return;
					}
					httpService.req("PUT", "/web/mdm/role/batchDeleteRole", {}, function(data) {
						if (data && data.data > 0) {
							$rootScope.addAlert("success", "操作成功!");
							$scope.queryRoleInfoList();
						}
					}, true, $scope.selectionRole);
				});
			};

		});
