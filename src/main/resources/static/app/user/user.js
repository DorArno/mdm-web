angular.module('user', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'angularjs-dropdown-multiselect', 'ngAnimate' ]);

angular.module('user').config(function($stateProvider) {
	$stateProvider.state('main.user', {
		url : '/user/userInfo',
		templateUrl : 'app/user/userInfo/userInfo.html'
	});
});
