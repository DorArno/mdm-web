angular.module('businessLog', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('businessLog').config(function($stateProvider) {
    $stateProvider
        .state('main.businessLog', {
          url: '/businessLog',
          templateUrl: 'app/businessLog/businessLog.html'
        })
        ;
});
