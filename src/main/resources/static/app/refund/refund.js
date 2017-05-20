angular.module('refund', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('refund').config(function($stateProvider) {
    $stateProvider
        .state('main.refund', {
          url: '/refundOrder',
          templateUrl: 'app/refund/refund.html'
        })
        ;
});
