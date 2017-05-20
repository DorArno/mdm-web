angular.module('businessLog')
  .controller('BusinessLogCrl', function($scope, $modal, httpService, $rootScope) {
	$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
		pageNum : 1,
		pageSize : 10
	};
	$scope.queryParamsOptions = {
		destSystemInfoList: [],
		logTypeInfoList: [],
		dataTypeInfoList: [],
		statusInfoList: []
	};
	
	//页面初期化查询
    $scope.init = function () {
      $scope.queryBusinessLogList();
      
      $scope.queryParamsOptions.dataTypeInfoList.push({id:-1, name:"数据类型"});
      $scope.queryParamsOptions.statusInfoList.push({id:-1, name:"状态"});
      if (!$scope.staticDataList) {
    	  $scope.queryStaticData(function() {
    		  for(var i = 0; i < $scope.staticDataList.length; i++) {
	  				var data = $scope.staticDataList[i];
	  				if(data.colName == "DataType"){
	  					$scope.queryParamsOptions.dataTypeInfoList.push({id:data.colValue, name:data.description});
	  				} else if(data.colName == "Status") {
	  					$scope.queryParamsOptions.statusInfoList.push({id:data.colValue, name:data.description});
	  				}
	  			}
    	  });
	  }
    };
	
	//查询MQ日志信息
    $scope.queryBusinessLogList = function () {
    	httpService.req("GET","/web/mdm/businessLog/businessLogs", $scope.queryParams, function (result) {
        var data = result.data;
		if (data != null) {
			$scope.businessLogList = data.list;
			if (!$scope.systemInfoList) {
				$scope.querySystemInfo($scope.setSystemId);
			} else {
				$scope.setSystemId();
			}
			if (!$scope.staticDataList) {
				$scope.queryStaticData($scope.setDataTypeText);
			} else {
				$scope.setDataTypeText();
			}
		}
        $scope.totalItems = data.totalCount;
      }, true);
    };
	
	//查询系统信息，静态表
    $scope.querySystemInfo = function (callback) {
      httpService.req("GET","/web/mdm/invokeSystem/systemInfos", {}, function (result) {
        if (result.data) {
          $scope.systemInfoList = result.data;
          $scope.initQueryParamsOptions();
          callback();
          //$scope.addParams.systemId = $scope.systemInfoList[0];
        }
      }, true);
    };
    $scope.queryStaticData = function (callback) {
    	httpService.req("GET","/web/mdm/staticdata", {tableName:"BusinessLog"}, function (result) {
			if (result && result.data) {
				$scope.staticDataList = result.data;
				callback();
			}
		}, true);
    }
    
  //打开查看数据界面
    $scope.goView = function (index) {
      $scope.editIndex = index;
      $scope.viewParams = $scope.businessLogList[index];
      $scope.viewModal = $modal.open({
        templateUrl: "app/businessLog/viewBusinessLog.html",
        scope: $scope
      });
    };
    
    //初始化查询参数：目标系统、日志类型、数据类型
    $scope.initQueryParamsOptions = function() {
    	//目标系统
    	$scope.queryParamsOptions.destSystemInfoList.push({id:-1, sysName:"目标系统"});
    	for(var i = 0; i < $scope.systemInfoList.length; i++) {
    		$scope.queryParamsOptions.destSystemInfoList.push({
    			id:$scope.systemInfoList[i].id, 
    			sysName:$scope.systemInfoList[i].sysName
    		});
    	}
    	$scope.queryParams.destSystemId = -1;
    	
    	//日志类型
    	$scope.queryParamsOptions.logTypeInfoList.push({id:-1, name:"日志类型"});
    	$scope.queryParamsOptions.logTypeInfoList.push({id:1, name:"新增"});
    	$scope.queryParamsOptions.logTypeInfoList.push({id:2, name:"修改"});
    	$scope.queryParamsOptions.logTypeInfoList.push({id:9, name:"删除"});
    	$scope.queryParams.logType = -1;
    	
    	//数据类型
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:-1, name:"数据类型"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:1, name:"用户数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:2, name:"角色数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:3, name:"行政区划数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:4, name:"组织机构数据"});
//    	$scope.queryParamsOptions.dataTypeInfoList.push({id:5, name:"商家数据"});
    	$scope.queryParams.dataType = -1;
        $scope.queryParams.status = -1;
    }
    
    //设置数据的系统信息
    $scope.setSystemId = function() {
		for(var i = 0; i < $scope.businessLogList.length; i++) {
			for(var j = 0; j < $scope.systemInfoList.length; j++) {
				if($scope.businessLogList[i].sourceSystemId == $scope.systemInfoList[j].id) {
					$scope.businessLogList[i].sourceSystem = $scope.systemInfoList[j];
				}
				if($scope.businessLogList[i].destSystemId == $scope.systemInfoList[j].id) {
					$scope.businessLogList[i].destSystem = $scope.systemInfoList[j];
				}
			}
		}
	}
    //从StaticData中获取文字
    $scope.getTextFromStaticData = function(colName, colValue) {
    	for(var i = 0; i < $scope.staticDataList.length; i++) {
    		if($scope.staticDataList[i].colName == colName && $scope.staticDataList[i].colValue == colValue) {
    			return $scope.staticDataList[i].description;
    		}
    	}
    	return "";
    }
    
    //设置数据的日志类型、数据类型、状态匹配文字
    $scope.setDataTypeText = function() {
    	if($scope.businessLogList){
    		for (var i = 0; i < $scope.businessLogList.length; i++) {
    			var logTypeText = "";
    			var dataTypeText = "";
    			var statusText = "";
    			if($scope.businessLogList[i].logType){
    				logTypeText = $scope.getTextFromStaticData("LogType", $scope.businessLogList[i].logType);
    			}
    			$scope.businessLogList[i].logTypeText = logTypeText;
    			
    			if($scope.businessLogList[i].dataType) {
    				dataTypeText = $scope.getTextFromStaticData("DataType", $scope.businessLogList[i].dataType)
    			}
    			$scope.businessLogList[i].dataTypeText = dataTypeText;
    			
    			if($scope.businessLogList[i].status) {
    				statusText = $scope.getTextFromStaticData("Status", $scope.businessLogList[i].status);
    			}
    			$scope.businessLogList[i].statusText = statusText;
    		}
    	}
    }
    
    //取消编辑
    $scope.closeView = function () {
      $scope.viewModal.close();
    };
    
    //分页
    $scope.currentPage = 0;
    $scope.maxSize = 10;
//    $scope.setPage = function (pageNo) {
//      $scope.currentPage = pageNo;
//    };
    $scope.pageChanged = function (pageNo) {
        $scope.queryParams.pageNum = pageNo;
      $scope.queryBusinessLogList();//这里需要改为当前查询的请求方法
    };
  });

//截取指定长度字符串
angular.module('businessLog')
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