  angular.module('tree', ['ui.bootstrap', 'ui.utils', 'ui.router', 'ngAnimate']);

  angular.module('tree').config(function ($stateProvider) {

    $stateProvider.state('tree', {
      url: "/tree",
      templateUrl: 'app/tree/treeDemo.html'
    });

  });