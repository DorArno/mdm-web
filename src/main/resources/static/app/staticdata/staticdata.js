angular.module('staticdata', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('staticdata').config(function($stateProvider) {
    $stateProvider
        .state('main.staticdata', {
          url: '/staticdata',
          templateUrl: 'app/staticdata/staticdata.html'
        })
        ;

});