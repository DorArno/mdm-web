(function() {

    angular
        .module('mdm')
        .directive('edolDatetime', edolDatetime);

    function edolDatetime($filter) {
        var directive = {
            restrict: 'E',
            templateUrl: 'app/components/datetimePicker/datetimePicker.html',
            // controller:MgrDropListCtrl,
            // bindToController: true,
            scope: {
                'initBeginNotice':'=',
                'initBeginTime': '=',
                'initEndNotice':'=',
                'initEndTime': '=',
                'onBeginTimeSet': '&',
                'onEndTimeSet': '&'
            },
            // transclude: true,
            link: function(scope) {
                if(angular.isUndefined(scope.initBeginNotice)){
                    scope.initBeginNotice = "开始时间";
                }

                if(angular.isUndefined(scope.initEndNotice)){
                    scope.initEndNotice = "结束时间";
                }

            	if(angular.isUndefined(scope.initBeginTime)){
            		scope.initBeginTime = new Date();
                    // var month = scope.initBeginTime.getMonth() + 1;
                    // if(month < 10){
                    //     month = "0" + month.toString();
                    // }
                    // var day = scope.initBeginTime.getDate()-1;
                    // if(day < 10){
                    //     day = "0" + day.toString();
                    // }
                    // var Hour = scope.initBeginTime.getHours();
                    // if(Hour < 10){
                    //     if(Hour<10){
                    //         Hour = "0" + Hour.toString();
                    //     }
                    // }
                    // var minutes = scope.initBeginTime.getMinutes();
                    // if(minutes < 10){
                    //     minutes = "0" + minutes.toString();
                    // }
                    // var second = scope.initBeginTime.getSeconds();
                    // if(second < 10){
                    //     if (second<10) {
                    //         second = "0" + second.toString();
                    //     };
                    // }


            	}

            	if(angular.isUndefined(scope.initEndTime)){
            		scope.initEndTime = new Date();
            	}

                console.log("neibu");
                console.log(scope.initBeginTime);
                console.log(scope.initEndTime);

            	// scope.beginTime = $filter('date')(scope.initBeginTime, 'yyyy-MM-dd HH:mm:ss');
                // scope.beginTime = scope.initBeginTime.getFullYear() + "-" + month + "-" + day + " "+Hour+":" +minutes + ":"+second;
                // console.log(scope.beginTime + "``````````");
                scope.beginTime =  $filter('date')(scope.initBeginTime, 'yyyy-MM-dd HH:mm:ss');
            	scope.endTime = $filter('date')(scope.initEndTime, 'yyyy-MM-dd HH:mm:ss');


                scope.onTimeSetBegin = function(newDate, oldDate) {
                    // console.log(newDate);
                    // console.log(oldDate);
                    console.log($filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss'));
                    scope.beginTime = $filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss');

                    scope.onBeginTimeSet({
                    	beginTime:scope.beginTime
                    });

                };
                scope.onTimeSetEnd = function(newDate, oldDate) {
                    // console.log(newDate);
                    // console.log(oldDate);
                    console.log($filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss'));
                    scope.endTime = $filter('date')(newDate, 'yyyy-MM-dd HH:mm:ss');
                    scope.onEndTimeSet({
                    	endTime:scope.endTime
                    });
                }

            }
        };
        return directive;
    }
})();
