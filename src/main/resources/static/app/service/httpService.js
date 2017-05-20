angular.module('mdm').factory('httpService', function ($http, $rootScope, $state,$filter) {

  var httpService = {};
  
  //后台返回结果有三类：1、直接返回字符串 2、resCode不等于200和错误提示信息，将null作为回调的参数 2、resCode等于200，和数据；数据作为回调的参数
  //通常情况下，回调函数应该只在参数不为null时才执行
  // 如果传输的数据比较大，建议放到body里面（postData）
  
  httpService.req = function (method,url, inputs, callback, isFullResult, postData) {
    
	$rootScope.clearAlert();  //发送请求前，清除原有的提示信息
    console.log(url);
    
    var timeStamp = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
    var authObj = {};//header授权对象信息
	authObj.timeStamp = timeStamp;
	authObj.sysCode = "MDM";
	
//    if(url.indexOf("/web/mdm/module") ==-1 && url.indexOf("/web/mdm/invokeSystem") ==-1 && url.indexOf("/web/mdm/global") == -1
//    		&& url.indexOf("/web/mdm/invokeSystem/systemInfos") ==-1
//    		&& url.indexOf("/web/mdm/staticdata") == -1 && url.indexOf("/web/mdm/tree") ==-1 && url.indexOf("/web/mdm/loginCheck") ==-1 ){//非这些API场合从后端获取授权sign
//    
//		$http({
//		      method: "POST",
//		      url: "/web/mdm/invokeSystem/systemInfo/code"+"?timeStamp="+timeStamp,
//		      params: {},
//		      data: JSON.stringify(postData),
//		      timeout: 20000
//		    }).success(function (result) {//获取系统授权sign
//		    	authObj.sign =result.data;
//		    	doHttp(method,url, inputs, callback, isFullResult, postData,authObj);
//		   })
//		   .error(function (data, status, headers, config) {
//			   $rootScope.addAlert("error","获取系统授权错误！");
//	         });
//    } else {
//    	doHttp(method,url, inputs, callback, isFullResult, postData,authObj);
//    }
//	
	doHttp(method,url, inputs, callback, isFullResult, postData,authObj);
  };
  
  function doHttp(method,url, inputs, callback, isFullResult, postData,authObj){
	// 发起实际http请求
	  var timeStamp = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
      $http({
          method: method,
          url: url+"?timeStamp="+timeStamp,
          params: inputs,
          data: JSON.stringify(postData),
          headers: {'authentication':JSON.stringify(authObj)},
          timeout: 20000
        })
          .success(function (result) {
             if (result.resCode != 200) {
              if (result.resCode == 302) {
              	window.location = '/web/mdm/#/sign';
              	return;
              }
              // console.log(result.msg);
              if (result.resMsg == "服务器错误") {
                $rootScope.addAlert("error","服务器错误！");
              } else {
                if (angular.isUndefined(result.resMsg)) {
                  console.log("无数据返回")
                } else {
                  $rootScope.addAlert("error",result.resMsg,2000);
                }
              }
              callback(null);
            } else {
              if (isFullResult) {
                callback(result);
              } else {
                callback(result.data);
              }
            }
          })
          .error(function (data, status, headers, config) {
              for (var i = 0; i < localStorage.length; i++) {
                localStorage.removeItem(localStorage.key(i));
                i = -1;
              }
          });
	}

  return httpService;
});
