/**
 * 合并用户
 */
angular.module('mergeuser', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'ngAnimate' ]);

angular.module('mergeuser').config(function($stateProvider) {
	$stateProvider.state('main.mergeuser', {
		url : '/mergeuser/systemManager',
		templateUrl : 'app/mergeuser/partial/systemManager.html'
	});
});
