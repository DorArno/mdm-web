/**
 * created by gaod003 on 2016/09/23
 */
angular
		.module('organazation')
		.controller(
				'OrganazationCrl',
				function($scope, $modal, httpService, $rootScope) {
					
					$scope.selection = [];
					$scope.levelZeroCount= 0;
                    // Toggle selection for a given user by id
                    $scope.toggleSelection = function toggleSelection(org) {
                        var idx = $scope.selection.indexOf(org.id);

                        // Is currently selected
                        if (idx > -1) {
                            $scope.selection.splice(idx, 1);
                            if(org.parentId == null)
                            	$scope.levelZeroCount--;
                        }

                        // Is newly selected
                        else {
                            $scope.selection.push(org.id);
                            if(org.parentId == null)
                            	$scope.levelZeroCount++;
                        }
                    };

                    $scope.toggleSelectionAll = function toggleSelection() {
                        if($scope.selection.length == $scope.systemInfoList.length){
                            $scope.selectionAll = true;
                        }

                        $scope.selection = [];
                    	if(!!!$scope.selectionAll){
                            //$scope.selection = [];
                            angular.forEach($scope.systemInfoList,function (org) {
                                $scope.selection.push(org.id);
                            });
						}
                        $scope.selectionAll = !!!$scope.selectionAll;
                    }
					
					$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
						pageNum : 1,
						pageSize : 10,
						orgType : 0,
						parentId : ''
					};
  		   
					// status
					$scope.isStatusList = [ {
						title : "停用",
						value : 0
					}, {
						title : "启用",
						value : 1
					} ];

					// 页面初期化查询
					$scope.init = function() {
						
						$scope.loadOrganazationType();
						
						//$scope.loadOrgTree();
						//$scope.queryOrganazationList();
						// 获取来源列表
						//$scope.querySystemInfos();
						// 获取组织机构类型列表
						//$scope.queryIdOrgTypeListStaticDatas();
						// 获取省列表
						//$scope.queryProvinceList();
						//$scope.isLoadData = 1;

					};
					
					$scope.loadOrganazationType = function(){
						// 查询组织机构类型
							var params = {
								tableName : "OrganizationType"
							};
							httpService.req("GET", "/web/mdm/staticdata", params,
									function(result) {
										$scope.organizationTypes = result.data;
										$scope.queryParams.orgType = $scope.organizationTypes[0].colValue;
										$scope.queryParams.systemCode = $scope.organizationTypes[0].colType;
										//$scope.queryParams.orgName = $scope.organizationTypes[0].colName;
										$scope.queryOrganazationList();
//										// 获取来源列表
//										$scope.querySystemInfos();
										// 获取组织机构类型列表
										$scope.queryIdOrgTypeListStaticDatas();
										// 获取省列表
										$scope.queryProvinceList();
										$scope.isLoadData = 1;
										$scope.loadOrgTree(true);
									}, true);
					};

					$scope.isLoadData = 0;
					// 修改查询组织机构类型
					$scope.setOrgType = function(currentOrgType, colType) {
						$scope.levelZeroCount = 0;
						$scope.selection = [];
						if ($scope.isLoadData == 0) {
							$scope.queryParams.parentId = '';
							$scope.queryParams.orgName = '';
							$scope.queryParams.orgCode = '';
							$scope.addParams.parentId = '';
							$scope.queryParams.corpCode = '';
							$scope.queryParams.sourceid = '';
							$scope.queryParams.beginDate = '';
							$scope.queryParams.endDate = '';
							$scope.queryParams.orgType = currentOrgType;
							$scope.queryParams.systemCode = colType;
							$scope.loadOrgTree(true);
							$scope.queryOrganazationList();
							$scope.isLoadData = 1;
						}
					};

					$scope.loadTreeFlag = true;
					$scope.loadOrgTree = function(isRepeatClick) {
						if ($scope.loadTreeFlag) {
							var params = {
								'builder' : 'userOrganazationStaticTreeBuilder',
								'parentId' : '0',
								'ztreecallback':  '{click:onSelect,expand:onExpand}',
								'checkable' : false,
								'parameter' : $scope.queryParams.orgType+";" + $scope.queryParams.parentId+";2"//组织机构类型;ParentidId;层级
							};
							$scope.loadTreeFlag = false;
							httpService.req(
											'GET',
											'/web/mdm/tree/dynamicRoot',
											params,
											function(result) {
												$scope.loadTreeFlag = true;
												$scope.html = result.data;
//												tree.expandAll(true);
												if(isRepeatClick){
													$scope.sumIsLoadData();
												}
											}, true);
						}
					};

					// 查询系统信息
					$scope.queryOrganazationList = function() {
						httpService.req("GET", "/web/mdm/organazation",
								$scope.queryParams, function(result) {
									$scope.sumIsLoadData();
									var data = result.data;
									if (data != null) {
										$scope.systemInfoList = data.list;
									}
									$scope.totalItems = data.totalCount;
								}, true);
					};
					
					
//					展示树子节点
					$scope.queryTreeNodes = function(node_id) {
						if (typeof (tree) != "undefined") {
							$scope.queryParams.parentId = node_id;
							if("0" != node_id){
								// 按parentId查询节点
								var params = {
										'builder' : 'userOrganazationStaticTreeBuilder',
										'parentId' : '0',
										'ztreecallback':  '{click:onSelect,expand:onExpand}',
										'checkable' : false,
										'parameter' : $scope.queryParams.orgType+";" + $scope.queryParams.parentId+";1"//组织机构类型;ParentidId;层级 1:加載下一集
									};
								httpService.req('GET', '/web/mdm/tree/dynamicNodes', params,
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
					
					// 查询系统信息去掉sumIsLoadData
					$scope.queryOrganazationList2 = function() {
						httpService.req("GET", "/web/mdm/organazation",
								$scope.queryParams, function(result) {
									var data = result.data;
									if (data != null) {
										$scope.systemInfoList = data.list;
									}
									$scope.totalItems = data.totalCount;
								}, true);
					};
					
					$scope.doit = function($event){
						$event.preventDefault();
					}
 
					$scope.sumIsLoadData = function() {
						if ($scope.isLoadData >= 2) {
							$scope.current_type  = $scope.queryParams.orgType;
							$scope.isLoadData = 0;
						} else {
							$scope.isLoadData = $scope.isLoadData + 1;
						}
					};

					$scope.addParams = {
						parentId : '',
						parentName : '',
						type : '',
						typeName : '',
						code : '',
						corpCode : '',
						provinceId : '',
						cityId : '',
						districtId : '',
						communityId : '',
						longitude : '',
						latitude : '',
					};
					// 打开新增页面
					$scope.addOrganazationInfo = function() {
						$scope.addParams = {
							parentId : $scope.addParams.parentId,
							parentName : $scope.addParams.parentName
						};
						if ($scope.addParams.parentId == "") {
							$scope.addParams.parentId = tree.getNodes()[0].id;
							$scope.addParams.parentName = tree.getNodes()[0].name;
						}
						//初始化， 先让输入框显示
						$("#addCorpCodeId").show();
						$("#addCorpCodeTextId").hide();
						
						if($scope.addParams.corpCode==null||$scope.addParams.corpCode==""){
							httpService
							.req("GET",
									"/web/mdm/organazation/" + $scope.addParams.parentId,
									{},
									function(result) {
										$scope.addParams.corpCode = result.data.corpCode;
										if($scope.addParams.corpCode!=null&&$scope.addParams.corpCode!=""){
											$("#addCorpCodeId").hide();
											$("#addCorpCodeTextId").show();
										}
									}, true);
						}else{
							$("#addCorpCodeId").show();
							$("#addCorpCodeTextId").hide();
						}
						
						$scope.addParams.type = $scope.queryParams.orgType;
						$scope.addParams.systemCode =  $scope.queryParams.systemCode;
//						$scope.addParams.typeName = $scope.TypeName[$scope.addParams.type];
						$scope.addParams.typeName = $scope.getOrgTypeName($scope.addParams.type);
						$scope.createRandomCode();
						
						$scope.cityList = [];
						$scope.districtList = [];
						$scope.communityList = [];
						
						$scope.addModal = $modal
								.open({
									templateUrl : "app/organazation/organazationInfo/addOrganazation.html",
									backdrop : 'static',
									scope : $scope
								});
					};

					// 生成随机组织机构代码
					$scope.createRandomCode = function() {
						httpService.req("GET",
								"/web/mdm/organazation/createRandomCode",
								$scope.queryParams, function(result) {
									$scope.addParams.code = result.data;
								}, true);
					};

					// 查询系统信息
//					$scope.querySystemInfos = function() {
//						var param = {type : $scope.queryParams.orgType};
//						httpService.req("GET", "/web/mdm/invokeSystem/systemInfos",param, function(result) {
//									$scope.sourceList = result.data;
//								}, true);
//					};

				  
					// 查询组织机构类型信息
					$scope.queryIdOrgTypeListStaticDatas = function() {
						var params = {
							tableName : "CCPGOrgType"
						};
						httpService.req("GET", "/web/mdm/staticdata", params,
								function(result) {
									$scope.orgTypeList = result.data;
								}, true);
					};
					
					$scope.getOrgTypeName = function(orgTypeid){
						
						for(var i=0;i< $scope.organizationTypes.length; i++ ){
							if($scope.organizationTypes[i].colValue == orgTypeid ){
								return $scope.organizationTypes[i].colName;
							}
						}
					};

					// 查询省信息
					$scope.queryProvinceList = function() {
						var params = {
							level : 1,
							pageNum : 1,
							pageSize : 100000
						};

						httpService.req("POST", "/web/mdm/district/districtForSelect", {},
								function(result) {
									if (result != null && result.data != null) {
										$scope.provinceList = result.data.list;
									}
								}, true, params);
					};

					// 查询城市列表信息
					$scope.queryCityList = function(provinceId) {
						$scope.cityList = [];
						if(provinceId == null || provinceId == ""){
							return;
						}
						var params = {
							parentId : provinceId,
							pageNum : 1,
							pageSize : 100000
						};
						httpService.req("POST", "/web/mdm/district/districtForSelect", {},
								function(result) {
									if (result != null && result.data != null) {
										$scope.cityList = result.data.list;
										$scope.addParams.districtID = "";
										$scope.addParams.communityId = "";
										$scope.editParams.districtID = "";
										$scope.editParams.communityId = "";
									}
								}, true, params);
					};

					// 查询区域列表信息
					$scope.queryDistrictList = function(cityId) {
						$scope.districtList = [];
						if(cityId == null || cityId == "" ){
							return;
						}
						var params = {
							parentId : cityId,
							pageNum : 1,
							pageSize : 100000
						};
						httpService.req("POST", "/web/mdm/district/districtForSelect", {},
								function(result) {
									$scope.districtList = result.data.list;

									$scope.addParams.communityId = "";
									$scope.editParams.communityId = "";

								}, true, params);
					};

					// 查询城市列表信息
					$scope.queryCityListEditInit = function(provinceId) {
						$scope.cityList = [];
						if(provinceId == null || provinceId =="" ){
							return;
						}
						var params = {
							parentId : provinceId,
							pageNum : 1,
							pageSize : 100000
						};
						httpService.req("POST", "/web/mdm/district/districtForSelect", {},
								function(result) {
									$scope.cityList = result.data.list;
								}, true, params);
					};

					// 查询区域列表信息
					$scope.queryDistrictListEditInit = function(cityId) {
						$scope.districtList = [];
						if(cityId == null || cityId == ""){
							return;
						}
						var params = {
							parentId : cityId,
							pageNum : 1,
							pageSize : 100000
						};
						httpService.req("POST", "/web/mdm/district/districtForSelect", {},
								function(result) {
									$scope.districtList = result.data.list;
								}, true, params);
					};

					$scope.queryCommunityList = function(districtID) {
						$scope.communityList = [];
						if (districtID == null || districtID == "") {
							return;
						}
						var params = {
							areaId : districtID
						};
						httpService.req("GET", "/web/mdm/community", params,
								function(result) {
									$scope.communityList = result.data;
								}, true);
					};

					$scope.queryParentInfo = function(parentid) {
						httpService
								.req(
										"GET",
										"/web/mdm/organazation/" + parentid,
										{},
										function(result) {
											$scope.editParams.parentName = result.data.name;
										}, true);
					};
						
					// 新增确认
					$scope.addConfirm = function() {
						
						if (!$scope.checkEdit($scope.addParams)) {
							return;
						}
						httpService.req("POST", "/web/mdm/organazation", {},
								function(result) {

									if (result != null && result.result == "true") {
										$rootScope.addAlert("success", "操作成功");
										$scope.addModal.close();
										$scope.queryOrganazationList2();
									}

								}, true, $scope.addParams);
					};

					// 关闭新增商品
					$scope.cancelAdd = function() {
						$scope.addModal.close();
					};

					$scope.cancelEdit = function() {
						$scope.editModal.close();
					};

					// 打开编辑界面
					$scope.editParams = {};
					$scope.goEdit = function(index) {
						$scope.editIndex = index;
						angular.copy($scope.systemInfoList[index],
								$scope.editParams);
						$scope.queryParentInfo($scope.editParams.parentId);
						$scope.editParams.typeName = $scope.getOrgTypeName($scope.editParams.type);
						$scope.editParams.systemCode = $scope.queryParams.systemCode;
						$scope.queryCityListEditInit($scope.editParams.provinceId);
						$scope.queryDistrictListEditInit($scope.editParams.cityId);
						$scope.queryCommunityList($scope.editParams.districtID);
						$scope.editModal = $modal
								.open({
									templateUrl : "app/organazation/organazationInfo/editOrganazation.html",
									backdrop : 'static',
									scope : $scope
								});
					};

					$scope.goDelete = function(id) {
						if (!confirm('确认要删除当前组织机构及其所有子节点吗？')) {
							return;
						}
						// var params = {id: $scope.systemInfoList[index].id};
						httpService
								.req("DELETE", "/web/mdm/organazation/"
										+ id, {},
										function(result) {
											if (result.result == "true") {
												$rootScope.addAlert("success",
														"操作成功!");
												$scope.queryOrganazationList2();
												$scope.loadOrgTree(false);
											}
										}, true);
					};

					// 确认编辑
					$scope.editConfirm = function() {
						
						if (!$scope.checkEdit($scope.editParams)) {
							return;
						}
						httpService.req("PUT", "/web/mdm/organazation/"
								+ $scope.editParams.id, {}, function(result) {
							if (result != null && result.result == "true") {
								$rootScope.addAlert("success", "操作成功!");
								$scope.editModal.close();
								$scope.queryOrganazationList2();
							}
						}, true, $scope.editParams);

					};
					
					//批量修改状态
				    $scope.batchUpdateOrgStatus = function (status) {
				    	if ($scope.selection.length == 0) {
				    		$rootScope.addAlert("error", "请选择组织机构!");
				    		return;
				    	}
				    	if($scope.levelZeroCount>0){
							$rootScope.addAlert("error", "级别为0的组织机构不允许修改!");
							return;
				    	}
				    	var param = {};
				    	param.ids = $scope.selection;
				    	param.flag = status;
				      	httpService.req("PUT","/web/mdm/organazation/batchUpdateOrgStatus", {}, function (data) {
				        	if (data.result == "true") {
				          		$rootScope.addAlert("success", "操作成功!");
				          		$scope.queryOrganazationList2();
				        	}
				      	}, true, param);
				    };

					// 取消编辑
					$scope.cancelEdit = function() {
						$scope.editModal.close();
					};

					// 分页
					$scope.currentPage = 0;
					$scope.maxSize = 10;
					$scope.pageChanged = function(pageNo) {
						$scope.queryParams.pageNum = pageNo;
						$scope.queryOrganazationList();// 这里需要改为当前查询的请求方法
					};


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
						if (checkParams.parentId == ''
								|| checkParams.parentId == undefined) {
							$rootScope.addAlert("error", "父组织机构不能为空");
							return false;
						}
						if (checkParams.name == ''
								|| checkParams.name == undefined) {
							$rootScope.addAlert("error", "名称不能为空");
							return false;
						} else if (checkParams.parentId != undefined
								&& checkParams.name.length > 100) {
							$rootScope.addAlert("error", "名称不能超过100个字符");
							return false;
						} else if (checkParams.corpCode == ''
								|| checkParams.corpCode == undefined) {
							$rootScope.addAlert("error", "企业代码不能为空");
							return false;
						} else if (checkParams.provinceId == ''
								|| checkParams.provinceId == undefined) {
							$rootScope.addAlert("error", "省份不能为空");
							return false;
						} else if (checkParams.cityId == ''
								|| checkParams.cityId == undefined) {
							$rootScope.addAlert("error", "城市不能为空");
							return false;
						} else if (checkParams.districtID == ''
								|| checkParams.districtID == undefined) {
							$rootScope.addAlert("error", "区域不能为空");
							return false;
						} else if (checkParams.systemCode == ''
								|| checkParams.systemCode == undefined) {
							$rootScope.addAlert("error", "来源不能为空");
							return false;
						}else if(checkParams.status == null || checkParams.status == undefined){
							$rootScope.addAlert("error", "状态不能为空");
							return false;
						}
						if(checkParams.systemCode =="SFYOFF" || checkParams.systemCode =="CSS"){
							if(checkParams.idOrganizationType == null || checkParams.idOrganizationType == undefined){
								$rootScope.addAlert("error", "机构类型不能为空");
								return false;
							}
						}else{
							checkParams.idOrganizationType = "";
						}
						return $scope.checkLatitudeAndLongitude(checkParams);
	 
					};

				});
