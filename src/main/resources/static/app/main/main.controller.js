   String.prototype.startWith=function(str){

    if(str==null||str==""||this.length==0||str.length>this.length)

    return false;

    if(this.substr(0,str.length)==str)

    return true;

    else

    return false;

    return true;

    };

(function() {
	'use strict';
	angular
			.module('mdm')
			.controller(
					'MainCtrl',
					[
							'$scope',
							'httpService',
							'$state',
							'$interval',
							'$rootScope',
							'$timeout',
							'adAlerts',
							function($scope, httpService, $state, $interval,
									$rootScope, $timeout, adAlerts) {
								$scope.menuList = [];
								$scope.subMenuList = [];
								$scope.userName = localStorage
										.getItem("userName");
								if(null === $scope.userName || '' === $scope.userName || 'null'===$scope.userName){
									$scope.userName = localStorage.getItem("user_Phone");
								}
								var displayMenu = function(menuList) {

								};

								// var userInfo = $rootScope.userInfo;
								// var resources;
								// if (userInfo == undefined) {
								// var auth_user_id =
								// localStorage.getItem("auth_user_id");
								// if (angular.isUndefined(auth_user_id)) {
								// $state.go("signIn");
								// }
								// var param = {
								// userId: auth_user_id,
								// verifyCode:
								// localStorage.getItem("auth_verify_code")
								// };
								// httpService.req("/system/rights/getUserResources",
								// param, function(data) {
								// resources = data;
								//
								// displayMenu(resources);
								// });
								// } else {
								// resources = userInfo.resources;
								//
								// displayMenu(resources);
								// }

								// 点击跳转页面时菜单发生变化
								$scope.changeMenu = function(submenuid, menuid) {
									$rootScope.subMenuActiveFlag = [];
									$rootScope.subMenuActiveFlag[submenuid] = true;
									$rootScope.menuActiveFlag = [];
									$rootScope.menuActiveFlag[menuid] = true;
								};

								// 跳转到安全中心
								// $scope.safe = function() {
								// $state.go("main.safeCenter");
								// };

								$rootScope.logout = function() {
									httpService.req("POST","/web/login/loginOut",null,
										function(data) {
											var tmp = "logout";
											if(data.substr(0,tmp.length)==tmp){
												 window.location.href = data;
											}		 
									});
									
								};

								$rootScope.sideMenushow = true;
								$scope.toggleSideMenu = function() {
									$rootScope.sideMenushow = !$rootScope.sideMenushow;
									// if ($rootScope.sideMenushow) {
									// var tableWidth =
									// $(".er-page-container").width()-32;
									// }
									// angular.element(document.getElementsByClassName('grid')[0]).css('width',
									// "500px");
									// $(".grid").css("width",tableWidth)
								}

								// 去修改密码页面
								$rootScope.goChangePassword = function() {
									$state.go("main.changePassword");
								};

							} ])
})();
