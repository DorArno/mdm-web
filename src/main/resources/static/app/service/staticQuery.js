angular.module('mdm').factory('staticQuery', function ($http, $rootScope, httpService) {

    var staticQuery = {};

    staticQuery.requests = function () {
        $rootScope.clearAlert();  //发送请求前，清除原有的提示信息
        var param = arguments[0];
        var callback = arguments[1];
        for (var i = 0; i  < param.length; i+=2) {
            i + 2 >= param.length ? setData(param[i],param[i+1],callback) : setData(param[i],param[i+1],null);
        }

    };

    function setData(name,value,callback){
        httpService.req("GET", "/web/mdm/staticdata", {tableName:name},
            function(result) {
                var staticdata = result.data;
                var typeList = new Array();
                $(staticdata).each(function(i,e){
                    var typeData = {};
                    typeData.title=staticdata[i].colName;
                    typeData.value=staticdata[i].colValue;
                    value.push(typeData);
                });
                if(typeof(callback) == 'function'){
                    callback(result);
                }
            }, true);
    }
    return staticQuery;
});
