(function() {
    'use strict';
    angular
        .module('mdm')
        .config(routeConfig);

    function routeConfig($stateProvider, $urlRouterProvider) {
        $stateProvider.state('main', {
            templateUrl: 'app/main/main.html'
        });

        // $stateProvider.state('signIn', {
        //     url: "/sign",
        //     templateUrl: 'app/user_login.html'
        // });
        // $stateProvider.state("main.safeCenter", {
        //     url: "/safe",
        //     templateUrl: "app/user_info.html"
        // });
        /* Add New States Above */
        $urlRouterProvider.otherwise('/sign');
    }

})();
