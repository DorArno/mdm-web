/**
 * created by yang044 on 2016/10/24
 */
(function() {
	'use strict';

	angular.module('mdm').directive(
			'importExcel',
			[ '$rootScope', 'httpService', '$modal', '$compile', '$parse', '$upload', '$http', importExcel ]);
	
	angular.module('mdm').directive(
			'exportExcel',
			[ '$rootScope', 'httpService', '$modal', '$compile', '$parse', '$httpParamSerializerJQLike', exportExcel ]);
	
	function exportExcel($rootScope, httpService, $modal, $compile, $parse, $httpParamSerializerJQLike) {
		var directive = {
				require: "ngModel",
				scope : true,
				restrict : 'E',
				link : linkFun,
				replace : true
			};
		return directive;
		
		function exportCtrl($scope, ngModel) {
			
			$scope.exportData = function(exportUrl) {
				var queryParams = ngModel.$modelValue;
				if(queryParams.pageNum) {
					queryParams.pageNum = 0;
				}
				if(queryParams.pageSize) {
					queryParams.pageSize = 0;
				}
				var queryString = $httpParamSerializerJQLike(queryParams);
				//window.open(exportUrl + "?" + queryString, "_blank");
                $scope.startExport(exportUrl + "?" + queryString);
			}

			$scope.startExport = function (url) {
				$scope.exportParams = {};
				$scope.exportParams.exportUrl = url;
				$scope.exportModel = $modal.open({
                    templateUrl: "app/components/importExport/exportData.html",
                    scope: $scope
                });
            }

            $scope.closeExport = function (){
				$scope.exportModel.close();
			}
		}
		
		function linkFun(scope, elem, attr, ngModel) {
			var exportUrl = attr.exporturl;
			var keycode = attr.keycode;
			elem.html('<button class="buttonCommon complaintDetail" ng-click="exportData(\''
						+ exportUrl
						+ '\')" keycode="'
						+ keycode
						+ '"><div class="btn_com_icon export_btn_com"></div>导出</button>');
			$compile(elem.contents())(scope);
			exportCtrl(scope,ngModel);
		}
	}

	function importExcel($rootScope, httpService, $modal, $compile, $parse, $upload, $http) {
		var directive = {
			require: "ngModel",
			scope : true,
			restrict : 'E',
			// template : '<button class="buttonCommon complaintDetail"
			// ng-click="importData()"><div class="glyphicon
			// glyphicon-plus"></div>导入</button>',
			//controller : importCtrl,
			link : linkFun,
			// bindToController : true,
			replace : true
		};
		return directive;
		
		function importCtrl($scope, ngModel) {
			$scope.importParams = {};
			$scope.importParams.showMsg = false;
			$scope.importParams.showError = false;
			// var tokenHeader = $http.defaults.headers.common.Authorization;

			$scope.importFile = function(files) {
				$scope.importParams.showMsgText = "开始导入";
				$scope.importParams.showMsg = true;
				$scope.importParams.showError = false;
				$scope.importParams.showErrorText = "";
				var params = ngModel.$modelValue;
				
				console.info(params);
				
				if (files && files.length) {
					var file = files[0];
					$upload.upload({
						method : 'POST',
						url : $scope.importParams.importUrl,
						data : {},
						file : file
					}).progress(function(evt) {
						console.log("progress   +100");
						var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
						console.log('progress: '
								+ progressPercentage + '% '
								+ evt.config.file.name);
					}).success(function(data, status, headers, config) {
						console.log(data);
						if (data.resCode != 200) {
							$scope.importParams.showMsgText = "导入错误";
							if (data.resMsg == "服务器错误") {
								$rootScope.addAlert("error","服务器错误！");
							} else {
								if (angular.isUndefined(data.resMsg)) {
									console.log("无数据返回")
								} else {
									$scope.importParams.showError = true;
									$scope.importParams.showErrorText = data.resMsg;
									//$rootScope.addAlert("error",data.resMsg);
								}
							}
						} else if (data.resCode == 200) {
							$scope.importParams.showMsgText = "数据导入成功：新增 "+data.data.addRows+" 条，更新 "+data.data.updateRows+" 条";
							$scope.importParams.showMsg = true;
							console.log("导入成功");
						}
					});
				}
			}

			$scope.openImportData = function(importUrl, templateUrl) {
				$scope.importParams.importUrl = importUrl;
				$scope.importParams.templateUrl = templateUrl;
				//uploader.url = $scope.importParams.importUrl;

				$scope.importDataModal = $modal.open({
					templateUrl : "app/components/importExport/importData.html",
					scope : $scope
				});
			}

			$scope.closeImportData = function() {
				$scope.importParams.showMsgText = "";
				$scope.importParams.showMsg = false;
				$scope.importParams.showErrorText = "";
				$scope.importParams.showError = false;
				$scope.importDataModal.close();
			}

			$scope.exportTemplate = function() {
				window.open($scope.importParams.templateUrl, "_blank");
			}
		}
		
		function linkFun(scope, elem, attr, ngModel) {
			
			var importUrl = attr.importurl;
			var templateUrl = attr.templateurl;
			var keycode = attr.keycode;
			elem.html('<button class="buttonCommon complaintDetail" ng-click="openImportData(\''
						+ importUrl
						+ '\',\''
						+ templateUrl
						+ '\')" keycode="'
						+ keycode
						+ '"><div class="btn_com_icon import_btn_com"></div>导入</button>');
			$compile(elem.contents())(scope);
			
			importCtrl(scope,ngModel);
		}
	}
})();