/**
 * Created by HUYU006 on 2017-02-17.
 */
(function() {
    'use strict';
    angular.module('mdm').directive('jsonView', ['$compile','$parse', '$rootScope', 'httpService', jsonView]);
    function jsonView($compile,$parse,$rootScope, httpService) {
        return {
            restrict: 'E',
            scope : true,
            require: "ngModel",
            link : function(scope,elem,attr,model) {
                //var json = model.$modelValue;
                //var jsonViewer = $('<div/>')
                //jsonViewer.JSONView(JSON.parse(json), { collapsed: true });
                //elem.append(jsonViewer);
                //$compile(elem.contents())(scope);

                elem.height(elem.parent().height).css({"overflow-y":"auto","padding":"5px","width":"100%"});

                /*方案一*/
                model.$render = function(){
                    //Do something with your model
                    var json = model.$modelValue;
                    var jsonViewer = $('<div/>')
                    jsonViewer.JSONView(JSON.parse(json), { collapsed: true });
                    elem.append(jsonViewer);
                }

                /*方案二*/
                /*var unregister = scope.$watch(function(){
                    return model.$modelValue;
                }, initialize);

                function initialize(value){
                    var json = model.$modelValue;
                    var jsonViewer = $('<div/>')
                    jsonViewer.JSONView(JSON.parse(json), { collapsed: true });
                    elem.append(jsonViewer);
                    unregister();
                }*/
            },
            replace : true
        }

    };
})();