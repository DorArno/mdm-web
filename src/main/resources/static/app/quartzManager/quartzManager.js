
/**
 * 调度任务管理 20160930
 */
angular.module('quartzManager', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'ngAnimate' ]);

angular.module('quartzManager').config(function($stateProvider) {
	$stateProvider.state('main.quartzManager', {
		url : '/quartzManager/systemManager',
		templateUrl : 'app/quartzManager/partial/systemManager.html'
	});
});

