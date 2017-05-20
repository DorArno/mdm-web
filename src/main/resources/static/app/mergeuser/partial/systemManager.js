/**
 * 合并用户。
 */
angular.module('mergeuser').controller(
		'mergeuserController',
		function($scope, $modal, httpService, $rootScope) {

			$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
				pageNum : 1,
				pageSize : 10,
			};

			var z = 0;

			$scope.tmp = [];

			$scope.mergeuser = {};

			$scope.str = [];

			$scope.choseArr = [];

			$scope.systemSourceInfoList = [];

			var flag = '';// 是否点击了全选，是为a

			$scope.x = false;// 默认未选中

			$scope.sex = [ {
				title : '男',
				value : 1
			}, {
				title : '女',
				value : 0
			} ];

			$scope.type = [ {
				title : '其它',
				value : 10
			}, {
				title : '会员',
				value : 4
			}, {
				title : '业主',
				value : 3
			}, {
				title : '帮工',
				value : 2
			}, {
				title : '后台用户',
				value : 1
			} ];

			$scope.bool = [ {
				title : '是',
				value : true
			}, {
				title : '否',
				value : false
			} ];

			$scope.boolen = [ {
				title : '是',
				value : 1
			}, {
				title : '否',
				value : 0
			} ];

			$scope.status = [ {
				title : '启用',
				value : 1
			}, {
				title : '停用',
				value : 0
			} ];

			$scope.list = [];
			// 打开编辑界面
			$scope.editParams = {};

			$scope.all = function(c, v) {// 全选
				if (c == true) {
					$scope.x = true;
					for (var l = 0; l < v.length; l++)
						$scope.choseArr.push(v[l]);

				} else {
					$scope.x = false;
					$scope.choseArr = [];
				}
				flag = 'a';
			};

			$scope.chk = function(z, x) {// 单选或者多选
				if (flag == 'a') {// 在全选的基础上操作
					$scope.str = choseArr;
				}
				if (x == true) {// 选中
					$scope.str.push(z);
				} else {
					var index = $scope.str.indexOf(z);
					$scope.str.splice(index, 1);
				}
				$scope.choseArr = $scope.str;
			};

			$scope.cancelMerge = function() {
				$scope.mergemodal.close();
			}

			$scope.merge = function(c, v) {
				$scope.mergeuser[c] = v[c];
			}

			$scope.mergeAll = function(c, v) {
				// $('input[type=radio]').attr("checked", false);
				// console.log(this);
				$scope.mergeuser = $scope.clones(v);
			}

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
				$scope.querySourceSystemInfo();
			};

			// 合并用户
			$scope.mergeUser = function() {
				if ($scope.choseArr.length <= 0) {
					$rootScope.addAlert("error", "请选择需要合并的数据");
					return;
				}

				if ($scope.choseArr.length <= 1) {
					$rootScope.addAlert("error", "请至少选择两条待合并的数据");
					return;
				}

				// $scope.memergeuser = {};
				$scope.mergeuser = {};

				$scope.sysList = $scope.clones($scope.choseArr);
				$scope.mergemodal = $modal.open({
					templateUrl : "app/mergeuser/partial/MergeUserInfo.html",
					backdrop : 'static',
					scope : $scope,
					windowClass : 'app-modal-window merge_user_modal'
				});
			}

			$scope.isEmpty = function(obj) {
				if (typeof (obj) == 'number' || typeof (obj) == 'boolean') {
					return false;
				} else if (obj == '' || obj == undefined) {
					return true;
				}
			}

			$scope.mergeSubmit = function() {
				var tmp = '';
				for (var x = 0; x < $scope.choseArr.length; x++) {
					tmp += $scope.choseArr[x].id;
					tmp += ',';
				}
				// $scope.mergeuser = {};
				$scope.mergeuser.tmpIdArray = tmp.substring(0, tmp.length - 1);

				if ($scope.isEmpty($scope.mergeuser.account)) {
					$rootScope.addAlert("error", "账号名称不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.sex)) {
					$rootScope.addAlert("error", "性别不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.weChatID)) {
					$rootScope.addAlert("error", "微信ID不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.phoneNumber)) {
					$rootScope.addAlert("error", "电话号码不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.customerCode)) {
					$rootScope.addAlert("error", "客户编号不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.username)) {
					$rootScope.addAlert("error", "用户姓名不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.status)) {
					$rootScope.addAlert("error", "状态不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.type)) {
					$rootScope.addAlert("error", "类型不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.cellPhone)) {
					$rootScope.addAlert("error", "手机号不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.email)) {
					$rootScope.addAlert("error", "邮箱不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.nickName)) {
					$rootScope.addAlert("error", "昵称不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.birthDay)) {
					$rootScope.addAlert("error", "生日不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.registerDate)) {
					$rootScope.addAlert("error", "注册日期不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.emailConfirmed)) {
					$rootScope.addAlert("error", "是否邮箱验证不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.phoneNumberConfirmed)) {
					$rootScope.addAlert("error", "是否电话验证不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.memberFrom)) {
					$rootScope.addAlert("error", "会员/用户来源不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.description)) {
					$rootScope.addAlert("error", "描述不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.areaID)) {
					$rootScope.addAlert("error", "我的社区不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.homeAddress)) {
					$rootScope.addAlert("error", "家庭地址不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.userNo)) {
					$rootScope.addAlert("error", "序号不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.signature)) {
					$rootScope.addAlert("error", "个性签名不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.lastLoginTime)) {
					$rootScope.addAlert("error", "上一次登陆时间不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.isInternal)) {
					$rootScope.addAlert("error", "是否内置用户不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.salt)) {
					$rootScope.addAlert("error", "用户头像不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.enteryTime)) {
					$rootScope.addAlert("error", "入职时间不能为空！");
					return;
				}

				if ($scope.isEmpty($scope.mergeuser.systemId)) {
					$rootScope.addAlert("error", "来源系统ID不能为空！");
					return;
				}

				var phoneNumber = $scope.mergeuser.phoneNumber;
				if (!(parseInt(phoneNumber) === +phoneNumber)) {
					$rootScope.addAlert("error", "电话号码不正确！");
					return;
				}

				var cellPhone = $scope.mergeuser.cellPhone;
				if (!(parseInt(cellPhone) === +cellPhone)) {
					$rootScope.addAlert("error", "手机号不正确！");
					return;
				}

				var userNo = $scope.mergeuser.userNo;
				if (!(parseInt(userNo) === +userNo)) {
					$rootScope.addAlert("error", "序号不正确！");
					return;
				}

				if ($scope.mergeuser.birthDay.indexOf("00:00:00") == -1) {
					$scope.mergeuser.birthDay = $scope.mergeuser.birthDay + " 00:00:00";
				}
				if ($scope.mergeuser.registerDate.indexOf("00:00:00") == -1) {
					$scope.mergeuser.registerDate = $scope.mergeuser.registerDate + " 00:00:00";
				}

				httpService.req("POST", "/web/mdm/mergeManager/mergeUser", {}, function(data) {
					if (data.data == 1) {
						$scope.mergemodal.close();
						$rootScope.addAlert("success", "操作成功");
						$scope.queryInfoList();
					}
				}, true, $scope.mergeuser);
			}

			// 查询待合并用户列表
			$scope.queryInfoList = function() {

				$scope.str = [];

				$scope.choseArr = [];

				$scope.queryParams.pageNum = 1;

				$scope.currentPage = 1;

				httpService.req("GET", "/web/mdm/mergeManager/queryMergeUser", $scope.queryParams,
						function(result) {
							var data = result.data;
							if (data != null) {
								$scope.systemInfoList = data.list;
							}
							$scope.totalItems = data.totalCount;

						}, true);
			};

			// 查询系统信息
			$scope.querySourceSystemInfo = function() {
				httpService.req("GET", "/web/mdm/global/systemInfos", {}, function(result) {
					if (result && result.data) {
						$scope.systemSourceInfoList = result.data;
					}
				}, true);
			};

			// 查询任务信息
			$scope.querySystemInfoList = function() {
				httpService.req("GET", "/web/mdm/mergeManager/queryMergeUser", $scope.queryParams,
						function(result) {
							var data = result.data;
							if (data != null) {
								$scope.systemInfoList = data.list;
							}
							$scope.totalItems = data.totalCount;
						}, true);
			};

			$scope.clones = function(o) {
				var k, ret = o, b;
				if (o && ((b = (o instanceof Array)) || o instanceof Object)) {
					ret = b ? [] : {};
					for (k in o) {
						if (o.hasOwnProperty(k)) {
							ret[k] = $scope.clones(o[k]);
						}
					}
				}
				return ret;
			};

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
