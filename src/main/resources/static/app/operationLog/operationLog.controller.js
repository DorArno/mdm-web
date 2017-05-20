angular.module('operationLog')
  .controller('OperationLogCrl', function($scope, $modal, httpService, $rootScope) {
	$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
		pageNum : 1,
		pageSize : 10
	};
	
	$scope.queryParamsOptions = {
		dataTypeInfoList: []
	};
	
	//页面初期化查询
    $scope.init = function () {
      $scope.initQueryParamsOptions();
      $scope.queryOperationLogList();
      
      $scope.queryParamsOptions.dataTypeInfoList.push({id:"-1", name:"数据类型"});
      if (!$scope.staticDataList) {
    	  $scope.queryStaticData(function() {
			for(var i = 0; i < $scope.staticDataList.length; i++) {
				var data = $scope.staticDataList[i];
				if(data.colName == "DataType"){
					$scope.queryParamsOptions.dataTypeInfoList.push({id:data.colValue, name:data.description});
				}
			}
			$scope.queryParams.dataType = "-1";
    	  });
	  }
    };
	
	//查询操作日志信息
    $scope.queryOperationLogList = function () {
    	$scope.queryParams.dataId = $scope.dataId;
    	if($scope.dataType != undefined) {
    		$scope.queryParams.dataType = $scope.dataType;
    	}
    	httpService.req("GET","/web/mdm/operationLog/operationLogs", $scope.queryParams, function (result) {
        var data = result.data;
		if (data != null) {
			$scope.operationLogList = data.list;
			if (!$scope.staticDataList) {
				$scope.queryStaticData($scope.setDataTypeText);
			} else {
				$scope.setDataTypeText();
			}
		}
        $scope.totalItems = data.totalCount;
      }, true);
    };
    
  //初始化查询参数：数据类型
    $scope.initQueryParamsOptions = function() {
    	//数据类型
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:-1, name:"数据类型"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:1, name:"用户数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:2, name:"角色数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:3, name:"行政区划数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:4, name:"组织机构数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:5, name:"商家数据"});
    	//$scope.queryParams.dataType = "-1";
    }
    
    $scope.queryStaticData = function (callback) {
    	httpService.req("GET","/web/mdm/staticdata", {tableName:"OperationLog"}, function (result) {
			if (result && result.data) {
				$scope.staticDataList = result.data;
				callback();
			}
		}, true);
    }
    
  //设置数据的数据类型文字
    $scope.setDataTypeText = function() {
    	if($scope.operationLogList){
    		for (var i = 0; i < $scope.operationLogList.length; i++) {
    			var dataTypeText = "";
    			if($scope.operationLogList[i].dataType) {
    				dataTypeText = $scope.getTextFromStaticData("DataType", $scope.operationLogList[i].dataType)
    			}
    			$scope.operationLogList[i].dataTypeText = dataTypeText;
    		}
    	}
    }
    
  //打开查看数据界面
    $scope.goView = function (index) {
      $scope.editIndex = index;
      $scope.viewParams = $scope.operationLogList[index];
      $scope.viewModal = $modal.open({
        templateUrl: "app/operationLog/viewOperationLog.html",
        scope: $scope,
        backdrop : 'static',
        windowClass: 'app-modal-window'
      });
    };
    
    //取消编辑
    $scope.closeView = function () {
      $scope.viewModal.close();
    };
    
    //分页
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
    $scope.queryOperationLogList();
    };
    
    // 根据dataId查询历史记录
    $scope.viewHistory = function (dataId,dataType,callback) {
    	// 清除缓存
    	$scope.totalItems = '';
      	$scope.dataId = dataId;
      	$scope.dataType = dataType;
      	$scope.callback = callback;
      	$scope.viewHistoryModal = $modal.open({
        	templateUrl: "app/operationLog/operationLogList.html",
        	scope: $scope,
        	backdrop : 'static',
        	windowClass: 'app-modal-window'
      	});
    };
    
    //从StaticData中获取文字
    $scope.getTextFromStaticData = function(colName, colValue) {
    	for(var i = 0; i < $scope.staticDataList.length; i++) {
    		if($scope.staticDataList[i].colName == colName && $scope.staticDataList[i].colValue == colValue) {
    			return $scope.staticDataList[i].description;
    		}
    	}
    	return "";
    }
    
    $scope.recoverHistory = function (id) {
    	layer.confirm('确认要恢复吗？', {
    	    btn: ['确定','取消'],
    	    title:"确定"
    	}, function(flag){
		      layer.close(flag);
		      httpService.req("POST","/web/mdm/operationLog/recoverHistory/"+id, {}, function (result) {
			  	if (result && result.data >= 0) {
			        $rootScope.addAlert("success", "操作成功!");
			        $scope.viewHistoryModal.close();
			        if ($scope.callback && typeof $scope[$scope.callback] === 'function') {
				        $scope[$scope.callback]();
				    }
			    }
		      }, true, {dataId:$scope.dataId});
    	});
    };
    
    $scope.cancelAdd = function () {
      	$scope.viewHistoryModal.close();
    };
    
  });

//截取指定长度字符串
angular.module('operationLog')
	.filter('cut', function () {
      return function (value, wordwise, max, tail) {
          if (!value) return '';

          max = parseInt(max, 10);
          if (!max) return value;
          if (value.length <= max) return value;

          value = value.substr(0, max);
          if (wordwise) {
              var lastspace = value.lastIndexOf(' ');
              if (lastspace != -1) {
                  value = value.substr(0, lastspace);
              }
          }

          return value + (tail || ' …');
      };
  });