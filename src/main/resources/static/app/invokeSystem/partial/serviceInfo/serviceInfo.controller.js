angular.module('invokeSystem')
  .controller('ServiceInfoCrl', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    //isDeleted
    $scope.isDeletedList = [{
      title: "停用",
      value: "1"
    }, {
      title: "启用",
      value: "0"
    }];
    $scope.statusList = [{
        title: "启用",
        value: "1"
      }, {
        title: "停用",
        value: "0"
      }];
    //serviceTypeList
    $scope.serviceTypeList = [{
        title: "GET",
        value: "1"
      }, {
        title: "DELETE",
        value: "0"
      }, {
          title: "POST",
          value: "2"
        }, {
            title: "PUT",
            value: "3"
          }];
    //页面初期化查询
    $scope.init = function () {
      $scope.queryServiceInfoList();
    };
    //查询系统列表
    $scope.querySystemNames = function () {
        httpService.req("GET","/web/mdm/invokeSystem/querySystemNameList", {}, function (result) {
          var data = result.data;
          if (data != null) {
            $scope.sysNameList = data.list;            
          }
        }, true);
      };
      //获取该接口接入的系统
      $scope.getSysNamesByService = function (index) {
    	  var param = {id:$scope.serviceInfoList[index].id}
          httpService.req("GET","/web/mdm/invokeSystem/getSysNamesByServiceCode",param, function (result) {
            var data = result.data;
            if (data != null) {
               $scope.sysNames=data;              
               $scope.typeModel=data;
            }
          }, true);
        };
    //查询系统信息
    $scope.queryServiceInfoList = function () {
      httpService.req("GET","/web/mdm/invokeSystem/serviceInfo", $scope.queryParams, function (result) {
        var data = result.data;
        if (data != null) {
          $scope.serviceInfoList = data.list;
        }
        $scope.totalItems = data.totalCount;

      }, true);
    };

    //打开新增页面
    
    $scope.addServiceInfo = function () {
    	$scope.typeModel=[];
    	$scope.querySystemNames();
        $scope.addParams = {};
        $scope.addModal = $modal.open({
          templateUrl: "app/invokeSystem/partial/serviceInfo/addServiceInfo.html",
          backdrop:'static', 
          scope: $scope

        });
      };

    //新增确认
    $scope.addConfirm = function () {
        var array = [];
        for(var i =0;i< $scope.typeModel.length;i++){
      	  array.push($scope.typeModel[i].id);
        }
        $scope.addParams.systemId=array;
        if (!$scope.checkEdit($scope.addParams)) {
          return;
        }
//        if(!$scope.checkExist()){
//        	return;
//        }
        httpService.req("POST","/web/mdm/invokeSystem/serviceInfo",{},function (res) {
          if (res.data == 1) {
            $rootScope.addAlert("success", "操作成功");
            $scope.addModal.close();
            $scope.queryServiceInfoList();
          }

        }, true, $scope.addParams);
        
      };
    //关闭新增商品
    $scope.cancelAdd = function () {
      $scope.addModal.close();
    };

    //打开编辑界面
    $scope.editParams = {};
    $scope.goEdit = function (index) {
      $scope.querySystemNames();
      $scope.typeModel=[];
      $scope.checkeds=$scope.getSysNamesByService(index);      
      $scope.editIndex = index;
      $scope.editParams = $scope.serviceInfoList[index];
      $scope.editModal = $modal.open({
        templateUrl: "app/invokeSystem/partial/serviceInfo/editServiceInfo.html",
        backdrop:'static', 
        scope: $scope
      });
    };

    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {

        if (checkParams.serviceName == null || checkParams.serviceName=="") {
          $rootScope.addAlert("error", "接口名称不能为空");
          return false;
        } else if (checkParams.serviceName.length >50) {
            $rootScope.addAlert("error", "接口名称长度不能超过50");
            return false;
        } else if (checkParams.serviceCode == null || checkParams.serviceCode=="") {
          $rootScope.addAlert("error", "接口URL不能为空");
          return false;
        } else if (checkParams.serviceCode.length >50) {
            $rootScope.addAlert("error", "接口URL长度不能超过50");
            return false;
        } else if(checkParams.serviceType ==null){
        	$rootScope.addAlert("error","接口类型不能为空");
        	return false;
        } else if(checkParams.status ==null){
        	$rootScope.addAlert("error","接口状态不能为空");
        	return false;
        }
        return true;
      };

    //确认编辑
    $scope.editConfirm = function () {
    	var array = [];
        for(var i =0;i< $scope.typeModel.length;i++){
      	  array.push($scope.typeModel[i].id);
        }
        $scope.editParams.systemId=array;
    	layer.confirm('确认要提交？', {
    	    btn: ['提交','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
		
		      if (!$scope.checkEdit($scope.editParams)) {
		        return;
		      }
//		      if(!$scope.checkExist()){
//		        	return;
//		      }
		      httpService.req("PUT","/web/mdm/invokeSystem/serviceInfo/"+$scope.editParams.id, {}, function (res) {
		
		        if (res.data == 1) {
		
		          $rootScope.addAlert("success", "操作成功!");
		          $scope.editModal.close();
		          $scope.queryServiceInfoList();
		        }
		      }, true, $scope.editParams);
    	});

    };

    //取消编辑
    $scope.cancelEdit = function () {
      $scope.editModal.close();
      $scope.queryServiceInfoList();
    };


    

    
    //确认删除
    $scope.doDel = function (index) {
    	$scope.delParams =$scope.serviceInfoList[index];
        layer.confirm('确认要删除当前接口吗？', {
    	    btn: ['确认','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
        
		      httpService.req("PUT","/web/mdm/invokeSystem/deleteServiceInfo/"+$scope.delParams.id,{},function (res) {
	          if (res.data == 1) {
	        	 $rootScope.addAlert("success", "操作成功!");
		         $scope.queryServiceInfoList();
	          }

	        }, true, $scope.serviceInfoList);
    	});
        
    };
    //复选框选择
    
    //分页
    $scope.currentPage = 0;
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
        $scope.currentPage = pageNo;
      };
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.queryServiceInfoList();//这里需要改为当前查询的请求方法
    };

    //打开查看数据界面
    $scope.sysNames =[];
    $scope.goView = function (index) {
      $scope.editIndex = index;
      $scope.viewParams = $scope.serviceInfoList[index];
      $scope.sysNames = $scope.getSysNamesByService(index)
      $scope.viewModal = $modal.open({
        templateUrl: "app/invokeSystem/partial/serviceInfo/paramsViewInfo.html",
        scope: $scope
      });
    };
    $scope.closeView = function () {
        $scope.viewModal.close();
        $scope.queryServiceInfoList();
      };
   //下拉复选

//	  $scope.typeList = $scope.sysNameList;
	  $scope.typeModel = [];
	  $scope.typeSettings = {
			scrollableHeight : '200px',
			scrollable : true,
			smartButtonMaxItems : 2,
			smartButtonTextConverter : function(itemText,
					originalItem) {
				if (itemText === 'Jhon') {
					return 'Jhonny!';
				}

				return itemText;
			}
		};
	//-----------------------------------------------------------------------------------------------------
//      $scope.checkResult={};
//      $scope.checkExistParams= function(code){
//    	  var Params ={
//    		    sysCode : code,
//    			  pageNum : 1,
//  				pageSize : 100000
//    	  }
//    	  httpService.req("GET","/web/mdm/invokeSystem/checkExistParams", Params, function (result) {
//    	        if (result!=null && result.data!=null) {
//    	        	$scope.checkResult = result.data.list;
//    	        }
//    	        
//    	  }, true);
//    	};
//    $scope.checkExist = function(){
//  	  if($scope.checkResult!=null && $scope.checkResult.length>0){
//    		$rootScope.addAlert("error", "您的接口URL已经存在，请更换！");
//	        	return false;
//      }
//	  	return true;	
//    };
//-----------------------------------------------------------------------------------------------------	 
  });
