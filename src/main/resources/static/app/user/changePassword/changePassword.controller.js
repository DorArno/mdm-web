angular.module('changePassword').controller(
		'changePasswordCrl',
		function($scope, $modal, httpService, $rootScope, $state) {
			$scope.isSubmit = false;
			$scope.isStrong = false;
			// 确认修改密码
			$scope.editConfirm = function() {
				if (typeof ($scope.editParams) != "undefined") {
					if (!$scope.isSubmit) {
						$scope.isSubmit = true;
						if (!$scope.checkNull($scope.editParams)
								|| !$scope.checkLength($scope.editParams)) {
							$scope.isSubmit = false;
							return;
						}
						if(!$scope.isStrong){
							$rootScope.addAlert("error", "密码强度过低，建议混合使用大小写字母、数字、特殊符号");
							$scope.isSubmit = false;
							return false;
						}
						var _user_id = localStorage.getItem("userId");
						httpService.req("PUT", "/web/mdm/user/UpdatePassword/"+_user_id, {},
								function(data) {
									$scope.isSubmit = false;
									if (data.resCode == 200) {
										$rootScope.addAlert("success", "操作成功");
										// 跳转至首页
										$state.go('main.index');
									}
								}, true,{'oldPassword':$scope.editParams.oldPassword,'newPassword':$scope.editParams.newPassword});
					}
				}else{
					return false;
				}
			};

			$scope.checkNull = function(checkParams) {
				if (checkParams.oldPassword == null
						|| checkParams.oldPassword.length < 1) {
					$rootScope.addAlert("error", "原密码不能为空");
					return false;
				} else if (checkParams.newPassword == null
						|| checkParams.newPassword.length < 1) {
					$rootScope.addAlert("error", "新密码不能为空");
					return false;
				} else if (checkParams.confirmPassword == null
						|| checkParams.confirmPassword.length < 1) {
					$rootScope.addAlert("error", "确认新密码不能为空");
					return false;
				}
				if (checkParams.newPassword != checkParams.confirmPassword) {
					$rootScope.addAlert("error", "新密码与确认新密码不同");
					return false;
				}
				return true;
			};

			$scope.checkLength = function(checkParams) {
				if (checkParams.oldPassword
						&& checkParams.oldPassword.length > 50) {
					$rootScope.addAlert("error", "原密码长度不得超过50位");
					return false;
				} else if (checkParams.newPassword
						&& checkParams.newPassword.length < 6) {
					$rootScope.addAlert("error", "新密码长度不得低于6位");
					return false;
				} else if (checkParams.newPassword
						&& checkParams.newPassword.length > 20) {
					$rootScope.addAlert("error", "新密码长度不得超过20位");
					return false;
				} else if (checkParams.confirmPassword
						&& checkParams.confirmPassword.length > 20) {
					$rootScope.addAlert("error", "确认新密码长度不得超过20位");
					return false;
				}
				return true;
			};
			
			//  密码强度
		    $scope.verifyPD = function(passwd) {
		        var passwd = $.trim(passwd);
		        if(passwd.length < 6){
		            $('#passstrength').html("");
		            $('#left_c').css({"background-color":"#D6D3D3"});
		            $('#mid_c').css({"background-color":"#D6D3D3"});
		            $('#right_c').css({"background-color":"#D6D3D3"});
		            return false;
		        }
		        
		        var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$", "g");   // (?=.*\\W).*$	 特殊字符
		        var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$", "g");
		        var enoughRegex = new RegExp("^(?=.*[\\d]+)(?=.*[a-zA-Z]+)(?=.*[^a-zA-Z0-9]+).{6,20}", "g");

		        if (strongRegex.test(passwd)) {
		            //强
		            $('#left_c').css({"background-color":"#E83403"});
		            $('#mid_c').css({"background-color":"#F28415"});
		            $('#right_c').css({"background-color":"#619300"});
		            $('#passstrength').html("");
		            $scope.isStrong = true;
		        } else if (mediumRegex.test(passwd)) {
		            //中
		            $('#left_c').css({"background-color":"#E83403"});
		            $('#mid_c').css({"background-color":"#F28415"});
		            $('#right_c').css({"background-color":"#D6D3D3"});
		            $('#passstrength').html("");
		            $scope.isStrong = true;
		        } else {
		            //弱
		            $('#left_c').css({"background-color":"#E83403"});
		            $('#mid_c').css({"background-color":"#D6D3D3"});
		            $('#right_c').css({"background-color":"#D6D3D3"});
		            $('#passstrength').html("");
		            $scope.isStrong = false;
		        }
		        return true;
		    };

		});