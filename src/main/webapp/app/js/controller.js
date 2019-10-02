  var mainMenuItems = [];
  window.onpopstate = function() {
		location.href;
     alert("clicked back button "+location.hash);
  }; history.pushState({}, ''); 
  $('#cnfrmPswd').onComplete= function() {
	  alert('Hi');
  };
  $( "#cnfrmPswdtd" ).focusout(function() {
	  if($('#pswd').val() !== $('#cnfrmPswd').val()){
		  alert('Passwords should be matched');
	  }
  });
  function addActive(elem){
	  elem.addClass( "active" );
  }
  function removeActive(elem){
	  elem.removeClass( "active" );
  }

  function openMenu(id){
	  for(var idx=0;idx<mainMenuItems.length; idx++){
		  var menuItem = mainMenuItems[idx];
		if(id.parentElement.id.replace('Tab','') === menuItem.id){
			$('#'+menuItem.id).show();
			addActive($('#'+id.parentElement.id));
			$('#'+menuItem.id+" #enqBtn").click();
			addLeftMenu(menuItem);
			continue;
		}
		$('#'+menuItem.id).hide();
		removeActive($('#'+menuItem.id+'Tab'));
	  }
  }
  function addLeftMenu(menuItem){
	  if(menuItem.subMenu !== undefined){
		  $('#'+menuItem.id+' #newBtnTab').hide();
		  $('#'+menuItem.id+' #inqBtnTab').hide();
		  $('#'+menuItem.id+' #delBtnTab').hide();
		  for(var idx=0; idx<menuItem.subMenu.length; idx++){
			  var tem = menuItem.subMenu[idx];
			  $('#'+menuItem.id+' #'+tem).show();
		  }
	  }else{
		  $('#'+menuItem.id+' #newBtnTab').show();
		  $('#'+menuItem.id+' #inqBtnTab').show();
		  $('#'+menuItem.id+' #delBtnTab').show();
	  }
  }
  function doLogin(elem){
	  ApiService.getQuery(document.loginPanel, 'select sId, roleName, sFirstName, sLastName, isDisabled from staff where sId=$Login and sPswd=$Password and roleName=$Selection', '/api/1/auth', function(responseData, status){
		if(responseData.length>0){
			if('0' !== responseData[0].isDisabled){
				alert("User has been Locked.");
				return;
			}
			if('admin' === responseData[0].roleName.toLowerCase()){
				addMenu('admin');
				openMenu({parentElement:{id:'pkgTab'}});
			}else if('sales' === responseData[0].roleName.toLowerCase()){
				addMenu('sales');
				openMenu({parentElement:{id:'salTab'}});
			}else{
			}
			$('#loginPanel').hide();
			$('#userName').text(responseData[0].sFirstName+' '+responseData[0].sLastName);
			$('#main').show();
		}else{
			alert("Authentication failed.");
		}
	  }, function(){
		  alert("Authentication failed.");
	  });
  }
  function addMenu(id){
	  if(id === 'admin'){
		  var adminMenuItems = [{'id': 'sal', desc:'Sales'}, {'id': 'acct', desc:'Accounts'}, {'id': 'pkg', desc:'Package'}, {'id': 'stf', desc:'Staff'}, {'id': 'inv', desc:'Invoice'}];
		  mainMenuItems = adminMenuItems;
		  
	  }else if(id==='sales'){
		  var salesMenuItems = [{'id': 'sal', desc:'Inquiry'}, {'id': 'booking', desc:'Booking'}, {'id': 'pmt', desc:'Paments'}, {'id': 'pkg', desc:'Package', 'subMenu' : ['inqBtnTab']}, {'id': 'inv', desc:'Invoice'}];
		  mainMenuItems = salesMenuItems;
	  }
	  buildMenu(mainMenuItems);
  }
  function openSubMenu(parentid, show, hide){
	  $(parentid+' #'+show).show();
	  $(parentid+' #'+hide).hide();
  }
  function enquiryPkg(){
	  $('#pkg #add').hide();
	  $('#pkg #enq').show();
	  ApiService.getQuery(document.loginPanel, 'select Tour_Id,Tour_Name, Gst_Number,Per,date_of_Travel,No_Of_Passengers,No_Of_Adult,No_Of_Child,Tour_Cost_Per_Adult,Tour_Cost_Per_Adult_With_Twin_Share_Base,Tour_Cost_Per_Adult_With_Triple_Share_Base,Child_With_Bed,Child_Without_Bed,infant_Cost,No_Of_days,countries_visiting,Description,Per_Child,Per_Adult,Per_Infant from tour_package', '/api/1/tour_package', function(responseData, status){
	  var pkgs = responseData;
	  var visibleCols = ['Tour_Name', 'date_of_Travel', 'No_Of_Passengers', 'No_Of_days'];
	  createTableFromJSON('showAllPackages', pkgs, function(row, tableData){
		  $('#pkg #newBtn').click();
		  $('#pkg #add #Tour_Name').attr('readOnly','readOnly');
			addFillEntry('#pkg', tableData[row.rowIndex-1], "Package Details");
			$('#pkg #enq').hide();
		}, visibleCols);
	  }, function(){

	  });
  }

  function addFillEntry(id, tableData, lblHdr){
	  $(id+' #add #h').text(lblHdr);
	  for(var key in tableData){
		  var elemId = 'input[name='+key+']';
		  var ipType = $(id+' #add '+elemId).attr('type');
		  console.log('ipType :: '+ipType);
		  if('checkbox' === ipType){
			  if('1' === tableData.isDisabled)
				  $(id+' #add '+elemId).attr('checked', 'checked');
			  else
				  $(id+' #add '+elemId).removeAttr('checked');
		  }else if(ipType === undefined){
			  var length = $('#add select[name='+key+'] > option').length;
			  if(length > 0){
				  $(id+ '#add select[name='+key+'] > option[value='+tableData[key]+']').attr('selected', 'selected');
			  }else{
				  $(id+' #add #tmp'+key).val(tableData[key]);
				  var selectBranch = $(id+' #add #tmp'+key).val();
				  console.log(selectBranch);
			  }
		  }else{
			  $(id+' #add '+elemId).val(tableData[key]);
		  }
		  $(id+' #add #pswd').val('******');
		  $(id+' #add #cnfrmPswd').val('******');
	  }
	  $(id+' #add #addBtn').text('Modify');
	  $(id+' #add #delBtn').show();
  }
  function closeBox2(cntrl, callback){
	  cntrl.hide();
	  callback();
  }
  function showViewStaff(){
	  
	$('#stf #add').hide();
	$('#stf #enq').show();
	ApiService.getQuery(document.loginPanel, 'select sId, sFirstName, sLastName, sBirthDate, isDisabled, sMobile, sBranch, sHno, sStreet, sCity, sState, sZipCode, roleName from staff', '/api/1/staff', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllStaff', staffData, function(row, tableData){
		var frmData = tableData[row.rowIndex-1];
		if(frmData.isDisabled !== '0'){
			$('#stf #add #isDisable input[type=checkbox]').attr('checked', 'checked');
		}
		$('#stf #newBtn').click();
		addFillEntry('#stf', frmData, "Staff Details");
		$('#stf #add #sId').attr('readOnly','readOnly');
		$('#stf #add #isDisable').show(0);
		
		$('#stf #enq').hide();
	});
	}, function(responseData, status){
		
	});
}

  function loadBranchMaster(id){
		if($(id+' #sBranch').prop('options').length == 0){
			ApiService.getQuery([], 'select stateName, stateDesc from statemaster', '/api/1/statemaster', function(responseData, status){
				for(var idx=0; idx<responseData.length; idx++){
					var item = responseData[idx];
					var selectValue = $(id+' #add #tmpsBranch').val();
					if(item.stateName === selectValue){
						$(id+' #sBranch').append('<option value="'+item.stateName+'" selected>'+item.stateDesc+'</option>');
					}else{
						$(id+' #sBranch').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
					}
				}
			},function(responseData, status){
				
			});
		}	
	}
function loadStateMaster(id){
	if($(id+' #sState').prop('options').length == 0){
		ApiService.getQuery([], 'select stateName, stateDesc from statemaster', '/api/1/statemaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				var selectValue = $(id+' #add #tmpsState').val();
				if(item.stateName === selectValue){
					$(id+' #sState').append('<option value="'+item.stateName+'" selected>'+item.stateDesc+'</option>');
				}else{
					$(id+' #sState').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
				}
			}
		},function(responseData, status){
			
		});
	}	
}
function loadRoleMaster(id){
	if($(id+' #roleName').prop('options').length == 0){
		ApiService.getQuery([], 'select roleName, roleDesc from rolemaster', '/api/1/rolemaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				var selectValue = $(id+' #add #tmproleName').val();
				if(item.roleName === selectValue){
					$(id+' #roleName').append('<option value="'+item.roleName+'" selected>'+item.roleDesc+'</option>');
				}else{
					$(id+' #roleName').append('<option value="'+item.roleName+'">'+item.roleDesc+'</option>');
				}
			}
		},function(responseData, status){
			
		});
	}	
}
function loadCityMaster(id){
	if($(id+' #sCity').prop('options').length == 0){
		ApiService.getQuery([], 'select cityName, cityDesc from citymaster', '/api/1/citymaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				var selectValue = $(id+' #add #tmpsCity').val();
				if(item.cityName === selectValue){
					$(id+' #sCity').append('<option value="'+item.cityName+'" selected>'+item.cityDesc+'</option>');
				}else{
					$(id+' #sCity').append('<option value="'+item.cityName+'">'+item.cityDesc+'</option>');
				}
			}
		},function(responseData, status){
			
		});	
	}	
}

function loadEnqSales(){
	var salesData = myBooks;
	createTableFromJSON('showAllSales', salesData, function(row, tableData){
		
	});
}
function logoutLogin(){
	location.reload();
}

  function submitPackage(event){
	  var btntxt = event.innerText;
	  if(btntxt === 'Create'){
		  ApiService.post(document.packages, 'tour_package', '/api/1/tour_package', function(){
			alert("Package Created Successfully.");
			enquiryPkg();
		  }, function(){
			
		  });
	  }else{
		  ApiService.put(document.packages, ['Tour_Name'], 'tour_package', '/api/1/tour_package', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Package Updated Successfully.");
					 enquiryPkg();
					 return;
				 }
			  }
			  alert("Staff failed.");
			  }, function(){
				
			  });		  
	  }
  }
  function submitStaff(){
	  var oprDesc = $('#stf #add #h').text();
	  if('Create Staff' === oprDesc){
		  document.staff.sPswd.value = document.staff.pswd.value;
		  ApiService.post(document.staff, 'staff', '/api/1/staff', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Staff Created Successfully.");
					 showViewStaff();
					 return;
				 }
			  }
			  alert("Staff failed.");
			  }, function(){
				
			  });
	  }else if('Staff Details' === oprDesc){
		  var passwd = document.staff.pswd.value;
		  if('******' !== passwd){
			  document.staff.sPswd.value = document.staff.pswd.value;
		  }else{
			  document.staff.sPswd.value = undefined;
		  }
		  ApiService.put(document.staff, ['sId'], 'staff', '/api/1/staff', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Staff Created Successfully.");
					 showViewStaff();
					 return;
				 }
			  }
			  alert("Staff failed.");
			  }, function(){
				
			  });		  
	  }
  }
function enquiryDetails(){
	$('#sal #add').hide();
	$('#sal #enq').show();
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllSalesInq', staffData, function(row, tableData){
		addFillEntry('#sal', tableData[row.rowIndex-1], "SalesInquiry Details");
		$('#sal #add').show();
		$('#sal #enq').hide();
	});
	}, function(responseData, status){
		
	});
}
function submitSalesEnq(){
  ApiService.post(document.salesinq, 'sales', '/api/1/sales', function(responseData, status){
	  if(responseData.length > 0 ){
		 if(responseData[0]['record_count'] > 0){
			 alert("Sales Enquiry Created Successfully.");
			 enquiryDetails();
			 return;
		 }
	  }
	  alert("Sales Enquiry Creation failed.");
	  }, function(){
		  alert("Sales Enquiry Creation failed.");
	  });	
}
function loadPackageIds(){
	if($('#booking #Tour_Name').prop('options').length == 0){
		ApiService.getQuery([], 'select Tour_Id, Tour_Name from tour_package', '/api/1/tour_package', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				$('#booking #Tour_Name').append('<option value="'+item.Tour_Id+'">'+item.Tour_Name+'</option>');
			}
		},function(responseData, status){
			
		});
	}	  
}
function bookingDetails(){
	$('#booking #add').hide();
	$('#booking #enq').show();
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllBooking', staffData, function(row, tableData){
		addFillEntry('#booking', tableData[row.rowIndex-1], "Booking Details");
		$('#booking #add').show();
		$('#booking #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
function pmtDetails(){
	$('#pmt #add').hide();
	$('#pmt #enq').show();
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllPayments', staffData, function(row, tableData){
		addFillEntry('#pmt', tableData[row.rowIndex-1], "Payment Details");
		$('#pmt #add').show();
		$('#pmt #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
function acctDetails(){
	$('#acct #add').hide();
	$('#acct #enq').show();
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllAccounts', staffData, function(row, tableData){
		addFillEntry('#acct', tableData[row.rowIndex-1], "Account Details");
		$('#acct #add').show();
		$('#acct #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
function clearForm(id){
	$(id).trigger('reset');
}
function loadNewEntryForm(moduleId, frmName, lblHdr, id, contrls){
	$(moduleId+' #isDisable').hide();
	$(moduleId+' #add #h').text(lblHdr);
	$(moduleId+' #add '+id).removeAttr('readOnly');
	clearForm(moduleId+' form[name='+frmName+']');
	openSubMenu(moduleId,'add','enq');
	if(contrls !== undefined && contrls !== null){
		for(var idx=0; idx<contrls.length; idx++){
			var contrl = contrls[idx];
			contrl(moduleId);
		}
	}
	$(id+' #add #addBtn').text('Create');
}

function deleteStaff(){
	if(document.staff.sId.value.toLowerCase() === 'Admin'.toLowerCase()){
		alert('Admin User Cannot be removed');
		showViewStaff();
		return;
	}
  ApiService.remove(document.staff, ['sId'], 'staff', '/api/1/staff', function(responseData, status){
	  if(responseData.length > 0 ){
		 if(responseData[0]['record_count'] > 0){
			 alert("Staff deletion Successfully.");
			 showViewStaff();
			 return;
		 }
	  }
	  alert("Staff deletion failed.");
	  }, function(){
		  alert("Staff deletion failed.");
	  });	
}
function deletePackage(){
  ApiService.remove(document.packages, ['Tour_Name'], 'tour_package', '/api/1/tour_package', function(responseData, status){
	  if(responseData.length > 0 ){
		 if(responseData[0]['record_count'] > 0){
			 alert("Package deletion Successfully.");
			 enquiryPkg();
			 return;
		 }
	  }
	  alert("Package deletion failed.");
	  }, function(){
		  alert("Package deletion failed.");
	  });	
}