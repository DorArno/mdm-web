angular.module('refund').controller(
		'RefundCrl',
		function($scope, $modal, httpService, staticQuery,staticDataView) {

			//订单类型
			$scope.orderType = [];

			$scope.orderTypeView = [];

			//退换货类型
			$scope.refundType = [];

			//退换货订单类型
			$scope.refundOrderType = [];

			var orderQueryList = ["orderType",$scope.orderType,"refundtype",$scope.refundType];

			var orderGridView = [$scope.orderType,$scope.orderTypeView];

			//初始化参数
			$scope.initQueryParams = function (){
				staticQuery.requests(orderQueryList,function(){
                	staticDataView.request(orderGridView);
                    $scope.queryRefundInfoList();
				});

			}

            // 定义分页入参
			$scope.queryParams = {
				// 默认第一页，每页10条
				pageNum : 1,
				pageSize : 10,
			};

			// 页面初期化查询
			$scope.init = function() {
                $scope.initQueryParams();
			};

			// 查询列表信息
			$scope.queryRefundInfoList = function() {
				httpService.req("POST", "/web/order/refund/refundInfos", {}, function(result) {
					if (result && result.rows) {
                        $scope.refundList = result.rows;
						$scope.totalItems = result.rowTotal;
					}
				}, true,$scope.queryParams);
			};

			// 分页
			$scope.maxSize = 10;
			$scope.pageChanged = function(pageNo) {
				$scope.queryParams.pageNum = pageNo;
				$scope.queryRefundInfoList();// 这里需要改为当前查询的请求方法
			};

			$scope.userRefundPageChanged = function(pageNo) {
				$scope.userRefundParams.pageNum = pageNo;
				$scope.queryUserRefundList();
			};

		});
