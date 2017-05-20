
angular.module('organazation', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('organazation').config(function($stateProvider) {
    $stateProvider
        .state('main.organazation', {
          url: '/organazation/organazationInfo',
          templateUrl: 'app/organazation/organazationInfo/organazation.html'
        })
        ;
});
