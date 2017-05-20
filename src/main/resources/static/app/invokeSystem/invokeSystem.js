/**
 * created by gaod003 on 2016/09/23
 */

angular.module('invokeSystem', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('invokeSystem').config(function($stateProvider) {
    $stateProvider
        .state('main.invokeSystem', {
          url: '/invokeSystem/systemInfo',
          templateUrl: 'app/invokeSystem/partial/systemInfo/systemInfo.html'
        })
        ;
    $stateProvider
    .state('main.serviceInfo', {
      url: '/invokeSystem/serviceInfo',
      templateUrl: 'app/invokeSystem/partial/serviceInfo/serviceInfo.html'
    })
    ;
});
