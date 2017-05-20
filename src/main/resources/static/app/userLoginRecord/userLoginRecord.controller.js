angular.module('userLoginRecord')
  .controller('userLoginRecordCrl', function ($scope, $modal, httpService, $rootScope) {

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };

    //页面初期化查询
    $scope.init = function () {
      $scope.queryUserLoginRecordList();
    };
    
    //查询系统信息
    $scope.queryUserLoginRecordList = function () {
      httpService.req("POST","/web/mdm/userLoginRecord/userLoginRecordList", {}, function (result) {
        if (result && result.data) {
          $scope.userLoginRecordList = result.data.list;
        	$scope.totalItems = result.data.totalCount;
        }
      }, true,$scope.queryParams);
    };

    //分页
    $scope.maxSize = 10;
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.queryUserLoginRecordList();
    };
  });