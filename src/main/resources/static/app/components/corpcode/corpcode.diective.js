(function() {
  'use strict';

  angular.module('mdm').directive('corpCode', ['$compile','$parse', '$modal', '$rootScope', 'httpService', corpCode]);
  
  function corpCode($compile,$parse,$rootScope,  $modal, httpService,ngModelCtrl) {
		return {
			restrict: 'AE',
			require: "^ngModel",
	        scope : true,
	        templateUrl: "app/components/corpcode/corpcode.html",
			link : function(scope,elem,attr,ngModel) {
				scope.inputChanged = function (changeData) {
                    ngModel.$setViewValue(changeData);
                };
				var watch = scope.$watch('corpcode',function(newValue,oldValue, scope){
					if(newValue != null && newValue.originalObject != null){
						 ngModel.$setViewValue(newValue.originalObject.code);
					}else{
						if(oldValue != null){
							ngModel.$setViewValue(null);
						}
					}
					if(oldValue == null){
						scope.initValue = ngModel.$modelValue;
					}
			    });
        		httpService.req("GET", "/web/mdm/tenement", null,
						function(result) {
        		           scope.autoList = result.data; 
						}, true);
			},
			replace : false
	    }

 }
})();