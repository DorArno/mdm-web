angular.module('mdm').factory('staticDataView', function ($http, $rootScope) {

    var staticDataView = {};

    staticDataView.request = function () {
        $rootScope.clearAlert();  //发送请求前，清除原有的提示信息
        var param = arguments[0];
        for(var k = 0; k < param.length; k+=2){
            setViewValue(param[k],param[k+1]);
        }
    };

    function setViewValue(staticData,staticView){
        for (var i = 0; i  < staticData.length; i++) {
            staticView[staticData[i].value] = staticData[i].title;
        }
    }

    return staticDataView;
});
