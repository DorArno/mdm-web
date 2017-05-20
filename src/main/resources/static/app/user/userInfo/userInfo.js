/**
 * created by maja005 on 2016/09/23
 */
angular
		.module('user')
		.controller(
				'UserCrl',
				function($scope, $modal, httpService, $rootScope) {
					$scope.state = true;
					$scope.orState = true;
					$scope.isLoad = false;
					$scope.systype=-2;
					$scope.corpCode = "CCPG";
					$scope.optype = false;
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
                        if($scope.selection.length == $scope.userInfoList.length){
                            $scope.selectionAll = true;
                        }

                        $scope.selection = [];
                    	if(!!!$scope.selectionAll){
                            //$scope.selection = [];
                            angular.forEach($scope.userInfoList,function (user) {
                                $scope.selection.push(user.id);
                            });
						}
                        $scope.selectionAll = !!!$scope.selectionAll;
                    }

					
					$scope.phoneLeave = function(phone) {
						if (phone && phone != "" && !$scope.checkPhone(phone))
							$rootScope.addAlert("error", "手机号码不正确！");
					}
					$scope.emailLeave = function(email) {
						if (email && email != "" && !$scope.checkEmail(email))
							$rootScope.addAlert("error", "邮箱格式不正确！");
					}
					$scope.orTreeSetting = {}
					$scope.treeSetting = {
						showLine : true,
						checkable : true,
						isSimpleData : true,
						treeNodeKey : "id",
						treeNodeParentKey : "pId",
						checkType : {
							"Y" : "s",
							"N" : "ps"
						},
						callback : {
							change : zTreeOnCheck
						}
					};
					$scope.etreeSetting = {
						showLine : true,
						checkable : true,
						isSimpleData : true,
						treeNodeKey : "id",
						treeNodeParentKey : "pId",
						checkType : {
							"Y" : "s",
							"N" : "ps"
						},
						callback : {
							change : ezTreeOnCheck
						}
					};
					
					$scope.ertreeSetting = {
							showLine : true,
							checkable : true,
							isSimpleData : true,
							treeNodeKey : "id",
							treeNodeParentKey : "pId",
							checkType : {
								"Y" : "s",
								"N" : "ps"
							},
							callback : {
								change : erzTreeOnCheck
							}
						};
					
					$scope.nodes;
					$scope.radioChange = function(param) {
						$("#orgRadio").val(param);
						$("#merRadio").val(!param);
						if (!param) {
							httpService
									.req(
											"GET",
											"/web/mdm/merchant/merchantsForUser",
											{},
											function(result) {
												if (result && result.data) {
													var zTreeNodes = [];
													$scope.nodes = orgTree
															.getNodes();
													for (var i = 0; i < result.data.length; i++) {
														zTreeNodes
																.push({
																	"id" : result.data[i].id,
																	"pId" : 0,
																	'radio' : true,
																	"name" : result.data[i].mName,
																	"level" : 0,
																	"open" : false,
																	"isssy":true
																});
													}
													$scope.treeSetting.checkStyle='radio';
													$scope.treeSetting.checkRadioType ='all';
													
													orgTree = $("#orgTree").zTree($scope.treeSetting,zTreeNodes);
													
													if (roTree != null && roTree.getNodes().length > 0) {
														var pNodes = roTree.getNodesByParam("level", '0',null);
														for (var i = 0; i < pNodes.length; i++) {
															var cNode = orgTree.getNodeByParam("id",pNodes[i].id);
															if(null != cNode){
																cNode.checked = true;	
																cNode.checkedOld = cNode.checked;
																orgTree.updateNode(cNode, false);
															}
														}						
													}
												}
											}, true);
						}else{
							orgTree = $("#orgTree").zTree($scope.treeSetting,
									$scope.nodes);
						}
						document.getElementById("number").innerHTML="";
						document.getElementById("searchKey").value = ""
						orgTree.cancelSelectedNode();
						lastValue = "", nodeList = [], fontCss = {}, clickCount = 0;
					};
					$scope.eradioChange = function(param) {
						$("#eorgRadio").val(param);
						$("#emerRadio").val(!param);
						if(!$scope.state && param)$scope.state=true;
						if (!param) {
							httpService
									.req(
											"GET",
											"/web/mdm/merchant/merchantsForUser",
											{},
											function(result) {
												if (result && result.data) {
													var zTreeNodes = [];
													$scope.nodes = eorgTree
															.getNodes();
													for (var i = 0; i < result.data.length; i++) {
														zTreeNodes
																.push({
																	"id" : result.data[i].id,
																	"pId" : 0,
																	"name" : result.data[i].mName,
																	"level" : 0,
																	'radio' : true,
																	"open" : false
																});
													}
													
													$scope.etreeSetting.checkStyle='radio';
													$scope.etreeSetting.checkRadioType ='all';
													
													eorgTree = $("#eorgTree").zTree($scope.etreeSetting,zTreeNodes);
													
													if (eroTree != null && eroTree.getNodes().length > 0) {
														var pNodes = eroTree.getNodesByParam("level", '0',null);
														for (var i = 0; i < pNodes.length; i++) {
															var cNode = eorgTree.getNodeByParam("id",pNodes[i].id);
															if(null != cNode){
																cNode.checked = true;	
																cNode.checkedOld = cNode.checked;
																eorgTree.updateNode(cNode, false);
															}
														}						
													}
													
												}
											}, true);
						}else{
							eorgTree = $("#eorgTree").zTree(
									$scope.etreeSetting, $scope.nodes);
						}
						document.getElementById("number").innerHTML = "";
						document.getElementById("searchKey").value = ""
						eorgTree.cancelSelectedNode();
						lastValue = "", nodeList = [], fontCss = {}, clickCount = 0;
						
					};
					$scope.orRadioChange = function(param) {
						$("#orRradio").val(param);
						$("#orMerRadio").val(!param);
						if (!param) {
							$scope.nodes = tree.getNodes();
							$scope.orTreeSetting = tree.getSetting();
							httpService
									.req(
											"GET",
											"/web/mdm/merchant/merchantsForUser",
											{},
											function(result) {
												if (result && result.data) {
													var zTreeNodes = [];

													for (var i = 0; i < result.data.length; i++) {
														zTreeNodes
																.push({
																	"id" : result.data[i].id,
																	"pId" : 0,
																	"name" : result.data[i].mName,
																	"level" : 0,
																	"open" : false
																});
													}
													tree = $("#ztree")
															.zTree(
																	$scope.orTreeSetting,
																	zTreeNodes);
												}
											}, true);
							$scope.queryParams.organizationId = '';
							$scope.queryParams.orgType = "-3";
							$scope.queryUserList();
						}

						else {
							tree = $("#ztree").zTree($scope.orTreeSetting,
									$scope.nodes);
							$scope.queryParams.organizationId = '';
							$scope.queryParams.orgType = "0";
							$scope.queryUserList();
						}
					};
					$scope.typeModel = [];
					$scope.typeSettings = {
						scrollableHeight : '200px',
						scrollable : true,
						smartButtonMaxItems : 2,
						smartButtonTextConverter : function(itemText,
								originalItem) {
							if (itemText === 'Jhon') {
								return 'Jhonny!';
							}

							return itemText;
						}
					};
					
					$scope.getCurDate = function(day){
						var mydate = new Date();
						mydate.setDate(mydate.getDate()-day);
						var t=mydate.toLocaleDateString();
						var time =	mydate.getHours()+":"
							+ mydate.getMinutes()+":"
							+ mydate.getSeconds();
						return t + " " + time;
					};
					
					$scope.queryParams = {// 定义分页入参 默认第一页，每页10条
						pageNum : 1,
						pageSize : 10,
						orgType : -2,
						organizationId : '',
						account : '',
						name : '',
						userId : 'admin',
						isDeleted : 0,
						userChannels:Math.pow(2, 1)//by hyz. 底数必须为2，幂数为channelCode的值，这里为1表示mdm
//						,endDate : $scope.getCurDate(0),
//						beginDate:$scope.getCurDate(7)
					};
					
					// isDeleted
					$scope.isDeletedList = [ {
						title : "删除",
						value : 1
					}, {
						title : "启用",
						value : 0
					} ];

					// status
					$scope.isStatusList = [ {
						title : "停用",
						value : 0
					}, {
						title : "启用",
						value : 1
					} ];

					/*
					 * // status $scope.typeList = [ { label : "后台用户", id : 1 }, {
					 * label : "帮工", id : 2 }, { label : "业主", id : 3 }, { label :
					 * "会员", id : 4 }, { label : "其它", id : 10 } ];
					 */

					// status
					$scope.sexList = [ {
						title : "保密",
						value : 0
					}, {
						title : "男",
						value : 1
					}, {
						title : "女",
						value : 2
					} ];
					
					$scope.sexHash = {
							"0":"保密",
							"1":"男",
							"2":"女"
					};
					
					$scope.statusHash = {
							"0":"停用",
							"1":"启用"
					};

					$scope.yesOrNoList = [ {
						title : "是",
						value : 1
					}, {
						title : "否",
						value : 0
					} ];
					
					$scope.phoneNumberConfirmedList = [ {
						title : "是",
						value : 1
					}, {
						title : "否",
						value : 0
					}, {
						title : "已解绑",
						value : 2
					} ];
					
					$scope.confirmedHash = {
						"1":"是",
						"0":"否"
					};

					$scope.orgTypeList = [];
					
					$scope.loadOrgTab = function() {
						var params = {
							tableName : "OrganizationType",
							pageNum : 1,
							pageSize : 10000
						};
						httpService.req("GET", "/web/mdm/staticdata", params,
								function(result) {
									var staticdata = result.data;
									
									var typeList = new Array();
									
									var htm = '<li class="active"><a href="#" data-toggle="" onClick="changeOrgType(-2); return false;">所有</a></li>';
									$(staticdata).each(function(i,e){
										htm += '<li><a href="#" data-toggle="" onClick="changeOrgType('+staticdata[i].colValue+'); return false;">'+staticdata[i].colName+'</a></li>';
										var typeData = {};
										typeData.title=staticdata[i].colName;
										typeData.value=staticdata[i].colValue;
										typeList.push(typeData);
									});
									$('#myTab').html(htm);
									$scope.orgTypeList = typeList;
								}, true);
					};
					
					// 页面初期化查询
					$scope.init = function() {
						$scope.systemSourceList = new Array();
						$scope.systemSourceHash = {};// add by hyz
						httpService.req("GET","/web/mdm/user/systemInfo", {}, function (result) {
							if (result && result.data) {
								var staticData = result.data;
								$(staticData).each(function(i,e){
									var data = staticData[i];
									$scope.systemSourceList.push({value:data.id, title:data.sysName});
									$scope.systemSourceHash[data.id] = data.sysName;// add by hyz
								});
							}
						}, true);
						
						$scope.loadOrgTab();
						
						$scope.loadOrgTree();
						$scope.queryUserList();
						// 获取来源列表
						$scope.querySystemInfos();
						// 获取企业代码列表
						$scope.queryCropCodeStaticDatas();
						// 获取组织机构类型列表
						// $scope.queryIdOrgTypeListStaticDatas();
						$scope.addParams = {
							userBasicsInfoRequest : {
								sex : 0,
								status : 1,
								systemId : '0786b348-f28e-4e7a-b46d-43dd13a42bed'
							},
							userDetailInfoRequest : {
								emailConfirmed : 0,
								phoneNumberConfirmed : 1,
								isInternal : 0
							}
						};
					};
					// 设置物业云---企业代码(联动)
					$scope.setQueryCorpCode = function(corpCode){
						$scope.corpCode = corpCode;
						$('#corpCodeHidden').find('input').val(corpCode);
					};
					
					// 修改查询组织机构类型
					$scope.setOrgType = function(currentOrgType) {
						$scope.selection = [];
						
						$("#myTab").children().click(
								function() {
									$(this).addClass("active").siblings()
											.removeClass("active")
								});

						if (!$scope.isLoad) {
							$scope.isLoad = true;
							var d = document.getElementById("organization");
							var l = document.getElementById("userList");
							var r = document.getElementById("orRradio");
							if (currentOrgType == -2) {
								d.style.display = "none";
								l.style.width = "100%";
								l.style.left = "0.1%";
							} else {
								d.style.display = "block";
								l.style.width = "80%";
								l.style.left = "20.1%";
								if (currentOrgType == 0) {
									r.style.display = "block";
								} else {
									r.style.display = "none";
								}
							}
							$scope.queryParams.organizationId = '';
							$scope.queryParams.name = '';
							$scope.queryParams.account = '';
							$scope.queryParams.orgType = currentOrgType;
							$scope.loadOrgTree(currentOrgType);
							$scope.queryUserList();

						} else {
							$rootScope.addAlert("error", "正在加载");
						}
					};

					// 修改查询组织机构类型
					$scope.setOrgRoleType = function(currentOrgType) {
						document.getElementById("number").innerHTML="";
						document.getElementById("searchKey").value = ""
						showFilterInput(true);
						
						$scope.setDisplay(currentOrgType,"radio");
						$scope.loadOrgRoleTree(currentOrgType);
						
						if(currentOrgType == '0'){
							$("#orgRadio").val(true);
							$("#merRadio").val(false);
							var ssyType = $('input[name="selectState"]:checked').attr('id');
							if(ssyType=='merRadio'){
								$scope.radioChange(false);
							}else{
								$scope.radioChange(true);
							}
						}
					};

					// 修改查询组织机构类型
					$scope.esetOrgRoleType = function(currentOrgType) {
						document.getElementById("number").innerHTML="";
						document.getElementById("searchKey").value = ""
						showFilterInput(true);
//						$('#corpCodeHidden').find('input').val($scope.editParams.userBasicsInfoRequest.corpCode);
						$scope.setDisplay(currentOrgType, "eradio");
						$scope.eloadOrgRoleTree(currentOrgType);
						
						if(currentOrgType == '0'){
							if(!$scope.state){
								$("#eorgRadio").val(false);
								$("#emerRadio").val(true);
							}else{
								$("#eorgRadio").val(true);
								$("#emerRadio").val(false);
								
							}
							var ssyType = $('input[name="selectState"]:checked').attr('id');
							if(ssyType=='emerRadio'){
								$scope.eradioChange(false);
							}else{
								if(!$scope.state){
									$scope.eradioChange(false);
								}else{
									$scope.eradioChange(true);
								}
							}
						}
					};

					// 物业云，需要按照corpCode查询组织
					$scope.corpCodeChange = function(corpCode){
						$scope.corpCode = corpCode;
						$scope.addParams.userBasicsInfoRequest.corpCode = corpCode;
						$('#addCorpCode').find('input').val(corpCode);
						var currentOrgType = $('#curOrgType').val();
						$scope.setOrgRoleType(currentOrgType);
					};
					$scope.ecorpCodeChange = function(corpCode){
						$scope.corpCode = corpCode;
// $scope.editParams.userBasicsInfoRequest.corpCode = corpCode; //
// （修改数据）暂时不做联动修改企业代码
//						$('#editCorpCode').find('input').val(corpCode);
						var currentOrgType = $('#curOrgType').val();
						$scope.esetOrgRoleType(currentOrgType);
					};
					
					// 控制部分页面组件的显示与隐藏，隐藏条件的赋值
					$scope.setDisplay = function(currentOrgType, radioId){
						$('#curOrgType').val(currentOrgType);
						
						var d = document.getElementById(radioId);
						if (currentOrgType == 0) {
							d.style.display = "flex";
						} else {
							d.style.display = "none";
						}
						var ch = document.getElementById("corpCodeHidden");
						if (currentOrgType == 3) {
							ch.style.display = "flex";
						} else {
							ch.style.display = "none";
						}
					};
					
					// 修改查询组织机构类型
					$scope.setUserInfoType = function(currentInfoType) {
						var d = document.getElementById("userBasicsInfo");
						var l = document.getElementById("userDetailInfo");
						var r = document.getElementById("userOrganizationRole");
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
						//	判断当前tab页 非所有，需展示对应的组织树
						if($scope.systype != -2){
							if($scope.optype){
								$scope.editParams.setOrgSystem = $scope.systype+"";
								$scope.esetOrgRoleType($scope.systype);
							}else{
								$scope.addParams.setOrgSystem = $scope.systype+"";
								$scope.setOrgRoleType($scope.systype);
							}
						}
					};
					$scope.myHttpService = function(method, url, param,
							callback, isornot) {
						httpService.req(method, url, param, callback, isornot);
					};
					$scope.loadOrgTree = function() {
						var params = {
							'builder' : 'organazationStaticTreeBuilder',
							'checkable' : false,
							'parameter' : $scope.queryParams.orgType
						};
						httpService.req('GET', '/web/mdm/tree/static', params,
								function(result) {
									$scope.html = result.data;
									$scope.isLoad = false;
								}, true);
					};
					$scope.loadOrgChecked = "if (roTree != null && roTree.getNodes().length > 0) {var pNodes = roTree.getNodesByParam(\"level\", '0',null);	for (var i = 0; i < pNodes.length; i++) {var cNode = orgTree.getNodeByParam(\"id\",	pNodes[i].id);if(null!=cNode){cNode.checked = true;	cNode.checkedOld = cNode.checked;orgTree.updateNode(cNode, false);}}}";
					$scope.loadOrgRoleTree = function(currentOrgType) {
						var isRadio = true;
						if(currentOrgType == '2' || currentOrgType == '3') isRadio = false;
						
						var corpcode = "";
						if(currentOrgType == '3')corpcode=$scope.corpCode;
						
						var params = {
							'builder' : 'organazationStaticTreeBuilder',
							'id' : 'orgTree',
							'checkable' : true,
							'radio' : isRadio,
							'parameter' : currentOrgType,
							'ztreecallback' : "{change:zTreeOnCheck}",
							'loadChecked' : $scope.loadOrgChecked
							,'corpCode':corpcode
						};
						httpService.req('GET', '/web/mdm/tree/static', params,
								function(result) {
									$scope.orgHtml = result.data;
									if(orgTree != null && orgTree){orgTree.cancelSelectedNode();};
								}, true);
					};
					$scope.eloadOrgChecked = "if (eroTree != null && eroTree.getNodes().length > 0) {var pNodes = eroTree.getNodesByParam(\"level\", '0',null);	for (var i = 0; i < pNodes.length; i++) {var cNode = eorgTree.getNodeByParam(\"id\",pNodes[i].id);if(null!=cNode){cNode.checked = true;	cNode.checkedOld = cNode.checked;eorgTree.updateNode(cNode, false);}}}";
					$scope.eloadOrgRoleTree = function(currentOrgType) {
						var isRadio = true;
						if(currentOrgType == '2' || currentOrgType == '3') isRadio = false;
						
						var corpcode = "";
						if(currentOrgType == '3')corpcode=$scope.corpCode;
						
						var params = {
							'builder' : 'organazationStaticTreeBuilder',
							'id' : 'eorgTree',
							'checkable' : true,
							'radio' : isRadio,
							'parameter' : currentOrgType,
							'ztreecallback' : "{change:ezTreeOnCheck}",
							'loadChecked' : $scope.eloadOrgChecked
							,'corpCode':corpcode
						};
						httpService.req('GET', '/web/mdm/tree/static', params,
								function(result) {
									$scope.eorgHtml = result.data;
									if(eorgTree != null && eorgTree){eorgTree.cancelSelectedNode();};
								}, true);
					};
					
					// 查询系统信息
					$scope.queryUserList = function(reset) {
						if(reset){
							delete $scope.queryParams.lastMaxPk;
							delete $scope.queryParams.lastMinPk;
							delete $scope.queryParams.lastPageNum;
							$scope.queryParams.pageNum = 1;
						}
						
						httpService.req("POST", "/web/mdm/user/list", {}, function(
								result) {
							var data = result.data;
							if (data != null) {
								var userList = data.list;
								$scope.queryParams.lastMaxPk = data.maxPk;
								$scope.queryParams.lastMinPk = data.minPk;
								// 设置来源系统
								/*for(var i = 0; i < userList.length; i++) {
									//var userinfo = userList[i];
									//userList[i].sourceSystem = $scope.systemSourceHash[userinfo.systemId] || '';
									for(var j = 0; j < $scope.systemSourceList.length; j++) {
										var userinfo = userList[i], sourceinfo = $scope.systemSourceList[j];  //userinfo 需要在内层循环外面声明、定义
										if(userinfo.systemId == sourceinfo.value) {
											userList[i].sourceSystem = $scope.systemSourceList[j].title;
											break;
										}else{
											userList[i].sourceSystem = "";
										}
									}
								}*/
								$scope.userInfoList = userList;
							}
							$scope.totalItems = data.totalCount;
							
						}, true, $scope.queryParams);
					};

					$scope.TypeName = [ "社商云", "悦帮", "收费云&物业云" ];

					$scope.addParams = {};
					// 打开新增页面
					$scope.addOrganazationInfo = function() {
						
						ssyNodes = new Array();
						if ($scope.addParams.parentId == "") {
							$scope.addParams.parentId = tree.getNodes()[0].id;
							$scope.addParams.parentName = tree.getNodes()[0].name;
						}
						$scope.addParams.type = $scope.queryParams.orgType;
						$scope.addParams.typeName = $scope.TypeName[$scope.addParams.type];
						$scope.addParams.userBasicsInfoRequest.corpCode='CCPG';
						$scope.addParams.userDetailInfoRequest.isInternal = 0;
						
						$scope.corpCode = "CCPG";
						$scope.optype = false;
						$scope.state = true;
						
						$scope.addModal = $modal.open({
							templateUrl : "app/user/userInfo/addUser.html",
							scope : $scope,
							backdrop : 'static'
						});
					};

					// 查询系统信息
					$scope.querySystemInfos = function() {
						httpService.req("GET", "/web/mdm/invokeSystem/systemInfos",
								$scope.queryParams, function(result) {
									$scope.sourceList = result.data;
								}, true);
					};

					// 查询企业代码信息
					$scope.queryCropCodeStaticDatas = function() {
						var params = {
							tableName : "OrgCorpCode",
							pageNum : 1,
							pageSize : 10000
						};
						httpService.req("GET", "/web/mdm/staticdata", params,
								function(result) {
									$scope.cropCodeList = result.data;
								}, true);
					};

					/*
					 * // 查询组织机构类型信息 $scope.queryIdOrgTypeListStaticDatas =
					 * function() { var params = { tableName : "CCPGOrgType" };
					 * httpService.req("GET", "/web/mdm/staticdata", params,
					 * function(result) { $scope.orgTypeList = result.data; },
					 * true); };
					 */

					// 新增确认
					$scope.addConfirm = function() {

						if (!$scope.checkEdit($scope.addParams)
								|| !$scope.checkFormat($scope.addParams)
								|| !$scope.checkLength($scope.addParams)) {
							return;
						}
						if (roTree == null || !roTree
								|| roTree.getCheckedNodes().length == 0) {
							$rootScope.addAlert("error", "请分配组织角色！");
							return;
						}
						var checkedNodes = roTree.getCheckedNodes();
						var userRoleArray = new Array();
						for (var i = 0; i < checkedNodes.length; i++) {
							userRoleArray
									.push({
										roleId : checkedNodes[i].id,
										organizationId : checkedNodes[i].parentNode.pId,
										systemId : checkedNodes[i].parentNode.id,
										type : checkedNodes[i].isMer
									});
						}
						$scope.addParams.userRoleRequest = userRoleArray;
						$scope.addParams.userChannel = [ {
							'channelCode' : '1'
						} ];
						
						// 设置type
						var ssyType = $('input[name="selectState"]:checked').attr('id');
						if(ssyType=='merRadio'){
							$scope.addParams.userBasicsInfoRequest.type=1;
						}else{
							$scope.addParams.userBasicsInfoRequest.type=0;
						}
						
						// $scope.typeModel;
						//httpService.req("POST", "/web/mdm/user/verifyPhone", {'cellPhone':$scope.addParams.userBasicsInfoRequest.cellPhone,'id':''}, function(result) {
						var validate_cellPhone = $scope.addParams.userBasicsInfoRequest.cellPhone;
						// 验证编码是否重复
						httpService.req("POST", "/web/mdm/user/verifyPhone", {'cellPhone':validate_cellPhone, 'id':''}, function(result) {
								var data = result.data;
								if (data != null) {
									if(data == "error"){
										$rootScope.addAlert("error", "手机号码重复!");
										$scope.isAdd = false;
									}else{
										$scope.proposal(data, validate_cellPhone);
									}
									return;
								}else{
									httpService.req("POST", "/web/mdm/user", {},
											function(data) {
												if (data.resCode == 200) {
													$rootScope.addAlert("success",
															"操作成功，默认密码123456");
													$scope.closeAdd();
													$scope.cancelAdd();
													// $scope.addModal.close();
//													$scope.queryParams.endDate = $scope.getCurDate(0);
//													$scope.queryParams.beginDate = $scope.getCurDate(7);
													$scope.queryUserList(true);
												}

											}, true, $scope.addParams);
								}	
							}, true);
					};
					
					//	建议设置用户为前端（会员）or 后端用户
					$scope.proposal = function(userId, cellPhone) {
						layer.confirm('已存在相同手机号的前端用户，要设置为后端用户吗？', {
							btn: ['确定','取消'],
							title:"操作确认"
						}, function(flag){
							layer.close(flag);
							$scope.addParams.userBasicsInfoRequest.id = userId;
							httpService.req("POST", "/web/mdm/user/setBackEndUserForMerge", {}, function(data) {
								if (data.resCode == 200) {
									$scope.closeAdd();
									$scope.cancelAdd();
									$rootScope.addAlert("success", "操作成功!");
									$scope.queryUserList(true);
								}
							}, true, $scope.addParams);
						});
					};
					
					$scope.closeAdd = function() {
						$scope.addParams = {
							userBasicsInfoRequest : {
								sex : 0,
								status : 1,
								systemId : '0786b348-f28e-4e7a-b46d-43dd13a42bed'
							},
							userDetailInfoRequest : {
								emailConfirmed : 0,
								phoneNumberConfirmed : 1
							}
						};
					};
					// 关闭新增商品
					$scope.cancelAdd = function() {
						$scope.closeAdd();
						$scope.orgHtml = "";
						roTree = $("#rTree").zTree($scope.treeSetting, []);
						$scope.addModal.close();
					};

					// 打开编辑界面
					$scope.editParams = {userBasicsInfoRequest:{corpCode:''}};
					$scope.goEdit = function(id, eCorpCode) {
						essyNodes = [];
						$scope.corpCode = eCorpCode;
						$scope.editParams.userBasicsInfoRequest.corpCode=eCorpCode;
						httpService.req("GET", "/web/mdm/user", {
							id : id
						}, function(data) {
							if (data.resCode == 200) {
								$scope.editParams = data.data;
								var responseTreeNodes = data.data.treeResponse;
								$(responseTreeNodes).each(function(i,e){
									if(responseTreeNodes[i].ssyRole == "1"){
										essyNodes.push(responseTreeNodes[i]);
									}
								});
								eroTree = $("#erTree").zTree(
										$scope.ertreeSetting,
										$scope.editParams.treeResponse);
								eroTree.expandAll(true);
								//	设置下拉框展示（组织树）
								$scope.editParams.setOrgSystem = $scope.systype+"";
//								$scope.corpCode = $scope.editParams.userBasicsInfoRequest.corpCode;
								if($scope.editParams.userBasicsInfoRequest.type ==1){
									$scope.state = false;
								}else{
									$scope.state = true;
								}
							} else {
								$rootScope.addAlert("error", "获取数据失败");
							}
						}, true);
						$scope.editModal = $modal.open({
							templateUrl : "app/user/userInfo/editUser.html",
							scope : $scope,
							backdrop : 'static'
						});
						$scope.optype = true;
					};
					
					// 判断是否存在中文和全角字符
					$scope.CheckChineseOrFullwidthChar = function(str){     
					　　	if(null != str.match(/[^\x00-\xff]/ig)){
					　　		return false;
					　　	}
					　　	return true;
					};
					
					// 非空校验
					$scope.checkEdit = function(checkParams) {

						/*if (checkParams.userBasicsInfoRequest.account === ''
								|| !checkParams.userBasicsInfoRequest.account) {
							$rootScope.addAlert("error", "账号不能为空");
							return false;
						}else if(!$scope.CheckChineseOrFullwidthChar(checkParams.userBasicsInfoRequest.account)){
							$rootScope.addAlert("error", "账号不能包含汉字或全角字符");
							return false;
						} else */
						if (checkParams.userBasicsInfoRequest.status === ''
								|| (!checkParams.userBasicsInfoRequest.status && checkParams.userBasicsInfoRequest.status !== 0)) {
							$rootScope.addAlert("error", "状态不能为空");
							return false;
						}else if (checkParams.userBasicsInfoRequest.cellPhone === ''
								|| !checkParams.userBasicsInfoRequest.cellPhone) {
							$rootScope.addAlert("error", "手机不能为空");
							return false;
						} 
						/*else if (checkParams.userBasicsInfoRequest.systemId === ''
								|| !checkParams.userBasicsInfoRequest.systemId) {
							$rootScope.addAlert("error", "来源系统不能为空");
							return false;
						}*/
						
						else if (checkParams.userBasicsInfoRequest.sex === ''
								|| (!checkParams.userBasicsInfoRequest.sex && checkParams.userBasicsInfoRequest.sex !== 0)) {
							$rootScope.addAlert("error", "性别不能为空");
							return false;
						} else if (checkParams.userDetailInfoRequest.emailConfirmed === ''
								|| (!checkParams.userDetailInfoRequest.emailConfirmed && checkParams.userDetailInfoRequest.emailConfirmed !== 0)) {
							$rootScope.addAlert("error", "是否邮箱认证不能为空");
							return false;
						} else if (checkParams.userDetailInfoRequest.phoneNumberConfirmed === ''
								|| (!checkParams.userDetailInfoRequest.phoneNumberConfirmed && checkParams.userDetailInfoRequest.phoneNumberConfirmed !== 0)) {
							$rootScope.addAlert("error", "是否电话认证不能为空");
							return false;
						} else if (checkParams.userDetailInfoRequest.isInternal === ''
								|| (!checkParams.userDetailInfoRequest.isInternal && checkParams.userDetailInfoRequest.isInternal !== 0)) {
							$rootScope.addAlert("error", "是否内置用户不能为空");
							return false;
						}
						return true;
					};
					// 格式校验
					$scope.checkFormat = function(checkParams) {
						if (checkParams.userBasicsInfoRequest.cellPhone
								&& checkParams.userBasicsInfoRequest.cellPhone != ""
								&& !$scope
										.checkPhone(checkParams.userBasicsInfoRequest.cellPhone)) {
							$rootScope.addAlert("error", "手机号码格式不正确！");
							return false;
						} else if (checkParams.userBasicsInfoRequest.email
								&& checkParams.userBasicsInfoRequest.email != ""
								&& !$scope
										.checkEmail(checkParams.userBasicsInfoRequest.email)) {
							$rootScope.addAlert("error", "邮箱格式不正确！");
							return false;
						}
						return true;
					}
					$scope.checkLength = function(checkParams) {
						/*if (checkParams.userBasicsInfoRequest.account
								&& checkParams.userBasicsInfoRequest.account.length > 50) {
							$rootScope.addAlert("error", "账号长度不得超过50");
							return false;
						} else */
						if (checkParams.userBasicsInfoRequest.username
								&& checkParams.userBasicsInfoRequest.username.length > 50) {
							$rootScope.addAlert("error", "名称长度不得超过50");
							return false;
						} else if (checkParams.userBasicsInfoRequest.email
								&& checkParams.userBasicsInfoRequest.email.length > 255) {
							$rootScope.addAlert("error", "邮箱长度不得超过255");
							return false;
						} else if (checkParams.userBasicsInfoRequest.phoneNumber
								&& checkParams.userBasicsInfoRequest.phoneNumber.length > 20) {
							$rootScope.addAlert("error", "联系电话长度不得超过20");
							return false;
						} else if (checkParams.userBasicsInfoRequest.weChatID
								&& checkParams.userBasicsInfoRequest.weChatID.length > 50) {
							$rootScope.addAlert("error", "微信长度不得超过50");
							return false;
						} else if (checkParams.userDetailInfoRequest.nickName
								&& checkParams.userDetailInfoRequest.nickName.length > 50) {
							$rootScope.addAlert("error", "昵称长度不得超过50");
							return false;
						} else if (checkParams.userDetailInfoRequest.homeAddress
								&& checkParams.userDetailInfoRequest.homeAddress.length > 500) {
							$rootScope.addAlert("error", "家庭地址长度不得超过500");
							return false;
						} else if (checkParams.userDetailInfoRequest.signature
								&& checkParams.userDetailInfoRequest.signature.length > 500) {
							$rootScope.addAlert("error", "签名长度不得超过500");
							return false;
						} else if (checkParams.userDetailInfoRequest.description
								&& checkParams.userDetailInfoRequest.description.length > 500) {
							$rootScope.addAlert("error", "描述长度不得超过500");
							return false;
						}
						return true;
					}

					// 验证手机号码
					$scope.checkPhone = function(phone) {
						var reg = /(^0{0,1}1[3|4|5|6|7|8|9][0-9]{9}$)/;
						// /^1(3|4|5|7|8)\d{9}$/
						return reg.test(phone);
					}

					// 验证邮箱
					$scope.checkEmail = function(email) {
						var reg = /^([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|_|.]?)*[a-zA-Z0-9]+\.(?:com|cn)$/;
						return reg.test(email);
					}

					// 确认编辑
					$scope.editConfirm = function() {
						if (!$scope.checkEdit($scope.editParams)
								|| !$scope.checkFormat($scope.editParams)
								|| !$scope.checkLength($scope.editParams)) {
							return;
						}
						if (eroTree == null || !eroTree
								|| eroTree.getCheckedNodes().length == 0) {
							$rootScope.addAlert("error", "请分配组织角色！");
							return;
						}
						var checkedNodes = eroTree.getCheckedNodes();
						var userRoleArray = new Array();
						for (var i = 0; i < checkedNodes.length; i++) {
							userRoleArray
									.push({
										roleId : checkedNodes[i].id,
										organizationId : checkedNodes[i].parentNode.pId,
										systemId : checkedNodes[i].parentNode.id,
										type : checkedNodes[i].isMer
									});
						}
						$scope.editParams.userRoleRequest = userRoleArray;
						if (!$scope.editParams.userChannel
								|| $scope.editParams.userChannel.length == 0)
							$scope.editParams.userChannel = [ {
								'channelCode' : '1'
							} ];
						
						// 设置type
						var orgtype = $scope.editParams.setOrgSystem;
						if (typeof (orgtype) != "undefined" && null != orgtype && orgtype!="") {
							var ssyType = $('input[name="selectState"]:checked').attr('id');
							if(ssyType=='merRadio' || ssyType=='emerRadio'){
								$scope.editParams.userBasicsInfoRequest.type=1;
							}else{
								$scope.editParams.userBasicsInfoRequest.type=0;
							}
						}
						
						// 验证编码是否重复
						/*httpService.req("POST", "/web/mdm/user/verifyPhone", {'cellPhone':$scope.editParams.userBasicsInfoRequest.cellPhone,'id':$scope.editParams.userBasicsInfoRequest.id}, function(result) {
								var data = result.data;
								if (data != null) {
									$rootScope.addAlert("error", "手机号码重复!");
									$scope.isAdd = false;
									return;
								}else{		}
						}, true);*/
						$scope.editParams.treeResponse = null;
						httpService.req("PUT", "/web/mdm/user/"
								+ $scope.editParams.userBasicsInfoRequest.id,
								{}, function(data) {

									if (data.resCode == 200) {
										$scope.optype = false;
										$rootScope.addAlert("success", "操作成功");
										$scope.editModal.close();
//													$scope.queryParams.endDate = $scope.getCurDate(0);
//													$scope.queryParams.beginDate = $scope.getCurDate(7);
										$scope.queryUserList(true);
									}

								}, true, $scope.editParams);
						
					};

					$scope.goDelete = function(id) {
						layer.confirm('确认要删除吗？', {
							btn: ['确定','取消'],
							title:"操作确认"
						}, function(flag){
							layer.close(flag);
							httpService.req("DELETE", "/web/mdm/user/" + id, {}, function(data) {
								if (data.resCode == 200) {
									$rootScope.addAlert("success", "操作成功!");
									$scope.queryUserList(true);
								}
							}, true);
						});
					};

					// 取消编辑
					$scope.cancelEdit = function() {
						$scope.eorgHtml = "";
						roTree = $("#erTree").zTree($scope.ertreeSetting, []);
						$scope.editModal.close();
					};

					$scope.batchEnable = function() {
                        if ($scope.selection.length == 0) {
                            $rootScope.addAlert("error", "请选择用户!");
                            return;
                        }
						httpService.req("PUT", "/web/mdm/user/BatchUpdateStatus",
								{}, function(result) {
									if (result.resCode == 200) {
										$rootScope.addAlert("success", "启用成功");
										$scope.queryUserList();
									}
								}, true, {
									ids : $scope.selection,
									flag : 1
								});
					}

					$scope.batchDisable = function() {
                        if ($scope.selection.length == 0) {
                            $rootScope.addAlert("error", "请选择用户!");
                            return;
                        }
						httpService.req("PUT", "/web/mdm/user/BatchUpdateStatus",
								{}, function(result) {
									if (result.resCode == 200) {
										$rootScope.addAlert("success", "禁用成功");
										$scope.queryUserList();
									}
								}, true, {
									ids : $scope.selection,
									flag : 0
								});
					}

					$scope.batchDelete = function() {
                        if ($scope.selection.length == 0) {
                            $rootScope.addAlert("error", "请选择用户!");
                            return;
                    }

						layer.confirm('确认要删除吗？', {
							btn: ['确定','取消'],
							title:"操作确认"
						}, function(flag){
							layer.close(flag);
							httpService.req("PUT", "/web/mdm/user/BatchDelete", {},
									function(result) {
										if (result.resCode == 200) {
											$rootScope.addAlert("success", "删除成功");
											$scope.queryUserList(true);
										}
									}, true, {
										ids : $scope.selection
									});
						});
					};

					$scope.resetPassword = function(id) {
						var list = [];
						list.push(id);
						httpService.req("PUT", "/web/mdm/user/ResetPassword/", {}, function(
								data) {
							if (data.resCode == 200) {
								/*$rootScope.addAlert("success",
										"密码重置成功，密码为" + data.data[0].newPassword);*/
								showBg("密码重置成功，密码为："+data.data[0].newPassword);
							}
						}, true,  {ids : list});
					};
					
					// 恢复数据
					$scope.repeatUser = function(cellPhone, id){
						layer.confirm('是否恢复用户？', {
							btn: ['确定','取消'],
							title:"操作确认"
						}, function(flag){
							layer.close(flag);
							
							httpService.req("POST", "/web/mdm/user/verifyPhoneNoS", {'cellPhone':cellPhone, 'id':id}, function(result) {
								var data = result.data, targetId = '';
								if (data != null) {
									layer.confirm('已存在相同手机号的用户，是否继续恢复用户？', {
										btn: ['确定','取消'],
										title:"操作确认"
									}, function(flag){
										layer.close(flag);
										targetId = data;
										$scope.recovery(id, targetId);
									});
								}else{
									$scope.recovery(id, targetId);
								}
							}, true);
						});
					};
					
					// 恢复数据操作
					$scope.recovery = function(id, targetId){
						httpService.req("POST", "/web/mdm/user/repeatUserInfo", {'userId':id, 'targetId':targetId}, function(result) {
							if (null != result && result.resCode == 200) {
								$rootScope.addAlert("success", "操作成功");
								$scope.queryUserList(true);
							}else{
								$rootScope.addAlert("error", "操作失败");
							}
						}, true);
					};
					
					// 分页
					$scope.currentPage = 0;
					$scope.maxSize = 10;
					$scope.setPage = function(pageNo) {
						$scope.currentPage = pageNo;
					};
					$scope.pageChanged = function(pageNo) {
						$scope.queryParams.lastPageNum = $scope.queryParams.pageNum;//上一次的页码
						$scope.queryParams.pageNum = pageNo;
						$scope.queryUserList();// 这里需要改为当前查询的请求方法
					};
				});
