angular.module('operation', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('operation').config(function($stateProvider) {
    $stateProvider
        .state('main.operation', {
          url: '/operation',
          templateUrl: 'app/operation/operation.html'
        })
        ;
});
