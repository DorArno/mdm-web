angular.module('userLoginRecord', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('userLoginRecord').config(function($stateProvider) {
    $stateProvider.state('main.userLoginRecord', {
    	url: '/userLoginRecord',
        templateUrl: 'app/userLoginRecord/userLoginRecordList.html'
    });
});