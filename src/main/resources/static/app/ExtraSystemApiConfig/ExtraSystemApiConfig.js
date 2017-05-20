/**
 * 调度任务管理 20160930
 */
angular.module('ExtraSystemApiConfig', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'ngAnimate' ]);

angular.module('ExtraSystemApiConfig').config(function($stateProvider) {
	$stateProvider.state('main.ExtraSystemApiConfig', {
		url : '/ExtraSystemApiConfig/systemManager',
		templateUrl : 'app/ExtraSystemApiConfig/partial/systemManager.html'
	});
});

