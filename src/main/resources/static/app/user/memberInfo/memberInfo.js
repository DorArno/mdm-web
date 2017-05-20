/**
 * created by gaod003 on 2016/09/23
 */
angular.module('member').controller(
		'MemberCrl',
		function($scope, $modal, httpService, $rootScope) {
			$scope.state = true;
			$scope.backEnd = {};
			
			$scope.getCurDate = function(day){
				var mydate = new Date();
				mydate.setDate(mydate.getDate()-day);
				var t=mydate.toLocaleDateString();
				var time =	mydate.getHours()+":"
					+ mydate.getMinutes()+":"
					+ mydate.getSeconds();
				return t + " " + time;
			};
			
			$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
				pageNum : 1,
				pageSize : 10,
				orgType : -2,
				organizationId : '',
				account : '',
				name : '',
				userId : 'admin',
				isDeleted : 0
//				,endDate : $scope.getCurDate(0),
//				beginDate:$scope.getCurDate(7)
			};

			// isDeleted
			$scope.isDeletedList = [ {
				title : "删除",
				value : 1
			}, {
				title : "启用",
				value : 0
			} ];

			// status
			$scope.isStatusList = [ {
				title : "停用",
				value : 0
			}, {
				title : "启用",
				value : 1
			} ];

			// status
			$scope.sexList = [ {
				title : "保密",
				value : 0
			}, {
				title : "男",
				value : 1
			}, {
				title : "女",
				value : 2
			} ];

			$scope.yesOrNoList = [ {
				title : "是",
				value : 1
			}, {
				title : "否",
				value : 0
			} ];
			
			$scope.phoneNumberConfirmedList = [ {
				title : "是",
				value : 1
			}, {
				title : "否",
				value : 0
			}, {
				title : "已解绑",
				value : 2
			} ];
			
			$scope.orgTypeList = [ {
				title : "主数据平台",
				value : -1
			}, {
				title : "社商云",
				value : 0
			}, {
				title : "悦帮",
				value : 1
			}, {
				title : "物业云&收费云",
				value : 2
			} ];
			
			$scope.sexHash = {
					"0":"保密",
					"1":"男",
					"2":"女"
			};
			
			$scope.statusHash = {
					"0":"停用",
					"1":"启用"
			};
			
			$scope.confirmedHash = {
					"1":"是",
					"0":"否"
			};
			
			$scope.memberFromList = [];
			$scope.loadMemberFrom = function() {
				var params = {
					tableName : "MemberFrom",
					pageNum : 1,
					pageSize : 10000
				};
				httpService.req("GET", "/web/mdm/staticdata", params,
						function(result) {
							var staticdata = result.data;
							
							var typeList = new Array();
							
							$(staticdata).each(function(i,e){
								var typeData = {};
								typeData.title=staticdata[i].colName;
								typeData.value=staticdata[i].colValue;
								typeList.push(typeData);
							});
							$scope.memberFromList = typeList;
						}, true);
			};
			
			// 页面初期化查询
			$scope.systemSourceHash = {};
			$scope.init = function() {
				$scope.loadMemberFrom();
				// $scope.loadOrgTree();
				$scope.systemSourceList = new Array();
				httpService.req("GET","/web/mdm/user/systemInfo", {}, function (result) {
					if (result && result.data) {
						var staticData = result.data;
						$(staticData).each(function(i,e){
							var data = staticData[i];
							if(data.sysCode != 'MDM')
							$scope.systemSourceList.push({value:data.id, title:data.sysName});
							$scope.systemSourceHash[data.id] = data.sysName;
						});
					}
				}, true);
				
				$scope.queryUserList();
				// 获取来源列表
				$scope.querySystemInfos();
				// 获取企业代码列表
				$scope.queryCropCodeStaticDatas();
			};

			// 查询系统信息
			$scope.queryUserList = function(isReset) {
				if(isReset){
					delete $scope.queryParams.lastMaxPk;
					delete $scope.queryParams.lastMinPk;
					delete $scope.queryParams.lastPageNum;
					$scope.queryParams.pageNum = 1;
				}
				httpService.req("POST", "/web/mdm/user/memberlist", {}, function(
						result) {
					var data = result.data;
					if (data != null) {
						$scope.queryParams.lastMaxPk = data.maxPk;
						$scope.queryParams.lastMinPk = data.minPk;
						$scope.userInfoList = data.list;
					}
					$scope.totalItems = data.totalCount;
				}, true, $scope.queryParams);
			};

			// 查询系统信息
			$scope.querySystemInfos = function() {
				httpService.req("GET", "/web/mdm/invokeSystem/systemInfos",
						$scope.queryParams, function(result) {
							$scope.sourceList = result.data;
						}, true);
			};

			// 查询企业代码信息
			$scope.queryCropCodeStaticDatas = function() {
				var params = {
					tableName : "OrgCorpCode",
					pageNum : 1,
					pageSize : 10000
				};
				httpService.req("GET", "/web/mdm/staticdata/staticdata", params,
						function(result) {
							$scope.cropCodeList = result.data.list;
						}, true);
			};

			// 打开编辑界面
			$scope.editParams = {};
			$scope.goEdit = function(userId) {
				httpService.req("GET", "/web/mdm/user", {
					id : userId
				}, function(data) {
					if (data != null) {
						$scope.editParams = data.data;
					}
				}, true);
				$scope.editModal = $modal.open({
					templateUrl : "app/user/memberInfo/memberDetails.html",
					scope : $scope,
					backdrop : 'static'
				});
			};

			// 修改查询组织机构类型
			$scope.setUserInfoType = function(currentInfoType) {
				var d = document.getElementById("userBasicsInfo");
				var l = document.getElementById("userDetailInfo");
				if (currentInfoType == 1) {
					d.style.display = "flex";
					l.style.display = "none";
				} else if (currentInfoType == 2) {
					d.style.display = "none";
					l.style.display = "flex";
				} else if (currentInfoType == 3) {
					d.style.display = "none";
					l.style.display = "none";
				}
			};

			// 取消编辑
			$scope.cancelEdit = function() {
				$scope.editModal.close();
			};
			
			//	设为后端用户
			$scope.setBackEndUser = function(userId) {

				layer.confirm('确认要设置为后端用户吗？', {
					btn : [ '确定', '取消' ],
					title : "操作确认"
				}, function(flag) {
					layer.close(flag);

					// 根据用户id获取用户信息，查看corpCode是否存在，不存在，提供选择窗口
					httpService.req("GET", "/web/mdm/user/" + userId, {}, function(
							data) {
						if (data != null) {
							var corpCode = data.data.userBasicsInfo.corpCode;
							if(corpCode != null && corpCode !=''){
								$scope.toSetBackEnd(userId, '');
							}else{
								// 选择企业代码
								$scope.backEnd.userId = userId;
								$scope.checkCorpCodeModal = $modal.open({
									templateUrl : "app/user/memberInfo/checkCorpCode.html",
									scope : $scope,
									backdrop : 'static'
								});
							}
						}
					}, true);
				});
			};
			
			$scope.cancelCheck = function() {
				$scope.checkCorpCodeModal.close();
			};
			
			$scope.checkConfirmed = function(userId){
				if(null != $scope.backEnd.corpCode && $scope.backEnd.corpCode != ''){
					$scope.toSetBackEnd(userId, $scope.backEnd.corpCode);
				}else{
					$rootScope.addAlert("error", "请选择企业代码!");
					return false;
				}
			};
			
			$scope.toSetBackEnd = function(userId, corpCode) {
				httpService.req("POST", "/web/mdm/user/setBackEndUser", {
					'userId' : userId,
					'corpCode' : corpCode
				}, function(data) {
					if (data.resCode == 200) {
						$rootScope.addAlert("success", "操作成功!");
						if($scope.checkCorpCodeModal)$scope.checkCorpCodeModal.close();
						$scope.queryUserList();
					}
				}, true);
			};
			
			// 分页
			$scope.currentPage = 0;
			$scope.maxSize = 10;
			$scope.setPage = function(pageNo) {
				$scope.currentPage = pageNo;
			};
			$scope.pageChanged = function(pageNo) {
				$scope.queryParams.lastPageNum = $scope.queryParams.pageNum;
				$scope.queryParams.pageNum = pageNo;
				$scope.queryUserList();// 这里需要改为当前查询的请求方法
			};

		});
