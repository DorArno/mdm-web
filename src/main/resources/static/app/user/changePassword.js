angular.module('changePassword', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'angularjs-dropdown-multiselect', 'ngAnimate' ]);

angular.module('changePassword').config(function($stateProvider) {
	$stateProvider.state('main.changePassword', {
		url : '/user/changePassword',
		templateUrl : 'app/user/changePassword/changePassword.html'
	});
});
