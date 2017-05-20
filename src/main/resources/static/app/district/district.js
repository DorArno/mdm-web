/**
 * created by gaod003 on 2016/09/23
 */

angular.module('district', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

angular.module('district').config(function($stateProvider) {
    $stateProvider
        .state('main.district', {
          url: '/district/districtInfo',
          templateUrl: 'app/district/partial/district/districtInfo.html'
        })
        ;
});
