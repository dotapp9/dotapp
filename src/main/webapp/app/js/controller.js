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
			$('#userName').attr('userId', responseData[0].sId);
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
	  createTableFromJSON('#pkg #enq', pkgs, function(row, tableData){
		  $('#pkg #newBtn').click();
		  $('#pkg #add #Tour_Name').attr('readOnly','readOnly');
			addFillEntry('#pkg', tableData[row], "Package Details");
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
			  var length = $(id+' #add select[name='+key+'] > option').length;
			  if(length > 0){
				  var selectCntrl = $(id+' #add select[name='+key+'] > option[value='+tableData[key]+']');
				  if(selectCntrl.length > 0){
					  selectCntrl.attr('selected', 'selected');
					  console.log(key + ' selected');
				  }
			  }else{
				  $(id+' #add #tmp'+key).val(tableData[key]);
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

  function showViewStaff(){
	$('#stf #add').hide();
	$('#stf #enq').show();
	ApiService.getQuery(document.loginPanel, 'select sId, sFirstName, sLastName, sBirthDate, isDisabled, sMobile, sBranch, sHno, sStreet, sCity, sState, sZipCode, roleName from staff', '/api/1/staff', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('#stf #enq', staffData, function(row, tableData){
		var frmData = tableData[row];
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
	ApiService.getQuery(document.loginPanel, 'select date_of_query, client_name, contact_number, email_id, destination, date_of_travel, current_status_of_the_query, expected_closure_date, remarks from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('#sal #enq', staffData, function(row, tableData){
		var frmData = tableData[row];
		$('#sal #newBtn').click();
		addFillEntry('#sal', frmData, "SalesInquiry Details");
		$('#sal #add #client_name').attr('readOnly','readOnly');
		$('#sal #enq').hide();
	});
	}, function(responseData, status){
		
	});
}
function submitSalesEnq(event){
	var btntxt = event.innerText;
	document.salesinq.sId.value = $('#userName').attr('userId');
	  if(btntxt === 'Create'){
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
	  }else{
		  ApiService.put(document.salesinq, ['client_name'], 'sales', '/api/1/sales', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Sales Enquiry Updated Successfully.");
					 enquiryDetails();
					 return;
				 }
			  }
			  alert("Sales Enquiry Update failed.");
			  }, function(){
				  alert("Sales Enquiry Update failed.");
			  });		  
	  }	  
}
function submitBooking(event){
	var btntxt = event.innerText;
	document.bookinginq.sId.value = $('#userName').attr('userId');
	  if(btntxt === 'Create'){
		  ApiService.post(document.bookinginq, 'bookings', '/api/1/bookings', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Booking Created Successfully.");
					 bookingDetails();
					 return;
				 }
			  }
			  alert("Booking Creation failed.");
			  }, function(){
				  alert("Booking Creation failed.");
			  });
	  }else{
		  ApiService.put(document.bookinginq, ['client_name'], 'bookings', '/api/1/bookings', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 alert("Booking Updated Successfully.");
					 bookingDetails();
					 return;
				 }
			  }
			  alert("Booking Update failed.");
			  }, function(){
				  alert("Booking Update failed.");
			  });		  
	  }	 	
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
	ApiService.getQuery(document.bookinginq, 'select Tour_Name, client_name, contact_number, email_id, destination, sHno, sStreet, sCity, sState, sZipCode from bookings', '/api/1/bookings', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('#booking #enq', staffData, function(row, tableData){
		var frmData = tableData[row];
		$('#booking #newBtn').click();
		addFillEntry('#booking', frmData, "Booking Details");
		$('#booking #add #client_name').attr('readOnly','readOnly');
		$('#booking #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
function pmtDetails(){
	$('#pmt #add').hide();
	$('#pmt #enq').show();
	ApiService.getQuery(document.loginPanel, 'select date_of_query, client_name, contact_number, email_id, destination, date_of_travel, current_status_of_the_query, expected_closure_date, remarks from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('#pmt #enq', staffData, function(row, tableData){
		addFillEntry('#pmt', tableData[row], "Payment Details");
		$('#pmt #add').show();
		$('#pmt #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
function acctDetails(){
	$('#acct #add').hide();
	$('#acct #enq').show();
	ApiService.getQuery(document.loginPanel, 'select date_of_query, client_name, contact_number, email_id, destination, date_of_travel, current_status_of_the_query, expected_closure_date, remarks from sales', '/api/1/sales', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('#acct #enq', staffData, function(row, tableData){
		addFillEntry('#acct', tableData[row], "Account Details");
		$('#acct #add').show();
		$('#acct #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}
$.fn.clearForm = function() {
	  return this.each(function() {
	    var type = this.type, tag = this.tagName.toLowerCase();
	    if (tag == 'form')
	      return $(':input',this).clearForm();
	    if (type == 'text' || type == 'password' || type == 'number' || type == 'date' || tag == 'textarea')
	      this.value = '';
	    else if (type == 'checkbox' || type == 'radio')
	      this.checked = false;
	    else if (tag == 'select')
	      this.selectedIndex = -1;
	  });
	};
function clearForm(id){
	$(id).trigger('reset');
	//$(id).clearForm();
}
function closeBox2(cntrl, callback){
	  cntrl.hide();
	  callback();
}
function loadNewEntryForm(moduleId, frmName, lblHdr, id, contrls){
	clearForm(moduleId+' form[name='+frmName+']');
	//clearForm(moduleId+' #'+frmName);
	openSubMenu(moduleId,'add','enq');
	$(moduleId+' #isDisable').hide();
	$(moduleId+' #add #h').text(lblHdr);
	$(moduleId+' #add #addBtn').text('Create');
	$(moduleId+' #add #delBtn').hide();
	$(moduleId+' #add '+id).removeAttr('readOnly');
	if(contrls !== undefined && contrls !== null){
		for(var idx=0; idx<contrls.length; idx++){
			var contrl = contrls[idx];
			contrl(moduleId);
		}
	}
	console.log('loadNewEntryForm Called');
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
function deleteSales(){
	document.salesinq.sId.value = $('#userName').attr('userId');
	  ApiService.remove(document.salesinq, ['client_name', 'sId'], 'sales', '/api/1/sales', function(responseData, status){
		  if(responseData.length > 0 ){
			 if(responseData[0]['record_count'] > 0){
				 alert("Sales Inquiry deletion Successfully.");
				 enquiryDetails();
				 return;
			 }
		  }
		  alert("Sales Inquiry deletion failed.");
		  }, function(){
			  alert("Sales Inquiry deletion failed.");
		  });	
}