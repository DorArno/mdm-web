/**
 * created by gaod003 on 2016/09/23
 */
angular.module('district').controller('DistrictInfoCrl', function($scope, $modal, httpService, $rootScope) {
					$scope.isAdd = false;
					$scope.isEdit = false;
					$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
						pageNum : 1,
						pageSize : 10,
						parentId : null,
					};
					
					$scope.selection = [];
                    // Toggle selection for a given user by id
                    $scope.toggleSelection = function toggleSelection(id) {
                        var idx = $scope.selection.indexOf(id);

                        // Is currently selected
                        if (idx > -1) {
                            $scope.selection.splice(idx, 1);
                        }

                        // Is newly selected
                        else {
                            $scope.selection.push(id);
                        }
                    };

                    $scope.toggleSelectionAll = function toggleSelection() {
                        if($scope.selection.length == $scope.districtList.length){
                            $scope.selectionAll = true;
                        }

                        $scope.selection = [];
                    	if(!!!$scope.selectionAll){
                            //$scope.selection = [];
                            angular.forEach($scope.districtList,function (district) {
                                $scope.selection.push(district.id);
                            });
						}
                        $scope.selectionAll = !!!$scope.selectionAll;
                    }
                    
					$scope.myHttpService = function(method, url, param,
							callback, isornot) {
						httpService.req(method, url, param, callback, isornot);
					};
					
					// isDeleted
					$scope.isDeletedList = [ {
						title : "已删除",
						value : 1
					}, {
						title : "正常",
						value : 0
					} ];

					// isDeleted
					$scope.treeList = [];

					// 页面初期化查询
					$scope.init = function(params) {
						// 加载左侧树
						$scope.queryDistrictTree(params);
						// 加载datagrid表格数据
						$scope.queryDistrictList();
//						$scope.queryEditDistrictTree();
					};

					$scope.queryDistrictTree = function(params) {
						params.parentId ='0';
						params.treeType ='district';
						params.ztreecallback = '{click:onSelect,expand:onExpand}';
						httpService.req('GET', '/web/mdm/tree/dynamicRoot', params,
								function(result) {
									$scope.html ='';
									$scope.html = result.data;
								}, true);
					};
					
					// 查询系统信息
					$scope.queryDistrictList = function() {
						$scope.queryParams.pageSize = 10;
						httpService.req("POST", "/web/mdm/district/list", {}, function(result) {
							var data = result.data;
							if (data != null) {
								$scope.districtList = data.list;
							}
							$scope.totalItems = data.totalCount;

						}, true, $scope.queryParams);
					};
					
					//	树节点点击查询对应的列表数据
					$scope.queryDistrictListByNode = function(node_id) {
						$scope.queryParams.parentId = node_id;
						httpService.req("POST", "/web/mdm/district/list", {}, function(result) {
							var data = result.data;
							if (data != null) {
								$scope.districtList = data.list;
							}
							$scope.totalItems = data.totalCount;

						}, true, $scope.queryParams);
					};
					
					//	展示树子节点
					$scope.queryTreeNodes = function(node_id) {
						if (typeof (tree) != "undefined") {
							$scope.queryParams.parentId = node_id;
							if("0" != node_id){
								// 按parentId查询节点
								httpService.req('GET', '/web/mdm/tree/dynamicNodes', {'builder':'districtStaticTreeBuilder','treeType':'district','parentId':node_id},
									function(result) {
										var newNodes = result.data; 
										if(newNodes.length>5){
											var cNode = tree.getNodeByParam("id",node_id);
											
											var arrs = eval("(" + newNodes+ ")");
											for (var i=0, l=arrs.length; i < l; i++) 
											{
											    //删除选中的子节点
												var delNode = tree.getNodeByParam("id",arrs[i].id);
												tree.removeNode(delNode);
											}
											
											tree.addNodes(cNode, arrs);
											tree.selectNode(cNode,true);
											tree.expandNode(cNode, true, false);//指定选中ID节点展开 
										}
									}, true);
							}
						}
					};
					
					
					$scope.addParams = {};

					// 打开新增页面
					$scope.addDistrict = function() {
						if (typeof (tree) != "undefined") {
							if (tree.getSelectedNode()) {
								var node_id = tree.getSelectedNode().id;
								var node_level = parseInt(tree
										.getSelectedNode().level) + 1;
								if (tree.getSelectedNode().name == "所有地区")
									node_level = 1;
								$scope.addParams.parentId = node_id;
								$scope.addParams.level = node_level;
								$scope.parentName = tree.getSelectedNode().name;
							} else {
								$scope.addParams.parentId = 0;
								$scope.addParams.level = 1;
								$scope.parentName = "";
							}
						} else {
							$scope.addParams.parentId = 0;
							$scope.addParams.level = 1;
						}
//						$scope.addParams.parentId = 0;
						$scope.addModal = $modal
								.open({
									templateUrl : "app/district/partial/district/addDistrict.html",
									scope : $scope,
									backdrop : 'static'
								});
					};

					// 新增确认
					$scope.addConfirm = function() {
						if (!$scope.isAdd) {
							$scope.isAdd = true;
							if (!$scope.checkEdit($scope.addParams)
									|| !$scope
											.checkLatitudeAndLongitude($scope.addParams)
									|| !$scope.checkPostCode($scope.addParams)
									|| !$scope.checkLength($scope.addParams)) {
								$scope.isAdd = false;
								return;
							}
							$('#hd_pid').val($scope.addParams.parentId);
							$('#hd_name').val($scope.addParams.name);
							//	验证编码是否重复
							httpService.req("POST", "/web/mdm/district/verifyCode", {}, function(result) {
									var data = result.data;
									if (data != null) {
										$rootScope.addAlert("error", "编码重复!");
										$scope.isAdd = false;
										return;
									}else{
										httpService.req(
												"POST",
												"/web/mdm/district",
												{},
												function(data) {
													if (data.resCode == 200) {
														$scope.isAdd = false;
														$rootScope.addAlert(
																"success", "操作成功");
														$scope.cancelAdd();
														// $scope.addModal.close();
														$scope.queryDistrictList();
														/*$scope.queryDistrictTree({
															'builder' : 'districtStaticTreeBuilder'
														});*/
														$scope.editRootTree($('#hd_pid').val(), data.data.id, $('#hd_name').val(), 'add');
													}

												}, true, $scope.addParams);
									}	
								}, true, $scope.addParams);
							};
					};

					// 关闭新增行政区划
					$scope.cancelAdd = function() {
						$scope.addParams = {};
						$scope.addModal.close();
						$('#createdDate').removeAttr('data-original-title');
						$('#createdDate').attr('title','早于当前选中日期');
					};
					
					// 编辑父节点是根节点的数据
					$scope.editRootTree = function(pId, id, name, type){
						if (typeof (tree) != "undefined") {
							if (type == 'edit') {
								var pNode = tree.getNodeByParam("id", pId);
								if(pNode.open){
									// 删除选中的子节点
									var delNode = tree.getNodeByParam("id", id);
									tree.removeNode(delNode);
								}
							}
							//	Add new node.
							if(pId == 0){
								var pNode = tree.getNodeByParam("id",0);
								var nNode ={id:id,name:name,path:'null',parentId:'0',open:false,isParent:true,nodes:[]};
								tree.addNodes(pNode, nNode);
							}else{
								/*var pNode = tree.getNodeByParam("id",pId);
								var nNode ={id:id,name:name,path:'null',parentId:pId,open:false,isParent:true,nodes:[]};
								tree.addNodes(pNode, nNode);*/
								var pNode = tree.getNodeByParam("id", pId);
								if(pNode.open || type == 'edit'){
									// 刷新节点
									$scope.queryTreeNodes(pId);
								}
							}
						}
						return false;
					};
					
					// 打开编辑界面
					$scope.editParams = {};
					$scope.goEdit = function(index) {
						$scope.editIndex = index;
						
						//	查询行政区划信息
						httpService.req("GET", "/web/mdm/district/"+$scope.districtList[index].id, {}, function(result) {
							var data = result.data;
							if (data != null) {
								$scope.editParams = data;
								$('#citySel').val($scope.editParams.parentName);
								if(data.parentId =='0'){
									$('#citySel').val('所有地区');
								}
							}else{
								$rootScope.addAlert("error", "获取行政区划信息失败!");
							}	
						}, true, $scope.addParams);
						$scope.editModal = $modal.open({
							templateUrl : "app/district/partial/district/editDistrict.html",
							scope : $scope,
							backdrop : 'static'
						});
					};

					$scope.goDelete = function(index) {
						layer.confirm('确认要删除吗？', {
				    	    btn: ['确定','取消'],
				    	    title:"操作确认"
				    	}, function(flag){
						      layer.close(flag);
						      $scope.editIndex = index;
						      $scope.editParams = $scope.districtList[index];
						      var id = $scope.editParams.id,
						      	  pId = $scope.editParams.parentId;
						      httpService.req(
								"DELETE",
								"/web/mdm/district/" + id,
								{},
								function(data) {
		
									if (data.resCode == 200) {
										$rootScope.addAlert("success",
												"操作成功!");
										$scope.queryDistrictList();
										/*$scope.queryDistrictTree({
													'builder' : 'districtStaticTreeBuilder'
												});*/
										if (typeof (tree) != "undefined") {
											var pNode = tree.getNodeByParam("id", pId);
											if(pNode.open){
												// 删除选中的子节点
												var delNode = tree.getNodeByParam("id", id);
												tree.removeNode(delNode);
											}
										}
									}
								}, true, $scope.editParams);
				    	});
					};

					$scope.checkLength = function(checkParams) {
						if (checkParams.code && checkParams.code.length > 50) {
							$rootScope.addAlert("error", "编号长度不得超过50");
							return false;
						} else if (checkParams.name
								&& checkParams.name.length > 50) {
							$rootScope.addAlert("error", "名称长度不得超过50");
							return false;
						} else if (checkParams.postCode
								&& checkParams.postCode.length > 10) {
							$rootScope.addAlert("error", "邮编长度不得超过10");
							return false;
						} else if (checkParams.description
								&& checkParams.description.length > 500) {
							$rootScope.addAlert("error", "描述长度不得超过500");
							return false;
						}
						return true;
					}

					// 验证邮政编码
					$scope.checkPostCode = function(checkParams) {
						var patternPostCode = /^[1-9]\d{5}$/;
						if (checkParams.postCode
								&& checkParams.postCode != null
								&& !patternPostCode.test(checkParams.postCode)) {
							$rootScope.addAlert("error", "邮编格式不正确");
							return false;
						}
						return true;
					}

					// 验证经纬度
					$scope.checkLatitudeAndLongitude = function(checkParams) {
						var patternLongitude = /^[\-\+]?(0?\d{1,2}\.\d{1,6}|1[0-7]?\d{1}\.\d{1,6}|180\.0{1,6})$/;
						var patternLatitude = /^[\-\+]?([0-8]?\d{1}\.\d{1,6}|90\.0{1,6})$/;
						if (checkParams.longitude
								&& checkParams.longitude != null
								&& !patternLongitude
										.test(checkParams.longitude)) {
							$rootScope.addAlert("error", "经度格式不正确");
							return false;
						}
						if (checkParams.latitude
								&& checkParams.latitude != null
								&& !patternLatitude.test(checkParams.latitude)) {
							$rootScope.addAlert("error", "维度格式不正确");
							return false;
						}
						return true;
					}

					// 校验新增&编辑参数
					$scope.checkEdit = function(checkParams) {
						if (checkParams.name == null || checkParams.name.length < 1) {
							$rootScope.addAlert("error", "名称不能为空");
							return false;
						} else if (checkParams.code == null || checkParams.code.length < 1) {
							$rootScope.addAlert("error", "编码不能为空");
							return false;
						}
						return true;
					};

					// 确认编辑
					$scope.editConfirm = function() {
						if (!$scope.isEdit) {
							$scope.isEdit = true;
							if (!$scope.checkEdit($scope.editParams)
									|| !$scope
											.checkLatitudeAndLongitude($scope.editParams)
									|| !$scope.checkPostCode($scope.editParams)
									|| !$scope.checkLength($scope.editParams)) {
								$scope.isEdit = false;
								return;
							}

							httpService.req("PUT", "/web/mdm/district/"
									+ $scope.editParams.id, {}, function(data) {

								if (data.resCode == 200) {
									$scope.isEdit = false;
									$rootScope.addAlert("success", "操作成功!");
									$scope.editModal.close();
									$scope.queryDistrictList();
									/*$scope.queryDistrictTree({
										'builder' : 'districtStaticTreeBuilder'
									});*/
									$scope.editRootTree($scope.editParams.parentId, $scope.editParams.id, $scope.editParams.name, 'edit');
								}
							}, true, $scope.editParams);

						}
					};

					// 取消编辑
					$scope.cancelEdit = function() {
						$scope.editParams = {};
						$scope.editModal.close();
						$('#createdDate').removeAttr('data-original-title');
						$('#createdDate').attr('title','早于当前选中日期');
					};
					
					// 分页
					$scope.maxSize = 10;
					$scope.pageChanged = function(pageNo) {
						$scope.queryParams.pageNum = pageNo;
						$scope.queryDistrictList();// 这里需要改为当前查询的请求方法
					};
				});
