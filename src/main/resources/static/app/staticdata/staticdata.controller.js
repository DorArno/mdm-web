angular.module('staticdata')
  .controller('StaticdataCrl', function ($scope, $modal, httpService, $rootScope) {
	  
	    //页面初期化查询
	    $scope.init = function () {
	      $scope.queryStaticdataList();
	    };

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    $scope.merchantHasnight = [{title:'是',value:0},{title:'否',value:1}];
    //查询数据字典
    $scope.queryStaticdataList = function () {
        httpService.req("GET","/web/mdm/staticdata/staticdatas", $scope.queryParams, function (result) {
          var data = result.data;
          if (data != null) {
            $scope.staticdataList = data.list;
          }
          $scope.totalItems = data.totalCount;

        }, true);
      };

    $scope.addParams = {};

    //打开新增页面
    $scope.addStaticData = function () {
      $scope.addParams = {};
      $scope.addModal = $modal.open({
        templateUrl: "app/staticdata/addStaticdata.html",
        backdrop:'static', 
        scope: $scope
      });
    };

    //新增确认
    $scope.addConfirm = function () {
        if (!$scope.checkEdit($scope.addParams)) {
          return;
        }
        httpService.req("POST","/web/mdm/staticdata/staticdata",{},function (res) {
          if (res.data == 1) {
            $rootScope.addAlert("success", "操作成功");
            $scope.addModal.close();
            $scope.queryStaticdataList();
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

      $scope.editIndex = index;
      $scope.editParams = $scope.staticdataList[index];
      $scope.editModal = $modal.open({
        templateUrl: "app/staticdata/editStaticdata.html",
        backdrop:'static', 
        scope: $scope
      });
    };


    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {
        if (checkParams.tableName == null) {
          $rootScope.addAlert("error", "数据表名不能为空");
          return false;
        } 
        if (checkParams.tableName.length >50) {
            $rootScope.addAlert("error", "数据表名长度不能超过50");
            return false;
        } 
        if (checkParams.colName == null) {
          $rootScope.addAlert("error", "数据字段不能为空");
          return false;
        } 
        if (checkParams.colName.length >50) {
            $rootScope.addAlert("error", "数据字段长度不能超过50");
            return false;
          } 
        if (checkParams.colValue != null && checkParams.colValue.length >50) {
            $rootScope.addAlert("error", "字段内容长度不能超过50");
            return false;
          } 
        if (checkParams.description !=null && checkParams.description.length >300) {
            $rootScope.addAlert("error", "描述长度不能超过300");
            return false;
          } 
        return true;
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
		
		     
		      httpService.req("PUT","/web/mdm/staticdata/updateStaticdata/"+$scope.editParams.id, {}, function (res) {
		
		        if (res.data == 1) {
		
		          $rootScope.addAlert("success", "操作成功!");
		          $scope.editModal.close();
		          $scope.queryStaticdataList();
		        }
		      }, true, $scope.editParams);
    	});

    };

    //取消编辑
    $scope.cancelEdit = function () {
    	$scope.queryStaticdataList();
      $scope.editModal.close();
    };
  
    //关闭新增商品
    $scope.cancelChooseAdd = function () {
      $scope.chooseModal.close();
    };
    
    //确认删除
    $scope.doDel = function (index) {
    	$scope.delParams =$scope.staticdataList[index];
        layer.confirm('确认要删除当前商家吗？', {
    	    btn: ['确认','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
        
		      httpService.req("PUT","/web/mdm/staticdata/deleteStaticdata/"+$scope.delParams.id,{},function (res) {
	          if (res.data == 1) {
	        	 $rootScope.addAlert("success", "操作成功!");
		         $scope.queryStaticdataList();
	          }

	        }, true, $scope.delParams);
    	});
        
    };
    //分页
    $scope.currentPage = 0;
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.queryStaticdataList();//这里需要改为当前查询的请求方法
    };
		
  });
