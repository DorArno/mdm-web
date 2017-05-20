(function() {
    'use strict';
    angular
        .module('mdm')
        .run(runBlock);

    function runBlock($rootScope) {
        console.log("run ....");
        $rootScope.safeApply = function(fn) {
            var phase = $rootScope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };
        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
            console.log(fromState);
            console.log(toState);
        });
    }

})();
