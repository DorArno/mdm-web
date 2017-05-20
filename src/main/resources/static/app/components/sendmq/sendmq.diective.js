(function() {
  'use strict';

  angular.module('mdm').directive('sendMq', ['$compile','$parse', '$rootScope', 'httpService', sendMq]);
    angular.module('mdm').directive('bachSendMq', ['$compile','$parse', '$rootScope', 'httpService', bachSendMq]);
  function sendMq($compile,$parse,$rootScope, httpService) {
		return {
			restrict: 'E',
	        scope : true,

			link : function(scope,elem,attr) {
				var idmodel = $parse(attr.dataid);
				var dataid = idmodel(scope);
				var datatype = attr.datatype;
				var keycode = attr.keycode;
				elem.html('<button keycode=\''+keycode+'\' title="下发" ng-click="test(\''+dataid+'\',\''+datatype +'\')" class="goodButtonCommonEdit flex" ><span class="button_icon download_btn"></span></button>');
				$rootScope.test = function(dataid, dataype) {
				     var params = {
				    		 dataIds: [dataid],
				    		 dataType: datatype
				     };
			 	   httpService.req("POST", "/web/mdm/activemq/manualsend", {}, function(result) {
					if (result.data == 1) {
						$rootScope.addAlert("success", "操作成功!");
					}
				}, true, params);
				};
				$compile(elem.contents())(scope);
			},
			replace : true
	    }
 
  };
  function bachSendMq($compile,$parse,$rootScope, httpService) {
        return {
            restrict: 'E',
            scope : true,
            require: "ngModel",
            link : function(scope,elem,attr,model) {
            	//var _scope = scope;
                //var idsmodel = $parse(attr.dataids);
                var datatype = attr.datatype;
                var keycode = attr.keycode;
                elem.html('<button class="buttonCommon complaintDetail" ng-show="'+ attr.ngModel +'.length > 1" ' +
					'ng-click="bachSendMq()"' +
					' keycode='+keycode+'> ' +
					'<div class="btn_com_icon download_btn"></div> ' +
					'批量下发 </button>');
                $rootScope.bachSendMq = function() {
                    //var dataids = idsmodel(_scope);
                    var ids = model.$modelValue
                    var params = {
                        dataIds: ids,
                        dataType: datatype
                    };
                    httpService.req("POST", "/web/mdm/activemq/manualsend", {}, function(result) {
                        if (result.data == 1) {
                            $rootScope.addAlert("success", "操作成功!");
                        }
                    }, true, params);
                };
                $compile(elem.contents())(scope);
            },
            replace : true
        }

    };
 })();