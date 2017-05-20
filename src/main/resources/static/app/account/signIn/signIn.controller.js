(function(){
	'use strict';

	angular.module('account')
	.controller('SignInCtrl',SignInCtrl);

	function SignInCtrl($scope, httpService, $rootScope, $state){
      
//        $scope.login = function() {
//            httpService.req("POST","/web/mdm/login/loginCheck", $scope.user, function(data) {
//                if (data ==1) {
//                  console.log(data);
//                  localStorage.setItem("userName",$scope.user.userName);
////                  $rootScope.defaults.headers.post['token'] = 'mdm';
//        	      $rootScope.addAlert("info","登录成功");
//                  $state.go('main.index');
//                } else {
//                  $scope.loginerror = true;
//                  $scope.loginerrorinfo = "用户名密码错误,请重新登录~"
//
//                }
//            });
//        };

        $scope.goIndexPage = function () {
        	
        	httpService.req("GET","/web/mdm/global/queryLoginName", {}, function(data) {
        		console.log("userName:"+data);
                localStorage.setItem("userName",data.username);
                localStorage.setItem("user_Phone",data.cellPhone);
                localStorage.setItem("userId",data.id);
                $state.go('main.index');
        	});
        	
        }

	}
})();

