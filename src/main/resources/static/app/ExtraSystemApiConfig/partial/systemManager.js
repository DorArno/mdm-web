/**
 * 外部系统配置信息
 * 日期：2016.10.20
 */
angular
		.module('ExtraSystemApiConfig')
		.controller(
				'ExtraSystemApiConfigController',
				function($scope, $modal, httpService, $rootScope) {
					
					$scope.businessLogList = [];

					$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
						pageNum : 1,
						pageSize : 10,
					};

					// 处理全选
					var str = [];
					// 处理选择项
					$scope.choseArr = [];
					var flag = '';// 是否点击了全选，是为a
					$scope.x = false;// 默认未选中
					$scope.all = function(c, v) {// 全选
						if (c == true) {
							$scope.x = true;
							for (var l = 0; l < v.length; l++)
								$scope.choseArr.push(v);

						} else {
							$scope.x = false;
							$scope.choseArr = [];
						}
						flag = 'a';
					};

					$scope.chk = function(z, x) {// 单选或者多选
						if (flag == 'a') {// 在全选的基础上操作
							str = choseArr;
						}
						if (x == true) {// 选中
							str.push(z);
						} else {
							var index = str.indexOf(z);
							str.splice(index, 1);
						}
						$scope.choseArr = str;
					};

					// isDeleted
					$scope.isDeletedList = [ {
						title : "已删除",
						value : 1
					}, {
						title : "正常",
						value : 0
					} ];

					// 页面初期化查询
					$scope.init = function() {
						$scope.querySystemInfoList();
					};

					// 查询按钮事件
					$scope.queryEventHandler = function() {

						$scope.queryParams.pageNum = 1;

						$scope.currentPage = 1;

						httpService.req("GET", "/web/mdm/extraSystemApiConfig/extraSystemApiInfos",
								$scope.queryParams, function(result) {
									var data = result.data;
									if (data != null) {
										$scope.systemInfoList = data.list;
									}
									$scope.totalItems = data.totalCount;

								}, true);
					};

					// 查询列表信息(初始化列表)
					$scope.querySystemInfoList = function() {
						$scope.choseArr.length = 0;
						httpService
								.req(
										"GET",
										"/web/mdm/extraSystemApiConfig/extraSystemApiInfos",
										$scope.queryParams,
										function(result) {
											var data = result.data;
											if (data != null) {
												$scope.systemInfoList = data.list;
											}
											$scope.totalItems = data.totalCount;

										}, true);
					};

					// 删除指定的信息
					$scope.deleteHandler = function() {
						$scope.cronJobInfo = {};
						if (confirm('确认删除吗?')) {
							httpService
									.req(
											"POST",
											"/web/mdm/extraSystemApiConfig/deletExtraSystemApiInfos",
											{},
											function(data) {
												if (data.data == 1) {
													$rootScope.addAlert(
															"success", "操作成功");
													$scope
															.querySystemInfoList();
												}
											}, true, $scope.choseArr);

						}
					}

					// 编辑点击事件
					$scope.EditHandler = function() {
						
						if($scope.choseArr.length == 0){
							$rootScope.addAlert("warning",
							"请选择需要编辑的信息");
							return;
						}
						
						if($scope.choseArr.length > 1){
							$rootScope.addAlert("warning","编辑信息只能选择一条信息");
							return;
						}
						$scope.methodList = [];var post = {};var get = {};
						post.value = 'post';post.title = 'POST';get.value = 'get';get.title = 'GET';
						$scope.methodList.push(post);$scope.methodList.push(get);
						$scope.cronJobInfo = $scope.choseArr[0];
						$scope.initSystemInfo();
						$scope.editModal = $modal
						.open({
							templateUrl : "app/ExtraSystemApiConfig/partial/editTaskInfo.html",
							backdrop : 'static',
							scope : $scope

						});
						
					}
					
					//初始化目标系统信息
					$scope.initSystemInfo = function(){
					      httpService.req("GET","/web/mdm/invokeSystem/systemInfos", {}, function (result) {
					          if (result.data) {
					        	  $scope.businessLogList = result.data;
					            //$scope.addParams.systemId = $scope.systemInfoList[0];
					          }
					        }, true);
					}

					// 打开新增任务页面
					$scope.addHandler = function() {
						$scope.cronJobInfo = {};$scope.methodList = [];var post = {};var get = {};
						post.value = 'post';post.title = 'POST';get.value = 'get';get.title = 'GET';
						$scope.methodList.push(post);
						$scope.methodList.push(get);
						$scope.cronJobInfo.url = "http://"
						$scope.cronJobInfo.argsNames = [];
						$scope.cronJobInfo.argsValues = [];
						$scope.list = [];
						$scope.initSystemInfo();
						$scope.addModal = $modal
								.open({
									templateUrl : "app/ExtraSystemApiConfig/partial/addTaskInfo.html",
									backdrop : 'static',
									scope : $scope
								});
					};
					$scope.list = [];

					// 新增任务功能按钮动作
					$scope.addTask = function() {
						/*
						 * if (!$scope.checkEditValidate($scope.cronJobInfo)) {
						 * return; }
						 */
						httpService
								.req(
										"POST",
										"/web/mdm/extraSystemApiConfig/addExtraSystemApiInfos",
										{}, function(data) {

											if (data.data == 1) {
												$scope.addModal.close();
												$rootScope.addAlert("success",
														"操作成功");
												$scope.querySystemInfoList();
											}

										}, true, $scope.cronJobInfo);
					}

					// 关闭新增窗口
					$scope.cancelAdd = function() {
						$scope.addModal.close();
					};

					// 打开编辑界面
					$scope.editParams = {};

					$scope.clones = function(o) {
						var k, ret = o, b;
						if (o
								&& ((b = (o instanceof Array)) || o instanceof Object)) {
							ret = b ? [] : {};
							for (k in o) {
								if (o.hasOwnProperty(k)) {
									ret[k] = $scope.clones(o[k]);
								}
							}
						}
						return ret;
					};

					// 取消编辑
					$scope.cancelEdit = function() {
						$scope.editModal.close();
					};
					
					
					//编辑确认事件
					$scope.submitEditHandler = function(){
						
						httpService
						.req(
								"POST",
								"/web/mdm/extraSystemApiConfig/editExtraSystemApiInfos",
								{}, function(data) {

									if (data.data == 1) {
										$scope.editModal.close();
										$rootScope.addAlert("success",
												"操作成功");
										$scope.querySystemInfoList();
									}

								}, true, $scope.cronJobInfo);
						
					}

					// 分页
					$scope.currentPage = 0;
					$scope.maxSize = 10;
					$scope.setPage = function(pageNo) {
						$scope.currentPage = pageNo;
					};
					$scope.pageChanged = function() {
						$scope.master = false;
						$scope.queryParams.pageNum = $scope.currentPage;
						$scope.querySystemInfoList();// 这里需要改为当前查询的请求方法
					};

				});
