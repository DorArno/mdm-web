/**
 * 定时任务平台。
 */
angular.module('quartzManager')
  .controller('quartzManagerController', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
    	pageNum: 1,
    	pageSize: 10,
    };

    //临时保存单选变量
    var str=[];
    
    //保存多选变量
    $scope.choseArr = [];
    
    //是否点击了全选，是为a
    var flag='';
    
    //默认未选中
    $scope.x=false;
    
    $scope.cronJobInfo = {};
    $scope.cronJobInfo.argsNames = [];
    $scope.cronJobInfo.argsValues = [];
     
    //全选
    $scope.all= function (c,v) {
        if(c==true){
            $scope.x=true;
            for(var l = 0;l<v.length;l++)
            $scope.choseArr.push(v[l].triggers[0]);
           
        }else{
            $scope.x=false;
            $scope.choseArr=[];
        }
        flag='a';
     
    };
    
    //单选或者多选
    $scope.chk= function (z,x) {
    	//在全选的基础上操作
        if(flag=='a') {
            str = $scope.choseArr;
        }
        //选中
        if (x == true) {
            str.push(z.triggers[0]);
        } else {
        	var index = str.indexOf(z.triggers[0]);
        	str.splice(index,1);
        }
        $scope.choseArr= str;
    };
    
    
    var z = 0;
    
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
    
    //打开增加表达式页面
    $scope.addCronExpress = function (){
        $scope.addCronModal = $modal.open({
            templateUrl: "app/quartzManager/partial/cron/index.htm",
            backdrop:'static',
            scope: $scope

          });
        $scope.openCronExpress = "* * * * * ?";
    }
    
    //关闭新增表达式页面
    $scope.closeAddCronExpression = function(){
    	 $scope.addCronModal.close();
    }
    
    //新增表达式确认提交页面
    $scope.sumbitAddCronExpression = function(){
    	var tempExpressions = $("#cron").val();
    	tempExpressions = tempExpressions.trim();
    	var boolean = tempExpressions.indexOf("?")!=-1 ? tempExpressions.indexOf("?")==tempExpressions.lastIndexOf("?")? true : false : false;
    	if(!cronValidate(tempExpressions) || !boolean){
    		$rootScope.addAlert("error", "不正确的CRON表达式");
    		return;
    	}
    	$scope.cronJobInfo.cronExpression = $("#cron").val();
    	$scope.addCronModal.close();
    }
    
    
    //查询任务信息
    $scope.queryInfoList = function () {
    	$scope.queryParams.pageNum = 1;
    	$scope.currentPage = 1;
    	httpService.req("GET","/web/mdm/quartzManager/taskInfos", $scope.queryParams, function (result) {
        var data = result.data;
        if (data != null) {
          $scope.systemInfoList = data.list;
        }
        $scope.totalItems = data.totalCount;
      }, true);
    };
    
    //查询任务信息
    $scope.querySystemInfoList = function () {
    	httpService.req("GET","/web/mdm/quartzManager/taskInfos", $scope.queryParams, function (result) {
    		var data = result.data;
    		if (data != null) {
    			$scope.systemInfoList = data.list;
    		}
    		$scope.totalItems = data.totalCount;
      }, true);
    };
    
    //暂停所有任务
    $scope.pauseAllTask = function(){
    	if($scope.choseArr==''){
    		$rootScope.addAlert("error", "请选择需要停止的任务");
    		return; 
    	}
    	if(confirm('确认暂停选择任务吗?')){
    	    httpService.req("POST","/web/mdm/quartzManager/pauseAllTaskInfos",{},function (data) {
    	    	if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	    	}
    	    	$scope.master = false;
    	    	$scope.choseArr.length = 0;
    	   }, true, $scope.choseArr);
    	}
    }
    
    //恢复所有任务
    $scope.resumeAllTask = function(){
    	if($scope.choseArr==''){
    		$rootScope.addAlert("error", "请选择需要恢复的任务");
    		return; 
    	}
    	if(confirm('确认恢复选择任务吗?')){
    	    httpService.req("POST","/web/mdm/quartzManager/resumeAllTaskInfos",{},function (data) {
    	    	if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	    	}
    	    	$scope.master	= false;
    	    	$scope.choseArr.length = 0;
    	   }, true, $scope.choseArr);
    	}
    }    
    
    //暂停任务
    $scope.pauseTask = function(index){
    	$scope.cronJobInfo = {};
    	if(confirm('确认暂停任务吗?')){
    		$scope.cronJobInfo.jobName = $scope.systemInfoList[index].triggers[0].jobName;
    		$scope.cronJobInfo.jobGroup = $scope.systemInfoList[index].triggers[0].group;
    	    httpService.req("POST","/web/mdm/quartzManager/pauseTaskInfos",{},function (data) {
    	    	if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	    	}
    	   }, true, $scope.cronJobInfo);
    	}
    }
    
    //执行任务
    $scope.executeTask = function(index){
    	$scope.cronJobInfo = {};
    	if(confirm('确认现在执行任务吗?')){
    		$scope.cronJobInfo.jobName = $scope.systemInfoList[index].triggers[0].jobName;
    		$scope.cronJobInfo.jobGroup = $scope.systemInfoList[index].triggers[0].group;
    	    httpService.req("POST","/web/mdm/quartzManager/executeTaskInfos",{},function (data) {
    	    	if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	    	}
    	   }, true, $scope.cronJobInfo);
    	}
    }
    
    //删除任务
    $scope.deleteTask = function(index){
    	$scope.cronJobInfo = {};
    	if(confirm('确认删除吗?')){
    		$scope.cronJobInfo.jobName = $scope.systemInfoList[index].triggers[0].jobName;
    		$scope.cronJobInfo.jobGroup = $scope.systemInfoList[index].triggers[0].group;
    	    httpService.req("POST","/web/mdm/quartzManager/deleteTaskInfos",{},function (data) {
    	     if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	      }
    	   }, true, $scope.cronJobInfo);
    	}
    }
    
    //恢复任务
    $scope.resumeTask = function(index){
     	$scope.cronJobInfo = {};
    	if(confirm('确认恢复任务吗?')){
    		$scope.cronJobInfo.jobName = $scope.systemInfoList[index].triggers[0].jobName;
    		$scope.cronJobInfo.jobGroup = $scope.systemInfoList[index].triggers[0].group;
    	    httpService.req("POST","/web/mdm/quartzManager/resumeTaskInfos",{},function (data) {
    	    	if (data.data == 1) {
    	            $rootScope.addAlert("success", "操作成功");
    	            $scope.querySystemInfoList();
    	    	}
    	   }, true, $scope.cronJobInfo);
    	}
    }

  
    
    //打开新增任务页面
    $scope.addTaskInfo = function () {
    	 $scope.cronJobInfo = {};
    	 $scope.methodList = [];
    	 var post = {};
    	 var get = {};
    	 post.value = 'post';
    	 post.title = 'POST';
    	 get.value = 'get';
    	 get.title = 'GET';
    	 $scope.methodList.push(post);
    	 $scope.methodList.push(get);
    	 $scope.cronJobInfo.url="http://"
    	 $scope.cronJobInfo.argsNames = [];
    	 $scope.cronJobInfo.argsValues = [];
    	 $scope.list = [];
    	 $scope.addModal = $modal.open({
    		 templateUrl: "app/quartzManager/partial/addTaskInfo.html",
    		 backdrop:'static',
    		 scope: $scope
    	 });
    };
    
    $scope.list = [];
    
    //增加参数按钮动作
    $scope.addList = function(){
    	 var obj = new Object();
    	 $scope.list.push(obj);
    }
    
    //删除参数按钮动作
    $scope.delList = function(){
    	 $scope.list.splice($scope.list.length - 1 ,1);
    	 if($scope.list.length+1==$scope.cronJobInfo.argsNames.length){
    		$scope.cronJobInfo.argsNames.splice($scope.cronJobInfo.argsNames.length - 1,1);
		 	$scope.cronJobInfo.argsValues.splice($scope.cronJobInfo.argsValues.length - 1,1);
    	 }
    }
    
    //新增任务功能按钮动作
    $scope.addTask = function(){
    	 if (!$scope.checkEditValidate($scope.cronJobInfo)) {
    	        return;
    	 }
    	 httpService.req("POST","/web/mdm/quartzManager/addTaskInfos",{},function (data) {
    		 if (data.data == 1) {
    			 $scope.addModal.close();
    			 $rootScope.addAlert("success", "操作成功");
    			 $scope.querySystemInfoList();
    		 }
          }, true, $scope.cronJobInfo);
    }
    
    //编辑任务确认功能按钮动作
    $scope.editTask = function(){
   	 	if (!$scope.checkEditValidate($scope.cronJobInfo)) {
	        return;
   	 	}
    	httpService.req("POST","/web/mdm/quartzManager/editTaskInfos",{},function (data) {
            if (data.data == 1) {
            	$scope.editModal.close();
            	$rootScope.addAlert("success", "操作成功");
            	$scope.querySystemInfoList();
            }
        }, true, $scope.cronJobInfo);
    }

    //新增确认
    $scope.addConfirm = function () {
      if (!$scope.checkEdit($scope.addParams)) {
        return;
      }
      $scope.addParams.userId=localStorage.getItem("userName");//将登录名一起放到请求body中
      
      httpService.req("POST","/web/mdm/invokeSystem/systemInfos",{},function (data) {
    	  if (data == 1) {
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

   
    $scope.editParams = {};
    
    $scope.clones = function(o){
    	  var k, ret= o, b;
    	    if(o && ((b = (o instanceof Array)) || o instanceof Object)) {
    	        ret = b ? [] : {};
    	        for(k in o){
    	            if(o.hasOwnProperty(k)){
    	                ret[k] =  $scope.clones(o[k]);
    	            }
    	        }
    	    }
    	return ret;
    };
    
    //打开编辑界面
    $scope.editTaskInfo = function (index) {
      $scope.list = [];
      $scope.editIndex = index;
      $scope.cronJobInfo = {};
      $scope.cronJobInfo.jobName = $scope.systemInfoList[index].triggers[0].jobName;
      $scope.cronJobInfo.jobGroup = $scope.systemInfoList[index].triggers[0].jobGroup;
      $scope.methodList = [];
 	  var post = {};
 	  post.value = 'post';
 	  post.title = 'POST';
 	  var get = {};
 	  get.value = 'get';
 	  get.title = 'GET';
 	  $scope.methodList.push(post);
 	  $scope.methodList.push(get);
      var cronExpression = $scope.systemInfoList[index].triggers[0].cronExpression;
      cronExpression = cronExpression.trim();
      $scope.cronJobInfo.cronExpression = cronExpression;
      $scope.cronJobInfo.method = $scope.systemInfoList[index].jobDetail.jobDataMap.method;
      $scope.cronJobInfo.url = $scope.systemInfoList[index].jobDetail.jobDataMap.url;
      var tmplist = $scope.clones( $scope.systemInfoList[index].jobDetail.jobDataMap);
      delete tmplist["method"];
      delete tmplist["url"];
      z = 0;
      $scope.cronJobInfo.argsNames = [];
      $scope.cronJobInfo.argsValues = [];
      $scope.list = [];
      for(key in tmplist){
    	 $scope.cronJobInfo.argsNames[z] = key;
    	 $scope.cronJobInfo.argsValues[z] = tmplist[key];
    	 z++;
    	 $scope.list.push(z);
      }
      $scope.editModal = $modal.open({
        templateUrl: "app/quartzManager/partial/editTaskInfo.html",
        backdrop:'static',
        scope: $scope
      });
    };

    //校验新增&编辑参数
    $scope.checkEditValidate = function (cronJobInfo) {
      if (cronJobInfo.jobName == null || cronJobInfo.jobName.trim()=='') {
        $rootScope.addAlert("error", "任务名称不能为空");
        return false;
      } else if (cronJobInfo.jobGroup == null ||cronJobInfo.jobGroup.trim() == '') {
        $rootScope.addAlert("error", "任务组不能为空");
        return false;
      } else if (cronJobInfo.cronExpression == null || cronJobInfo.cronExpression.trim() == '') {
          $rootScope.addAlert("error", "CRON表达式不能为空");
          return false;
      } else if (cronJobInfo.method == null || cronJobInfo.method.trim() == '' ){
    	  $rootScope.addAlert("error","调度方法不能为空");
    	  return false;
      } else if (cronJobInfo.url == null || cronJobInfo.url.trim() == ''){
    	  $rootScope.addAlert("error","调度url不能为空");
    	  return false;
      }
      return true;
    };
    
    $scope.validateCron = function(cronJobInfo){
    	if(!isNaN(cronJobInfo.monthField.trim())){
    		if(cronJobInfo.weekField.trim()!='?'){
    			return true;
    		}
    	}
    	if(!isNaN(cronJobInfo.weekField.trim())){
    		if(cronJobInfo.monthField.trim()!='?'){
    			return true;
    		}
    	}
    	
    	return false;
    }
    
    
    $scope.cronExpre = function(cronJobInfo){
    	
    	var cron = cronJobInfo.secondField.trim() + " " +cronJobInfo.minutesField.trim() + " " +
    		cronJobInfo.hourField.trim() + " " +cronJobInfo.dayField.trim() + " " +cronJobInfo.monthField.trim() + " " + cronJobInfo.weekField.trim();
    	return cron;
    }

    //确认编辑
    $scope.editConfirm = function () {

      if (!$scope.checkEdit($scope.editParams)) {
        return;
      }

      $scope.editParams.userId=localStorage.getItem("userName");
      httpService.req("PUT","/web/mdm/invokeSystem/systemInfos/"+$scope.editParams.id, {}, function (data) {

        if (data == 1) {

          $rootScope.addAlert("success", "操作成功!");
          $scope.editModal.close();
          $scope.querySystemInfoList();
        }
      }, true, $scope.editParams);

    };

    //取消编辑
    $scope.cancelEdit = function () {
      $scope.editModal.close();
    };

    //分页
    $scope.currentPage = 0;
    $scope.maxSize = 10;
    $scope.setPage = function (pageNo) {
    $scope.currentPage = pageNo;
    };
      $scope.pageChanged = function () {
      $scope.master	= false;
      $scope.queryParams.pageNum = $scope.currentPage;
      $scope.querySystemInfoList();//这里需要改为当前查询的请求方法
    };

  });
