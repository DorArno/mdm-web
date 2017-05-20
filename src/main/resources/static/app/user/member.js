angular.module('member', [ 'ui.bootstrap', 'ui.utils', 'ui.router',
		'angularjs-dropdown-multiselect', 'ngAnimate' ]);

angular.module('member').config(function($stateProvider) {
	$stateProvider.state('main.member', {
		url : '/user/memberInfo',
		templateUrl : 'app/user/memberInfo/memberInfo.html'
	});
});
