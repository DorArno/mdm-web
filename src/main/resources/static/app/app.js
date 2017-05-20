angular.module("mdm")
    .filter('cut',function(){
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
            if(tail && tail != ''){
                return value + tail;
            }else
                return value;
        };
    })
  .controller("AppCtrl", ["$rootScope","$scope","$window", function($rootScope,$scope,$window) {
    console.log("AppCtrl...");
    // $rootScope.alerts = [];
    $rootScope.addAlert = function(alert_type,alert_msg) {
      Messenger(
        {
          extraClasses: 'messenger-fixed messenger-on-right messenger-on-top er-messenger-anime',
          theme: 'flat',
        }
      ).post({
        message: alert_msg,
        type: alert_type,
        hideAfter: 3.5,
        showCloseButton: true
      });

    };

    $rootScope.closeAlert = function(index) {
        $rootScope.alerts.splice(index, 1);
    };
    $rootScope.clearAlert = function() {
        $rootScope.alerts = [];
    };

    $rootScope.jsonToUrlParam = function(param) {
      var urlParam = "";
      for (var option in param) {
        if (param[option] == null) {
          continue;
        }

        if (urlParam != "") {
          urlParam += "&";
        }

        urlParam += option;
        urlParam += "=";
        urlParam += param[option];
      }

      return urlParam;
    };

}])
  .directive('show',function(){
    var link = function($scope,$element,$attrs){
      // 权限直接在返回的权限里面
      var actionList = localStorage.getItem("auth_action").split(",");

      if(actionList != null && actionList.length > 0){
        for(var i = 0 ; i < actionList.length ; i ++) {
          if (actionList[i] == $attrs.show) {
            $element.css("display","inline-block");
            break;
          }
          if (actionList[i] != $attrs.show){
              if($attrs.show.indexOf(actionList[i]) >= 0) {
                $element.css("display","inline-block");
                break;
              }
                if($attrs.show.indexOf(actionList[i]) < 0) {
                  $element.css("display","none");
                }
            }
        }
      }
    }
    return {
      link:link,restrict:"A"
    };
  })
  
  angular.module("mdm").factory('myInterceptor', function($rootScope,$filter){
    return {
        request: function(config){
        	
//        	var authObj = {};
//        	var timeStamp = $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss');
//        	authObj.timeStamp = timeStamp;
//        	authObj.sysCode = "MDM";
//        	alert(config.url);
//        	httpService.req("POST","/web/mdm/invokeSystem/systemInfo/code"+"?timeStamp="+timeStamp, {}, function (result) {
//        		alert(result.data);
//    	    	authObj.sign = result.data;
//
// 		        }, true, config["data"]);
//        	
////        	 $http({
////        	      method: "POST",
////        	      url: "/web/mdm/invokeSystem/systemInfo/code"+"?timeStamp="+timeStamp,
////        	      params: {},
////        	      data: config["data"],
////        	      timeout: 20000
////        	    }).success(function (result) {
////        	    	alert(result.data);
////        	    	authObj.sign = result.data;
////        	      });
//        	
//            config.headers = config.headers || {};
//            config.headers.authentication = JSON.stringify(authObj);
            return config;
        },
        responseError: function(response){
        	//debugger;
            // ...
        },
        response: function(response) {
        	if(response!=null && response.data!=null)
        	if(response!=undefined && response.data!=undefined)
        	if(response.data.toString().indexOf("/sso/css")>=0){
        		window.location.href="/web/test.html";
        		return null;
        	}
        	//debugger;
            return response;
        }
        , requestError: function(rejectReason) {
        	//debugger;
        }
    };
  })
  
    angular.module("mdm").config(['$httpProvider', function($httpProvider) {
        $httpProvider.interceptors.push('myInterceptor');
    }]);
  
  
// 角色等级
angular.module("mdm").directive('roleLevel',function($rootScope, httpService) {
	return {
		scope : true,
		template : function(elem,attr) {
			return '<select class="select flex-2 flex-w" ng-model="'+attr.model+'"></select>';
		},
		replace : true,
        link : function(scope,elem,attr) {
        	httpService.req("GET","/web/mdm/role/queryRoleLevel", {tableName:attr.table}, function (result) {
    			var html = [];
    			html.push('<option value="">请选择</option>');
    			if (result && result.data) {
    				for(var i = 0 , len = result.data.length ; i < len ; i++) {
    					html.push('<option value="');
    					html.push(result.data[i].colValue);
    					html.push('"');
    					if (attr.value == result.data[i].colValue) {
    						html.push(' selected');
    					}
    					html.push('>');
    					html.push(attr.same === 'true' ? result.data[i].colValue : result.data[i].colName);
    					html.push('</option>');
    				}
    			}
    			elem.html(html.join(''));
  			}, true);
        }
    };
});

// 获取静态数据指令
angular.module("mdm").directive('staticData',function($rootScope, httpService) {
	return {
		scope : true,
		template : function(elem,attr) {
			return '<select class="select flex-2 flex-w" ng-model="'+attr.model+'"></select>';
		},
		replace : true,
        link : function(scope,elem,attr) {
        	httpService.req("GET","/web/mdm/staticdata", {tableName:attr.table}, function (result) {
    			var html = [];
    			html.push('<option value="">'+(attr.empty==undefined ? '请选择' : attr.empty)+'</option>');
    			if (result && result.data) {
    				for(var i = 0 , len = result.data.length ; i < len ; i++) {
    					html.push('<option value="');
    					html.push(result.data[i].colValue);
    					html.push('"');
    					if (attr.value == result.data[i].colValue) {
    						html.push(' selected');
    					}
    					html.push('>');
    					html.push(attr.same === 'true' ? result.data[i].colValue : result.data[i].colName);
    					html.push('</option>');
    				}
    			}
    			elem.html(html.join(''));
  			}, true);
        }
    };
});

// 权限控制指令
angular.module('mdm').directive("repeatFinish", repeatFinish);
angular.module('mdm').directive("opCtrl", setOp);
// 树形控件指令
angular.module('mdm').directive("tree", ['$compile','$parse',renderTree]);
// 查看主数据历史版本指令
angular.module('mdm').directive("viewHistory", ['$compile','$parse',viewHistory]);


var returnData = '';
// 查询用户权限
function queryUserOperation(httpService,callback) {
	
	if(returnData == ''){
		httpService.req("GET","/web/mdm/global/userOperation", {}, function(result) {
			if (result.data) {
				returnData = result.data;
				// all表示当前用户具有超级管理员权限
				if (result.data === 'all') {
					return;
				}
				callback(result.data)
			}
		}, true);
	}else{
		if (returnData === 'all') {
			return;
		}
		callback(returnData);
	}
}

function setPermission(httpService) {
	queryUserOperation(httpService,function (result) {
		var buttons = $('button[keycode]');
		for(var i = 0;i<buttons.length;i++) {
			var flag = false;
			for(var j = 0 ;j < result.length ; j++) {
				if ($(buttons[i]).attr('keycode') == result[j].keyCode) {
					flag = true;
					break;
				}
			}
			if (!flag) {
				$(buttons[i]).hide();	        						
			} 
		}
	});
}

function repeatFinish($rootScope, httpService) {
	return {
        link: function(scope,element,attr){
            if(scope.$last){
            	setPermission(httpService);
            }
        }
    }
}
	
function setOp($rootScope, httpService) {
	return {
        link : function(scope,elem,attr) {
        	setPermission(httpService);
        }
    };
}

function renderTree($compile,$parse) {
	return {
		restrict: 'E',
        scope : true,
		link : function(scope,elem,attr) {
			var obj = {};
			var attrs = elem.get(0).attributes;
			for(var i = 0 , len = attrs.length; i < len ; i++) {
				if (attrs[i].name == 'parameter') {
					var model = $parse(attrs[i].value);
					obj[attrs[i].name] = model(scope);			
				} else {
					obj[attrs[i].name] = attrs[i].value;
				}
			}
			elem.html("<div ng-controller='treeCtl' ng-init='renderTree("+JSON.stringify(obj)+")' ng-bind-html='html|htmlContent'></div>");
			$compile(elem.contents())(scope);
		},
		replace : true
    }
}

function viewHistory($compile,$parse) {
	return {
		restrict: 'E',
        scope : true,
		link : function(scope,elem,attr) {
		var idModel = $parse(attr.id);
			var id = idModel(scope);
			var dataType = '-1';
			var title ="历史记录";
			if(attr.datatype != undefined) {
				dataType = attr.datatype;
				if(dataType==6)title="恢复组织角色关系历史";
				if(dataType==1)title="恢复用户基本信息历史";
			}
			elem.html('<button title='+title+' ng-controller="OperationLogCrl" keycode="'+attr.keycode+'" class="goodButtonCommonEdit flex" ng-click="viewHistory(\''+id+'\', \''+dataType+'\', \''+attr.callback+'\')"><span class="button_icon history_btn"></span></button>');
			$compile(elem.contents())(scope);
		},
		replace : true
    }
}
