angular.module('operation')
  .controller('OperationCrl', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    $scope.methods = ['GET','POST','PUT','DELETE'];
    
    $scope.moduleInfo = [];
    
    //页面初期化查询
    $scope.init = function () {
      $scope.queryModuleList();
      $scope.queryOperationList();
    };
    
    //查询菜单信息
    $scope.queryModuleList = function () {
      httpService.req("GET","/web/mdm/operation/queryModuleList", null, function (result) {
        var data = result.data;
        if (data != null) {
          $scope.moduleInfo = data;
        }
      }, true);
    };
    
    //查询系统信息
    $scope.queryOperationList = function () {
      httpService.req("GET","/web/mdm/operation/operationInfos", $scope.queryParams, function (result) {
        var data = result.data;
        if (data != null) {
          $scope.systemInfoList = data.list;
        }
        $scope.totalItems = data.totalCount;
      }, true);
    };
    
    //分页
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.queryOperationList();//这里需要改为当前查询的请求方法
    };
    
    //打开新增页面
    $scope.addOperation = function () {
    	$scope.addParams = {module:{}};
    	$scope.flag = 'add' ;
      	$scope.addModal = $modal.open({
        	templateUrl: "app/operation/addOperation.html",
        	scope: $scope,
			backdrop : 'static'
      	});
    };

    //新增确认
    $scope.addConfirm = function () {
    	if (!$scope.checkEdit($scope.addParams)) {
        	return;
      	}
      	httpService.req("POST","/web/mdm/operation/operationInfos",{},function (data) {
        	if (data && data.data == 1) {
          		$rootScope.addAlert("success", "操作成功");
          		$scope.cancelAdd();
          		$scope.queryOperationList();
        	}
      	}, true, $scope.addParams);
    };

    //关闭新增商品
    $scope.cancelAdd = function () {
      	$scope.addModal.close();
    };
    
    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {
    	if (!checkParams.actionName) {
        	$rootScope.addAlert("error", "名称不能为空");
        	return false;
      	}
      	if (!checkParams.moduleId) {
	       	$rootScope.addAlert("error", "请选择菜单");
        	return false;
      	}
      	if (!checkParams.keyCode) {
      		$rootScope.addAlert("error", "KeyCode不能为空");
        	return false;
      	}
      	if (!checkParams.path) {
      		$rootScope.addAlert("error", "路径不能为空");
        	return false;
      	}
      	if (!checkParams.httpMethod) {
      		$rootScope.addAlert("error", "请选择方法");
        	return false;
      	}
      	return true;
    };
    
    // 选择菜单
    $scope.chooseModule = function() {
    	$scope.chooseModal = $modal.open({
        	templateUrl: "app/operation/chooseModule.html",
        	scope: $scope,
        	backdrop : 'static'
      	});
    };
    
    //关闭选择菜单
    $scope.cancelChooseAdd = function () {
      $scope.chooseModal.close();
    };
    
    //选择菜单确认
    $scope.addChooseConfirm = function () {
    	var params = $scope.flag == 'add' ? $scope.addParams : $scope.editParams 
		var node = tree.getSelectedNode();
		params.moduleId = node.id;
		params.module.moduleName = node.name;
		$scope.chooseModal.close();
    };
    
    //打开编辑界面
    $scope.goEdit = function (index) {
    	$scope.flag = 'edit' ;
      	$scope.editParams = {};
      	angular.copy($scope.systemInfoList[index], $scope.editParams);
      	if (!$scope.editParams.module) {
      		$scope.editParams.module = {};
      	}
      	$scope.editModal = $modal.open({
        	templateUrl: "app/operation/editOperation.html",
        	scope: $scope,
        	backdrop : 'static'
      	});
    };
    
    //确认编辑
    $scope.editConfirm = function () {
      	if (!$scope.checkEdit($scope.editParams)) {
        	return;
      	}
      	httpService.req("PUT","/web/mdm/operation/operationInfos/"+$scope.editParams.id, {}, function (data) {
        	if (data && data.result === 'true') {
          		$rootScope.addAlert("success", "操作成功!");
          		$scope.cancelEdit();
          		$scope.queryOperationList();
        	}
      	}, true, $scope.editParams);
    };

    //取消编辑
    $scope.cancelEdit = function () {
      	$scope.editModal.close();
    };
    
    //确认删除
    $scope.doDel = function (index) {
    	layer.confirm('确认要删除吗？', {
    	    btn: ['确定','取消'],
    	    title:"确定"
    	}, function(flag){
		      layer.close(flag);
		      httpService.req("DELETE","/web/mdm/operation/operationInfos/"+$scope.systemInfoList[index].id, {}, function (data) {
	        	if (data && data.data > 0) {
	          		$rootScope.addAlert("success", "操作成功!");
	          		$scope.queryOperationList();
	        	}
	      	}, true);
    	});
    }
  });
