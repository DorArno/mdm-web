angular.module('operationLog', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('operationLog').config(function($stateProvider) {
    $stateProvider
        .state('main.operationLog', {
          url: '/operationLog',
          templateUrl: 'app/operationLog/operationLog.html'
        })
        ;
});
