angular.module('module', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('module').config(function($stateProvider) {
    $stateProvider
        .state('main.module', {
          url: '/module',
          templateUrl: 'app/module/module.html'
        })
        ;
});
