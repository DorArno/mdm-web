/**
 * created by gaod003 on 2016/09/23
 */
angular.module('invokeSystem')
  .controller('SystemInfoCrl', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    //isDeleted
    $scope.statusList = [{
      title: "启用",
      value: 1
    }, {
      title: "停用",
      value: 0
    }];
    
    //isDeleted
    $scope.whiteTypeList = [{
      title: "域名",
      value: 2
    }, {
      title: "ip网段",
      value: 1
    }, {
        title: "ip地址",
        value: 0
    }];
    
    //页面初期化查询
    $scope.init = function () {
    	$scope.queryOrgTypeList();
    	$scope.querySystemInfoList();
    };
    
    
    // 查询组织类型信息
	$scope.queryOrgTypeList = function() {
		var params = {
			tableName : "OrganizationType"
		};
		httpService.req("GET", "/web/mdm/staticdata", params,
				function(result) {
					$scope.orgTypeList = result.data;
				}, true);
	};

    //查询系统信息
    $scope.querySystemInfoList = function () {
      httpService.req("GET","/web/mdm/invokeSystem/systemInfo", $scope.queryParams, function (result) {
        var data = result.data;
        if (data != null) {
        	var systemInfoList = data.list;
			
			//	设置组织类型
			for(var i = 0; i < systemInfoList.length; i++) {
				for(var j = 0; j < $scope.orgTypeList.length; j++) {
					var systemInfo = systemInfoList[i], orgType = $scope.orgTypeList[j];
					if(systemInfo.type == orgType.colValue) {
						systemInfoList[i].orgType = orgType.colName;
						break;
					}else{
						systemInfoList[i].orgType = "";
					}
				}
			}
          $scope.systemInfoList = systemInfoList;
        }
        $scope.totalItems = data.totalCount;

      }, true);
    };

    $scope.addParams = {};
    //打开新增页面
    $scope.addSystemInfo = function () {
      $scope.addParams = {};
      $scope.addModal = $modal.open({
        templateUrl: "app/invokeSystem/partial/systemInfo/addSystemInfo.html",
        backdrop:'static', 
        scope: $scope

      });
    };

    //新增确认
    $scope.addConfirm = function () {
    	
      if (!$scope.checkEdit($scope.addParams)) {
        return;
      }
      httpService.req("POST","/web/mdm/invokeSystem/systemInfo",{},function (res) {
        if (res.data == 1) {
          $rootScope.addAlert("success", "操作成功");
          $scope.addModal.close();
          $scope.querySystemInfoList();
        }

      }, true, $scope.addParams);
      
    };

    //关闭新增商品
    $scope.cancelAdd = function () {
      $scope.addModal.close();
    };

    //打开编辑界面
    $scope.editParams = {};
    $scope.orgTypeList=[];
    $scope.goEdit = function (index) {
      
      $scope.editIndex = index;
//      $scope.editParams = $scope.systemInfoList[index];
      angular.copy($scope.systemInfoList[index], $scope.editParams);
      if($scope.editParams.status ==0){
    	  $rootScope.addAlert("error", "该系统已停用，请启用后再操作。");
    	  return false;
      }
      $scope.editModal = $modal.open({
        templateUrl: "app/invokeSystem/partial/systemInfo/editSystemInfo.html",
        backdrop:'static', 
        scope: $scope
      });
    };

   

    //确认编辑
    $scope.editConfirm = function () {
    	
    	 if (!$scope.checkEdit($scope.editParams)) {
		     return;
		 }
		
    	layer.confirm('确认要提交？', {
    	    btn: ['提交','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
		
		     
		      httpService.req("PUT","/web/mdm/invokeSystem/systemInfo/"+$scope.editParams.id, {}, function (res) {
		
		        if (res.data == 1) {
		
		          $rootScope.addAlert("success", "操作成功!");
		          $scope.editModal.close();
		          $scope.querySystemInfoList();
		        }
		      }, true, $scope.editParams);
    	});

    };

    //取消编辑
    $scope.cancelEdit = function () {
      $scope.editModal.close();
    };
    
    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {

      if (checkParams.sysName == null) {
        $rootScope.addAlert("error", "系统名称不能为空");
        return false;
      } else if (checkParams.sysName.length >20) {
          $rootScope.addAlert("error", "系统名称长度不能超过20");
          return false;
      } else if (checkParams.sysCode == null) {
        $rootScope.addAlert("error", "系统编码不能为空");
        return false;
      } else if (checkParams.sysCode.length >10) {
          $rootScope.addAlert("error", "系统编码长度不能超过10");
          return false;
      } else if (checkParams.type == null) {
          $rootScope.addAlert("error", "组织类型不能为空");
          return false;
      } else if (checkParams.status == null) {
          $rootScope.addAlert("error", "状态不能为空");
          return false;
      } else if (checkParams.beginDate ==null || checkParams.endDate ==null) {
          $rootScope.addAlert("error", "授权key生失效时间不能为空");
          return false;
      }

      return true;
    };
    
    $scope.goWhiteParams ={};
    //进入白名单管理界面
    $scope.goWhite = function (index) {
    	
    	$scope.whiteParams ={};

        $scope.goWhiteParams = $scope.systemInfoList[index];
        $scope.whiteSysName = $scope.goWhiteParams.sysName;
        if($scope.goWhiteParams.status ==0){
      	  $rootScope.addAlert("error", "该系统已停用，请启用后再操作。");
      	 return false;
        }
        
        $scope.queryWhiteInfoList();
        
        $scope.whiteModal = $modal.open({
          templateUrl: "app/invokeSystem/partial/systemInfo/whiteInfo.html",
          backdrop:'static',
          scope: $scope
        });
        
    };
    //关闭白名单管理界面
    $scope.cancelWhite = function () {
      $scope.whiteModal.close();
      $scope.querySystemInfoList();
    };
    
    //查询白名单列表信息
    $scope.queryWhiteInfoList = function () {
    	 httpService.req("GET","/web/mdm/invokeSystem/systemInfo/"+$scope.goWhiteParams.id+"/whiteInfo", {}, function (result) {
   	      var data = result.data;
   	      if (data != null) {
   	        $scope.whiteInfoList = data;
   	      }
   	    }, true);
    };
    
    $scope.whiteParams ={};
    //新增ip白名单
    $scope.addWhiteInfo = function () {
    	
    	layer.confirm('确认要新增此ip白名单？', {
    	    btn: ['确认','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
		      
		      var whiteType = $scope.whiteParams.whiteType;
		      var ipStr = $scope.whiteParams.ipAddress;
		      
		      if(whiteType == null){
		    	  $rootScope.addAlert("error", "请选择白名单类型");
		   	        return;
		      }
		      if(ipStr == null){
		    		$rootScope.addAlert("error", "白名单不能为空");
		   	        return;
		      }
		      
		      if(whiteType == 0 && !ipStr.match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)){
		    	  	$rootScope.addAlert("error", "ip地址格式有误");
		   	        return;
		      }
		      
		      if(whiteType == 1  ){
		    	  var ipArr = ipStr.split("-");
		    	  if(ipArr.length<2){
		    		  $rootScope.addAlert("error", "ip网段格式有误");
		    		  return;
		    	  }
		    	  if(!ipArr[0].match(/^((25[0-5]|2[0-4]\d|[01]?\d\d?)($|(?!\.$)\.)){4}$/)){
		    		  $rootScope.addAlert("error", "ip网段格式有误");
		    		  return;
		    	  }
		    	 
		    	  var ipstart = ipArr[0].split(".");
		    	  if(isNaN(ipArr[1]) || parseInt(ipArr[1]) > 255 || parseInt(ipstart[3]) > parseInt(ipArr[1])){
		    		  $rootScope.addAlert("error", "ip网段格式有误,格式为:11.11.11.1-200");
		    		  return;
		    	  }
		    	  	
		      }
		      
		      if(whiteType == 2 && !ipStr.match("^[A-Za-z\d][A-Za-z\d\.-:]+$")  ){
		    	  	$rootScope.addAlert("error", "域名格式有误");
		   	        return;
		      }
		      
		      httpService.req("POST","/web/mdm/invokeSystem/systemInfo/"+$scope.goWhiteParams.id+"/whiteInfo",{},function (res) {
		          if (res.data == 1) {
		            $rootScope.addAlert("success", "操作成功");
		            $scope.queryWhiteInfoList();
		          }

		        }, true, $scope.whiteParams);
		
    	});

    };
    
    $scope.deleteWhiteInfo = function (index) {
    	
        $scope.whiteInfoParams = $scope.whiteInfoList[index];
        
        layer.confirm('确认要删除此ip白名单？', {
    	    btn: ['确认','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
        
		      httpService.req("PUT","/web/mdm/invokeSystem/systemInfo/whiteInfo/"+$scope.whiteInfoParams.id,{},function (res) {
	          if (res.data == 1) {
	            $rootScope.addAlert("success", "操作成功");
	            $scope.queryWhiteInfoList();
	          }

	        }, true, $scope.whiteInfoParams);
    	});
        
    };
    
    //确认删除
    $scope.doDel = function (index) {
      layer.confirm('确认要删除吗？', {
    	    btn: ['确定','取消'],
    	    title:"确定"
    	}, function(flag){
		      layer.close(flag);
		      httpService.req("DELETE","/web/mdm/invokeSystem/systemInfo/"+$scope.systemInfoList[index].id, {}, function (result) {
		        if (result && result.data == 1) {
		          $rootScope.addAlert("success", "操作成功!");
		          $scope.querySystemInfoList();
		        }
		      }, true);
    	});
    };
    
    //修改状态
    $scope.updateStatus = function (index,status) {
    	layer.confirm(status ==1 ?'确认要启用吗？':'确认要停用吗？', {
    	    btn: ['确定','取消'],
    	    title:"确定"
    	}, function(flag){
		      layer.close(flag);
		      	$scope.editParams = {};
		//      	angular.copy($scope.systemInfoList[index], $scope.editParams);
		      	$scope.editParams.status = status; 
		      	httpService.req("PUT","/web/mdm/invokeSystem/systemInfo/"+$scope.systemInfoList[index].id+"/status",{}, function (result) {
		        	if (result && result.data == 1) {
		          		$rootScope.addAlert("success", "操作成功!");
		          		$scope.querySystemInfoList();
		        	}
		      	}, true, $scope.editParams);
    	});
    };
    
    //分页
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.querySystemInfoList();//这里需要改为当前查询的请求方法
    };
    
    $scope.guid = function () {
        function S4() {
           return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
        }
        var key = (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
        $scope.editParams.authCode=key;
    }

  });
