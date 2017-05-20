//(function () {
//  'use strict';

  angular.module('account', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

  angular.module('account').config(function ($stateProvider) {

    $stateProvider.state('signIn', {
      url: "/sign",
      templateUrl: 'app/account/signIn/signIn.html'
    });
    
    $stateProvider.state('main.index', {
        url: '/index',
        templateUrl: 'app/main/index.html'
      });

  });

//});
