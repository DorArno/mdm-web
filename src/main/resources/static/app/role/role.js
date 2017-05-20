angular.module('role', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('role').config(function($stateProvider) {
    $stateProvider
        .state('main.role', {
          url: '/role',
          templateUrl: 'app/role/role.html'
        })
        ;
});
