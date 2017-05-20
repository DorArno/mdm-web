angular.module('tree')
  .controller('treeCtl', function ($scope, $modal, httpService, $rootScope) {
    //页面初期化查询
    $scope.renderTree = function (params) {
      httpService.req('GET','/web/mdm/global/renderTree', params, function (result) {
         $scope.html = result.data;
      }, true);
    };

  }).filter('htmlContent',['$sce', function($sce) {
	return function(input) {
		return $sce.trustAsHtml(input);
	}
}]);
