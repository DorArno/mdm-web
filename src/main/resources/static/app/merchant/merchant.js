angular.module('merchant', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('merchant').config(function($stateProvider) {
    $stateProvider
        .state('main.merchant', {
          url: '/merchant',
          templateUrl: 'app/merchant/merchant.html'
        })
        ;

});