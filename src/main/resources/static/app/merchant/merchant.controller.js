angular.module('merchant')
  .controller('MerchantCrl', function ($scope, $modal, httpService, $rootScope) {
	  
	  $scope.selection = [];
      // Toggle selection for a given user by id
      $scope.toggleSelection = function toggleSelection(id) {
          var idx = $scope.selection.indexOf(id);

          // Is currently selected
          if (idx > -1) {
              $scope.selection.splice(idx, 1);
          }

          // Is newly selected
          else {
              $scope.selection.push(id);
          }
      };

      $scope.toggleSelectionAll = function toggleSelection() {
          if($scope.selection.length == $scope.merchantList.length){
              $scope.selectionAll = true;
          }

          $scope.selection = [];
      	if(!!!$scope.selectionAll){
              //$scope.selection = [];
              angular.forEach($scope.merchantList,function (merchant) {
                  $scope.selection.push(merchant.id);
              });
			}
          $scope.selectionAll = !!!$scope.selectionAll;
      }
	  
	    //页面初期化查询
	  $scope.systemSourceHash = {};
	    $scope.init = function () {
	    	//获取可选系统信息
	    	$scope.systemSourceList = new Array();
	    	httpService.req("GET","/web/mdm/staticdata", {tableName:"MerchantOrganization"}, function (result) {
				if (result && result.data) {
					for(var i = 0; i < result.data.length; i++) {
						var system = {};
						system.value = result.data[i].colValue;
						system.title = result.data[i].description;
						$scope.systemSourceList.push(system);
						$scope.systemSourceHash[system.value] = system.title;
					}
				}
			}, true);
	    	//将获取可选系统信息修改为从静态表获取
//			httpService.req("GET","/web/mdm/user/systemInfo", {}, function (result) {
//				if (result && result.data) {
//					var staticData = result.data;
//					$(staticData).each(function(i,e){
//						var data = staticData[i];
//						if(data.sysCode != 'MDM')
//						$scope.systemSourceList.push({value:data.id, title:data.sysName});
//					});
//				}
//			}, true);
	      $scope.queryMerchantInfoList();
	      //获取商家分类信息
	      $scope.queryFristMerchantType();
	    };

    $scope.queryParams = {//定义分页入参  默认第一页，每页10条
      pageNum: 1,
      pageSize: 10,
    };
    
    //isDeleted
    $scope.isDeletedList = [{
      title: "已删除",
      value: 1
    }, {
      title: "正常",
      value: 0
    }];
    $scope.levelsList =[{title : "低级",
    	value : 0},{title : "中级",
        	value : 1},{title : "高级",
            	value : 2}]
    $scope.typeList = [{
    	title : "直营店",
    	value : 1
    },{
    	title : "便利店",
    	value : 0
    },{
    	title : "超市",
    	value : 2
    }];
    //设置商家营业歇业时间（以整点整半点为准）

    $scope.merchantHasnight = [{title:'否',value:0},{title:'是',value:1}];
    $scope.merchantStatus = [{title:'停用',value:0},{title:'启用',value:1}];
    $scope.isExternalList = [{title:'否',value:0},{title:'是',value:1}]
    //查询商家分类信息
    $scope.queryFristMerchantType = function () {
    	var params = {
    			parentId : null
			};
        httpService.req("GET","/web/mdm/merchant/merchantType", params,function (result) {
          if (result && result.data) {
          	$scope.fristMerchantType = result.data.list;//返回数据列表
          	//$scope.totalItems = result.data.totalCount;
          }
        }, true);
      };
	  $scope.querySecondMerchantType = function (firstCategoryId) {
		  if(!firstCategoryId || firstCategoryId == "") {
			  $scope.secondMerchantType = [];
			  return;
		  }
		  var params = {
				  parentId : firstCategoryId
			};
	      httpService.req("GET","/web/mdm/merchant/merchantType", params, function (result) {
	        if (result && result.data) {
	        	$scope.secondMerchantType = result.data.list;//返回数据列表
	        	//$scope.totalItems = result.data.totalCount;
	        }
	      }, true);
	    };
    //查询商家信息
    $scope.queryMerchantInfoList = function () {
      httpService.req("GET","/web/mdm/merchant/merchantInfos", $scope.queryParams, function (result) {
        if (result && result.data) {
        	$scope.merchantList = result.data.list;//返回数据列表
        	$scope.totalItems = result.data.totalCount;
        	$scope.setDataTypeText();//设置type对应文本
        }
      }, true);
    };
    
    $scope.addParams = {};

    //打开新增页面
    $scope.addMerchant = function () {
      $scope.queryProvinceList();	//打开新增页面时获取省份数据
      $scope.cityList = [];
      $scope.districtList = [];
      $scope.loadOrgTypeList();		//加载组织机构类型列表
      $scope.addParams = {};
      //初始化几个选项为否：是否精选商家，是否夜场，是否外部商家
      $scope.addParams.isHighQualityMerchants = 0;
      $scope.addParams.hasNight = 0;
      $scope.addParams.isExternal = 0;
      //来源系统固定为“主数据平台”
        for(var i = 0; i < $scope.systemSourceList.length; i++) {
            if($scope.systemSourceList[i].title == "主数据平台") {
                $scope.addParams.systemId = $scope.systemSourceList[i].value;
                break;
            }
        }
      $scope.addModal = $modal.open({
        templateUrl: "app/merchant/addMerchant.html",
        backdrop:'static', 
        scope: $scope,
		  size:'lg'
      });
    };

    //新增确认
    $scope.addConfirm = function () {
        if (!$scope.checkEdit($scope.addParams)) {
          return;
        }
        if(!$scope.checkExist($scope.addParams.code)){
        	return;
        }
        httpService.req("POST","/web/mdm/merchant/addMerchant",{},function (res) {
          if (res.result == "true") {
            $rootScope.addAlert("success", "操作成功");
            $scope.addModal.close();
            $scope.queryMerchantInfoList();
          }

        }, true, $scope.addParams);
        
      };
//      $scope.addTestParams={"organizationId":"4d161370-1b9b-4d5f-be77-312faa9e165c","mName":"测试商家","code":"M361671694","title":"","mManager":"admim","contactTel":"18551875104","address":"二位无","province":null,"city":null,"distict":null,"type":0,"levels":0,"status":1,"description":"惹我热无","idOrganizationType":null,"imageUrl":null,"longitude":0.0,"latitude":0.0,"isHighQualityMerchants":0,"parkingNumber":0,"hasNight":0,"startOperation":"15:00","endOperation":"19:00","nightStart":null,"nightEnd":null,"corpID":null,"systemCode":"SSY","firstCategoryId":"98116da7-218d-4f0c-b466-85f47c98cafc","secondCategoryId":"098e9eb9-2477-43a2-b57b-3025feaa5487","isExternal":0,"id":"b2bbd33f-d531-40d0-8f94-99772e479c8a","createdOn":"2016-11-17 11:26:21","createdBy":"7f5f8756-0665-4eab-9dec-562f34cbbcc4","modifiedOn":"2016-11-17 11:26:24","modifiedBy":"7f5f8756-0665-4eab-9dec-562f34cbbcc4","isDeleted":0,"version":null};
//      $scope.addTest = function () {
//          httpService.req("POST","/web/mdm/merchant/merchantInfos",{},function (res) {
//            if (res.result == "true") {
//              $rootScope.addAlert("success", "操作成功");
//              $scope.addModal.close();
//              $scope.queryMerchantInfoList();
//            }
//
//          }, true, $scope.addTestParams);
//          
//        };

    //关闭新增商家
    $scope.cancelAdd = function () {
      $scope.addModal.close();
      $scope.orgHtml = "";
    };

    //打开编辑界面
    $scope.editParams = {};
    $scope.goEdit = function (index) {
      $scope.queryProvinceList();//打开新增页面时获取省份数据
      $scope.editIndex = index;
      $scope.editParams = $scope.merchantList[index];
      $scope.queryCityList($scope.editParams.province);
      $scope.queryDistrictList($scope.editParams.city);
      
      //初始化几个选项为否：是否精选商家，是否夜场，是否外部商家
      if($scope.editParams.isHighQualityMerchants == undefined) {
    	  $scope.editParams.isHighQualityMerchants = 0;
      }
      if($scope.editParams.hasNight == undefined) {
    	  $scope.editParams.hasNight = 0;
      }
      if($scope.editParams.isExternal == undefined) {
    	  $scope.editParams.isExternal = 0;
      }
      
      if($scope.editParams.organizationId != '') {
    	  var url = '/web/mdm/organazation/' + $scope.editParams.organizationId;
    	  httpService.req("GET", url, {},
				function(result) {
					if (result != null && result.data != null ) {
						var org = result.data;
						$scope.editParams.organizationName = org.name;
					}
				}, true);
      }
      $scope.querySecondMerchantType($scope.editParams.firstCategoryId);
      $scope.editModal = $modal.open({
        templateUrl: "app/merchant/editMerchant.html",
        backdrop:'static', 
        scope: $scope
      });
    };


    //校验新增&编辑参数
    $scope.checkEdit = function (checkParams) {
        if (checkParams.mName == null || checkParams.mName=="") {
          $rootScope.addAlert("error", "商家名称不能为空");
          return false;
        } 
        if (checkParams.mName.length >20) {
            $rootScope.addAlert("error", "商家名称长度不能超过20");
            return false;
        } 
        if (checkParams.code == null || checkParams.code == "") {
          $rootScope.addAlert("error", "商家编号不能为空");
          return false;
        } 
        if (checkParams.code.length >20) {
            $rootScope.addAlert("error", "商家编号长度不能超过20");
            return false;
        }
         
        if (checkParams.status == null) {
            $rootScope.addAlert("error", "商家状态为必选项");
            return false;
        }
        if (checkParams.systemId == null ||checkParams.systemId=="") {
            $rootScope.addAlert("error", "来源系统为必填项");
            return false;
        }
        if (checkParams.firstCategoryId == null || checkParams.firstCategoryId == "") {
            $rootScope.addAlert("error", "一级分类为必选项");
            return false;
        }
        if (checkParams.secondCategoryId == null || checkParams.secondCategoryId == "") {
            $rootScope.addAlert("error", "二级分类为必选项");
            return false;
        }
        if (checkParams.mManager === ''	|| !checkParams.mManager) {
            $rootScope.addAlert("error", "负责人不能为空");
            return false;
          } 
        if (checkParams.organizationId == null || checkParams.organizationId =="") {
            $rootScope.addAlert("error", "所属组织为必选项");
            return false;
        }
 
        if (checkParams.mManager!= null && checkParams.mManager.length >10) {
            $rootScope.addAlert("error", "商家负责人字符不合法");
            return false;
        }
        if (checkParams.contactTel !=null  && checkParams.contactTel !="" && !$scope.checkPhone(checkParams.contactTel)) {
            $rootScope.addAlert("error", "商家电话格式不正确");
            return false;
        }
        if (checkParams.title!= null && checkParams.title.length>100) {
            $rootScope.addAlert("error", "商家标题过长");
            return false;
        }
        if (checkParams.title!= null && checkParams.title.length >100) {
            $rootScope.addAlert("error", "商家标题过长");
            return false;
        }
        if (checkParams.address!=null && checkParams.address.length >100) {
            $rootScope.addAlert("error", "联系地址内容过长");
            return false;
        }
        if (checkParams.startOperation!=null && !$scope.checkTimes(checkParams.startOperation)) {
            $rootScope.addAlert("error", "营业时间出错，请重新输入！");
            return false;
        }
        if (checkParams.endOperation!=null && !$scope.checkTimes(checkParams.endOperation)) {
            $rootScope.addAlert("error", "营业时间出错，请重新输入！");
            return false;
        }
        if (checkParams.nightStart!=null && !$scope.checkTimes(checkParams.nightStart)) {
            $rootScope.addAlert("error", "晚间营业时间出错，请重新输入！");
            return false;
        }
        if (checkParams.nightEnd!=null && !$scope.checkTimes(checkParams.nightEnd)) {
            $rootScope.addAlert("error", "晚间营业时间出错，请重新输入！");
            return false;
        }
        
        if(checkParams.parkingNumber != null){
        	if(isNaN(checkParams.parkingNumber)){
        		$rootScope.addAlert("error", "停车位，应该输入数字");
        		return false;
        	}
        	if(checkParams.parkingNumber.length > 10){
        		$rootScope.addAlert("error", "停车位，长度不能超过10");
        		return false;
        	}
        }
        
        return true;
      };
      //电话格式校验
		$scope.checkPhone = function(phone) {
			var reg = /((^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)|^(0[1-9]{2})-\d{8}$|^(0[1-9]{3}-(\d{7,8}))$)/ ;
			// /^1(3|4|5|7|8)\d{9}$/
			return reg.test(phone);
		}
		$scope.checkTimes = function (time) {
			var resg = /^(0\d{1}|1\d{1}|2[0-3]):([0-5]\d{1})$/;
			return resg.test(time);
		}
    //确认编辑
    $scope.editConfirm = function () {
        if (!$scope.checkEdit($scope.editParams)) {
            return;
          }
		
    	layer.confirm('确认要提交？', {
    	    btn: ['提交','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
		
		     
		      httpService.req("PUT","/web/mdm/merchant/updateMerchant/"+$scope.editParams.id, {}, function (res) {
		
		        if (res.result == "true") {
		
		          $rootScope.addAlert("success", "操作成功!");
		          $scope.editModal.close();
		          $scope.queryMerchantInfoList();
		        }
		      }, true, $scope.editParams);
    	});

    };

    //取消编辑
    $scope.cancelEdit = function () {
    	$scope.queryMerchantInfoList();
      $scope.editModal.close();
    };

    //分页
    $scope.currentPage = 0;
    $scope.maxSize = 10;
//    $scope.setPage = function (pageNo) {
//      $scope.currentPage = pageNo;
//    };
    $scope.pageChanged = function (pageNo) {
      $scope.queryParams.pageNum = pageNo;
      $scope.queryMerchantInfoList();//这里需要改为当前查询的请求方法
    };
    
    
    //关闭新增商品
    $scope.cancelChooseAdd = function () {
      $scope.chooseModal.close();
    };
    
    //确认删除
    $scope.delParams={};
    $scope.doDel = function (index) {
    	$scope.delParams =$scope.merchantList[index];
//    	alert($scope.delParams.id);
        layer.confirm('确认要删除当前商家吗？', {
    	    btn: ['确认','取消'],
    	    title:"确认"
    	}, function(index){
    		
		      layer.close(index);
        
		      httpService.req("DELETE","/web/mdm/merchant/deleteMerchant/"+$scope.delParams.id,{},function (res) {
	          if (res.result == "true") {
	        	 $rootScope.addAlert("success", "操作成功!");
		         $scope.queryMerchantInfoList();
	          }

	        }, true, $scope.delParams);
    	});
        
    };
    //设置数据的日志类型、数据类型、状态匹配文字
    $scope.setDataTypeText = function() {
    	if($scope.merchantList){
    		for (var i = 0; i < $scope.merchantList.length; i++) {
    			var typeText = "";
    			var hasNightText = "";
    			var isHighQualityMerchantsText = "";
    			var levelsText ="";
    			var statusText="";
    			var isExternalText="";
    			if($scope.merchantList[i].isExternal != null){
    				switch($scope.merchantList[i].isExternal){
		    			case 1:
		    				isExternalText = "是";
		    				break;
		    			case 0:
		    				isExternalText = "否";
		    				break;
		    				default:break;
	    			}
    			}
    			$scope.merchantList[i].isExternalText = isExternalText;
    			
    			if($scope.merchantList[i].type != null){
    				switch($scope.merchantList[i].type){
		    			case 1:
		    				typeText = "直营店";
		    				break;
		    			case 2:
		    				typeText = "便利店";
		    				break;
		    			case 0:
		    				typeText = "超市";
		    				break;
		    				default:break;
	    			}
    			}
    			$scope.merchantList[i].typeText = typeText;
    			
    			if($scope.merchantList[i].hasNight != null) {
    				switch($scope.merchantList[i].hasNight){
		    			case 0:
		    				hasNightText = "无";
		    				break;
		    			case 1:
		    				hasNightText = "有";
		    				break;
		    				default:break;
					}
    			}
    			$scope.merchantList[i].hasNightText = hasNightText;
    			
    			if($scope.merchantList[i].isHighQualityMerchants != null) {
    				switch($scope.merchantList[i].isHighQualityMerchants){
		    			case 0:
		    				isHighQualityMerchantsText = "否";
		    				break;
		    			case 1:
		    				isHighQualityMerchantsText = "是";
		    				break;
		    				default:break;
					}
    			}
    			$scope.merchantList[i].isHighQualityMerchantsText = isHighQualityMerchantsText;
    			
    			if($scope.merchantList[i].levels != null){
    				switch($scope.merchantList[i].levels){
	    				case 0:
	    					levelsText = "低级";
	    				break;
	    				case 1:
	    					levelsText = "中级";
	    				break;
	    				case 2:
	    					levelsText = "高级";
	    				break;
	    				default:break;
    				}
    			}
    			$scope.merchantList[i].levelsText = levelsText;
    			
    			if($scope.merchantList[i].status != null){
    				switch($scope.merchantList[i].status){
	    				case 0:
	    					statusText = "停用";
	    				break;
	    				case 1:
	    					statusText = "启用";
	    				break;
	    				default:break;
    				}
    			}
    			$scope.merchantList[i].statusText = statusText;
    		}
    	}
    }

    //打开查看数据界面
    $scope.goView = function (index) {
    	
      $scope.editIndex = index;
      $scope.viewParams = $scope.merchantList[index];

        $scope.queryCityList($scope.viewParams.province);
        $scope.queryDistrictList($scope.viewParams.city);

        //初始化几个选项为否：是否精选商家，是否夜场，是否外部商家
        if($scope.viewParams.isHighQualityMerchants == undefined) {
            $scope.viewParams.isHighQualityMerchants = 0;
        }
        if($scope.viewParams.hasNight == undefined) {
            $scope.viewParams.hasNight = 0;
        }
        if($scope.viewParams.isExternal == undefined) {
            $scope.viewParams.isExternal = 0;
        }

        if($scope.viewParams.organizationId != '') {
            var url = '/web/mdm/organazation/' + $scope.viewParams.organizationId;
            httpService.req("GET", url, {},
                function(result) {
                    if (result != null && result.data != null ) {
                        var org = result.data;
                        $scope.viewParams.organizationName = org.name;
                    }
                }, true);
        }

      $scope.querySecondMerchantType($scope.viewParams.firstCategoryId);
      $scope.viewModal = $modal.open({
        templateUrl: "app/merchant/merchantInfo.html",
        scope: $scope
      });
    };
    $scope.closeView = function () {
        $scope.viewModal.close();
      };
      
      //分页
      //分页
      $scope.currentPage = 0;
      $scope.maxSize = 10;
      $scope.setPage = function (pageNo) {
          $scope.currentPage = pageNo;
        };
      $scope.pageChanged = function (pageNo) {
        $scope.queryParams.pageNum = pageNo;
        $scope.queryMerchantInfoList();//这里需要改为当前查询的请求方法
      };
 //======================================检验code是否存在===================================================
      $scope.checkResult={};
      $scope.checkExistParams= function(code){
    	  var Params ={
    		    code : code,
    			  pageNum : 1,
  				pageSize : 100000
    	  }
    	  httpService.req("GET","/web/mdm/merchant/merchantCheck", Params, function (result) {
    	        if (result!=null && result.data!=null) {
    	        	$scope.checkResult = result.data.list;
    	        }
    	        
    	  }, true);
    	};
    $scope.checkExist = function(code){
      $scope.checkExistParams(code);
  	  if($scope.checkResult!=null && $scope.checkResult.length>0){
    		$rootScope.addAlert("error", "您的商家编号已经存在，请更换！");
	        	return false;
      }
	  	return true;	
    };
 //----------------------------------------省市区三级联动数据来源------------------------------------------------
		// 查询省信息
		$scope.queryProvinceList = function() {
			var params = {
				level : 1,
				pageNum : 1,
				pageSize : 100000
			};

			httpService.req("POST", "/web/mdm/district/districtForSelect", {},
					function(result) {
						if (result != null && result.data != null ) {
							$scope.provinceList = result.data.list;
						}
					}, true, params);
		};
		// 查询城市列表信息
		$scope.queryCityList = function(province) {
			$scope.cityList = [];
			if (province == null || province == "") {
				return;
			}
			$scope.addParams.city = "";
			var params = {
				parentId : province,
				pageNum : 1,
				pageSize : 100000
			};
			httpService.req("POST", "/web/mdm/district/districtForSelect", {},
					function(result) {
						if (result != null && result.data != null) {
							$scope.cityList = result.data.list;
						}
					}, true, params);
		};

		// 查询区域列表信息
		$scope.queryDistrictList = function(city) {
			$scope.districtList = [];
			if (city == null || city == "") {
				return;
			}
			$scope.addParams.distict = "";
			var params = {
				parentId : city,
				pageNum : 1,
				pageSize : 100000
			};
			httpService.req("POST", "/web/mdm/district/districtForSelect", {},
					function(result) {
						$scope.districtList = result.data.list;

					}, true, params);
		};
	//=====================================================================================================
		//批量修改状态
	    $scope.batchUpdateOrgStatus = function (status) {
	    	if ($scope.selection.length == 0) {
	    		$rootScope.addAlert("error", "请选择商家!");
	    		return;
	    	}
	    	var param = {};
	    	param.ids = $scope.selection;
	    	param.flag = status;
	      	httpService.req("PUT","/web/mdm/merchant/batchUpdateMerchant", {}, function (data) {
	        	if (data.result == "true") {
	          		$rootScope.addAlert("success", "操作成功!");
	          		$scope.queryMerchantInfoList();
	        	}
	      	}, true, param);
	    };
	//=========================================================================================
		// 修改查询组织机构类型
		$scope.setUserInfoType = function(currentInfoType) {
			var d = document.getElementById("merchantBasicsInfo");
			var l = document.getElementById("merchantDetailInfo");
			var r = document.getElementById("merchantOrganizationID");
			if (currentInfoType == 1) {
				d.style.display = "flex";
				l.style.display = "none";
				r.style.display = "none";
			} else if (currentInfoType == 2) {
				d.style.display = "none";
				l.style.display = "flex";
				r.style.display = "none";
			} else if (currentInfoType == 3) {
				d.style.display = "none";
				l.style.display = "none";
				r.style.display = "flex";
			}
		};
		
		//加载组织机构类型及组织机构树
		$scope.orgTypeList = [];
		$scope.loadOrgTypeList = function() {
			var params = {
				tableName : "OrganizationType",
				pageNum : 1,
				pageSize : 10000
			};
			httpService.req("GET", "/web/mdm/staticdata", params,
				function(result) {
					$scope.orgTypeList = result.data;
				}, true);
		};
		$scope.loadOrgTree = function(currentOrgType) {
			var params = {
				'builder' : 'organazationStaticTreeBuilder',
				'id' : 'orgTree',
				//'checkable' : true,
				//'radio' : currentOrgType != '2',
				'parameter' : currentOrgType
			};
			httpService.req('GET', '/web/mdm/tree/static', params,
					function(result) {
						$scope.orgHtml = result.data;
						$scope.addParams.organizationId = '';
					}, true);
		};
  });
