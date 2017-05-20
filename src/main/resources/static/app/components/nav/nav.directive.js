(function() {
  'use strict';

  angular
    .module('mdm')
    .directive('mdmNav', mdmNav);

  function mdmNav($rootScope, httpService,$state) {
    var directive = {
      restrict: 'E',
      templateUrl: 'app/components/nav/nav.html',
      controller: NavCtrl,
      bindToController: true,
    };
    return directive;


    function NavCtrl($scope, $location) {
      var displayMenu = function(menuList) {
        $rootScope.topMenuList = [];
        $rootScope.menuActiveFlag = [];
        $rootScope.subMenuActiveFlag = [];
        var subMenuRef = {};
        angular.forEach(menuList, function(menu, key) {
        //生成导航&二级导航
        if (menu.parentId == 0) {
          $rootScope.topMenuList.push(menu);
        }
        else {
          if (!subMenuRef[menu.parentId]) {
            subMenuRef[menu.parentId] = [];
          }
          subMenuRef[menu.parentId].push(menu);
          $scope.subMenuRef = subMenuRef;
        }
        //初始化展开菜单
          $rootScope.menuActiveFlag = [];
        });
      };

      $scope.queryMenuList = function() {
      	httpService.req("GET","/web/mdm/global/queryMenuList", {}, function (res) {
          var menus = [];
          var datas = res.data;
      	 for(var i=0,len = datas.length ; i < len ; i++) {
      	 	var menu = {};
      	 	menu.id = datas[i].id;
      	 	menu.name = datas[i].moduleName;
      	 	menu.url = datas[i].moduleUrl;
      	 	menu.parentId = datas[i].parentId || '';
      	 	menus.push(menu);
      	 }
         displayMenu(menus);
      }, true);
      };
      
      $scope.queryMenuList();

      //展开收起菜单
      $scope.switchMenu = function (menuid) {
        if (document.getElementById("menu-"+menuid).classList.contains("active")) {
          $rootScope.menuActiveFlag = [];
        }else {
          $rootScope.menuActiveFlag = [];
          $rootScope.menuActiveFlag[menuid] = true;
        }
      }

      //点击跳转页面时菜单发生变化
      $scope.changeMenu = function(submenuid,menuid) {
        $rootScope.subMenuActiveFlag = [];
        $rootScope.subMenuActiveFlag[submenuid] = true;
        $rootScope.menuActiveFlag = [];
        $rootScope.menuActiveFlag[menuid] = true;
      };

    }
  }

})();
