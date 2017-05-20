//菜单管理功能
angular.module('module')
  .controller('ModuleCrl', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    //isDeleted
    $scope.isDeletedList = [{
      title: "已删除",
      value: 1
    }, {
      title: "正常",
      value: 0
    }];

    //页面初期化查询
    $scope.init = function () {
      $scope.querySystemInfoList();
    };
    
    $scope.moduleStates = [{title:'启用',value:1},{title:'停用',value:0}];
    //查询系统信息
    $scope.querySystemInfoList = function () {
      httpService.req("GET","/web/mdm/module/moduleInfos", $scope.queryParams, function (result) {
        if (result && result.data) {
        	$scope.systemInfoList = result.data.list;
        	$scope.totalItems = result.data.totalCount;
        }
      }, true);
    };

    //打开新增页面
    $scope.addSystemInfo = function () {
    	$scope.addParams = {parent:{}};
    	$scope.flag = 'add' ;
      $scope.addModal = $modal.open({
        templateUrl: "app/module/addModule.html",
        scope: $scope,
		backdrop : 'static'
      });
    };

    //新增确认
    $scope.addConfirm = function () {
      if (!$scope.checkEdit($scope.addParams)) {
        return;
      }
      httpService.req("POST","/web/mdm/module/moduleInfos",{},function (data) {
        if (data && data.data == 1) {
          $rootScope.addAlert("success", "操作成功");
          $scope.addModal.close();
          $scope.querySystemInfoList();
          $scope.queryMenuList();
        }

      }, true, $scope.addParams);
    };

    //关闭新增商品
    $scope.cancelAdd = function () {
      $scope.addModal.close();
    };

    //打开编辑界面
    $scope.goEdit = function (index) {
    	$scope.flag = 'edit' ;
      $scope.editIndex = index;
      $scope.editParams = {};
      angular.copy($scope.systemInfoList[index], $scope.editParams);
      if (!$scope.editParams.parent) {
      	$scope.editParams.parent = {};
      }
      $scope.editModal = $modal.open({
        templateUrl: "app/module/editModule.html",
        scope: $scope,
        backdrop : 'static'
      });
    };

    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {
      if (!checkParams.moduleName) {
        $rootScope.addAlert("error", "名称不能为空");
        return false;
      }
      if (!checkParams.moduleState && checkParams.moduleState !== 0) {
	       $rootScope.addAlert("error", "请选择状态");
        return false;
      }
      if (!checkParams.moduleSort) {
      	$rootScope.addAlert("error", "排序不能为空");
        return false;
      }
      if (!/^[1-9]\d*|^0$/.test(checkParams.moduleSort)) {
      	$rootScope.addAlert("error", "排序只能输入整数");
        return false;
      }
      if ((checkParams.moduleSort - 0) > 99999999) {
      	$rootScope.addAlert("error", "排序输入数字超过指定范围[0-99999999]");
        return false;
      }
      return true;
    };

    //确认编辑
    $scope.editConfirm = function () {
      if (!$scope.checkEdit($scope.editParams)) {
        return;
      }
      httpService.req("PUT","/web/mdm/module/moduleInfos/"+$scope.editParams.id, {}, function (data) {
        if (data && data.result === 'true') {
          $rootScope.addAlert("success", "操作成功!");
          $scope.editModal.close();
          $scope.querySystemInfoList();
          $scope.queryMenuList();
        }
      }, true, $scope.editParams);
    };

    //取消编辑
    $scope.cancelEdit = function () {
      $scope.editModal.close();
    };

    //分页
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      
      
      $scope.queryParams.pageNum = pageNo;
      $scope.querySystemInfoList();//这里需要改为当前查询的请求方法
    };
    
    // 选择父节点
    $scope.chooseParent = function() {
    	$scope.chooseModal = $modal.open({
        templateUrl: "app/module/chooseParent.html",
        scope: $scope,
        backdrop : 'static'
      });
    };
    
    //关闭新增商品
    $scope.cancelChooseAdd = function () {
      $scope.chooseModal.close();
    };
    
    //新增确认
    $scope.addChooseConfirm = function () {
    	var params = $scope.flag == 'add' ? $scope.addParams : $scope.editParams 
		var node = tree.getSelectedNode();
		if (node.id === params.id) {
			$rootScope.addAlert("error", "不能选择自己");
			return;
		}
		params.parentId = node.id;
		params.parent.moduleName = node.name;
		params.parent.path = node.path;
		params.parent.moduleState = node.info.state;
		params.parent.moduleLevel = node.info.level;
		$scope.chooseModal.close();
    };
    
    //确认删除
    $scope.doDel = function (index) {
      layer.confirm('确认要删除当前节点及其所有子节点吗？', {
    	    btn: ['确定','取消'],
    	    title:"确定"
    	}, function(flag){
		      layer.close(flag);
		      httpService.req("DELETE","/web/mdm/module/moduleInfos/"+$scope.systemInfoList[index].id, {path:$scope.systemInfoList[index].path}, function (data) {
	        if (data && data.data > 0) {
	          $rootScope.addAlert("success", "操作成功!");
	          $scope.querySystemInfoList();
	          $scope.queryMenuList();
	        }
	      }, true);
    	});
      
      
      
    };

  });
