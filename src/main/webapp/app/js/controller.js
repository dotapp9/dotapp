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
		  AlertDialog.show('Info', 'Passwords should be matched');
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
	  document.loginPanel.reportValidity();
	  if(!document.loginPanel.checkValidity())
		  return;
	  ApiService.getQuery(document.loginPanel, 'select sId, roleName, sFirstName, sLastName, isDisabled from staff where sId=$Login and sPswd=$Password and roleName=$Selection', '/api/1/auth', function(responseData, status){
		if(responseData.length>0){
			if('0' !== responseData[0].isDisabled){
				AlertDialog.show('Error', "User has been Locked.");
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
			AlertDialog.show('Error', 'Authentication failed.');
		}
	  }, function(){
		  AlertDialog.show('Error', 'Authentication failed.');
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
  function enquiryPkg(frm){
	  var searchBarData = [{'id':'Tour_Name','title':'Tour Name', 'type':'text'}, {'id':'date_of_Travel', 'title': 'Date Of Travel', 'type': 'date'}];
	  addSearchBar('pkg', searchBarData, function(event){
		onOrOffControls('#pkg #enq', searchBarData, false, document.pkgSearch);
		onOrOffControls('#pkg #enq', [findControl(event.target.value, searchBarData)], true, document.pkgSearch);
	  }, function(event){
		  document.pkgSearch.reportValidity();
		  if(!document.pkgSearch.checkValidity())
			  return;
		  TourPackage.get(document.pkgSearch, searchBarData);
	  });	  
	  $('#pkg #add').hide();
	  $('#pkg #enq').show();
	  TourPackage.get(frm);
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
  function onOrOffControls(id, controls, isOn, frm){
	  $.each(controls, function(idx, item){
		  if(isOn){
			  $(id+' #'+item.id).show();
			  $(id+' #'+item.id).attr('required', 'required');
		  }else{
			  if(frm !== undefined)
				  frm[item.id].value = '';
			  //$(id+' #'+item.id).removeAttr('name');
			  $(id+' #'+item.id).hide();
			  $(id+' #'+item.id).removeAttr('required');
		  }
	  });
  }
  function findControl(id, controls){
	  var selected;
	  $.each(controls, function(idx, item){
		  if(id === item.id){
			  selected = item;
			  return true;
		  }
	  });
	  return selected;
  }
  function showViewStaff(){
	  var searchBarData = [{'id':'sFirstName','title':'First Name', 'type':'text'}, {'id':'sBirthDate', 'title': 'Date Of Birth', 'type': 'date'}, {'id':'sMobile', 'title': 'Mobile Number', 'type': 'number'}];
	  addSearchBar('stf', searchBarData, function(event){
		onOrOffControls('#stf #enq', searchBarData, false, document.stfSearch);
		onOrOffControls('#stf #enq', [findControl(event.target.value, searchBarData)], true, document.stfSearch);
	  }, function(event){
		  document.stfSearch.reportValidity();
		  if(!document.stfSearch.checkValidity())
			  return;
		  Staff.get(document.stfSearch, searchBarData);
	  });	  
	$('#stf #add').hide();
	$('#stf #enq').show();
	Staff.get();
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

function logoutLogin(){
	location.reload();
}

  function submitPackage(event){
	  document.packages.reportValidity();
	  if(!document.packages.checkValidity())
		  return;
	  var btntxt = event.innerText;
	  if(btntxt === 'Create'){
		  TourPackage.add([document.packages], enquiryPkg);
	  }else{
		  TourPackage.modify([document.packages], enquiryPkg);
	  }
  }
  function submitStaff(){
	  document.staff.reportValidity();
	  if(!document.staff.checkValidity())
		  return;	  
	  var oprDesc = $('#stf #add #h').text();
	  if('Create Staff' === oprDesc){
		  document.staff.sPswd.value = document.staff.pswd.value;
		  Staff.add([document.staff], showViewStaff);
	  }else if('Staff Details' === oprDesc){
		  var passwd = document.staff.pswd.value;
		  if('******' !== passwd){
			  document.staff.sPswd.value = document.staff.pswd.value;
		  }else{
			  document.staff.sPswd.value = undefined;
		  }
		  Staff.modify([document.staff], showViewStaff);
	  }
  }
function enquiryDetails(){
	  var searchBarData = [{'id':'client_name','title':'Contact Name', 'type':'text'}, 
		  {'id':'date_of_Travel', 'title': 'Date Of Travel', 'type': 'date'},
		  {'id':'email_id', 'title': 'Email', 'type': 'email'},
		  {'id':'contact_number', 'title': 'Contact Number', 'type': 'number'}
	  ];
	  addSearchBar('sal', searchBarData, function(event){
		onOrOffControls('#sal #enq', searchBarData, false);
		onOrOffControls('#sal #enq', [findControl(event.target.value, searchBarData)], true);
	  }, function(event){
		  Sales.get(document.salSearch, searchBarData);
	  });	
	$('#sal #add').hide();
	$('#sal #enq').show();
	Sales.get();
}
function submitSalesEnq(event){
	  document.salesinq.reportValidity();
	  if(!document.salesinq.checkValidity())
		  return;	
	var btntxt = event.innerText;
	document.salesinq.sId.value = $('#userName').attr('userId');
	  if(btntxt === 'Create'){
		  Sales.add([document.salesinq], enquiryDetails);
	  }else{
		  Sales.modify([document.salesinq], enquiryDetails);
	  }	  
}
function submitAlertBooking(event, ind){
	if('basic' === ind){
		var ret = confirm('Do you want enter Passport Information');
		if (ret == true) {
			document.basicbooking.reportValidity();
			if(!document.basicbooking.checkValidity())
				  return;
			openPassptBooking();
		  } else {
			  submitBooking(event, [document.basicbooking]);
		  }
	}else{
		document.passportbooking.reportValidity();
		if(!document.passportbooking.checkValidity())
		  return;
		submitBooking(event, [document.basicbooking, document.passportbooking]);
	}	
}
function openBasicBooking(){
	loadNewEntryForm('#booking', 'basicbooking', 'Create Booking', '#client_name', [loadPackageIds, loadStateMaster, loadCityMaster]);
	$('#PassportInfo').hide();
	$('#BasicInfo').show();
}
function openPassptBooking(){
	var textInd = $('#booking #add #BasicInfo #h').text();
	if('Create Booking' === textInd)
		loadNewEntryForm('#booking', 'passportbooking', 'Enter Passport Details', '#client_name', [loadPackageIds, loadStateMaster, loadCityMaster]);
	else
		{
		$('#booking #add #PassportInfo #addBtn').text('Modify');
		$('#booking #add #PassportInfo #delBtn').show();
		}
	$('#BasicInfo').hide();
    $('#PassportInfo').show();
}
function submitBooking(event, request){
	var btntxt = event.innerText;
	document.basicbooking.sId.value = $('#userName').attr('userId');
	  if(btntxt === 'Create'){
		  Booking.add(request, bookingDetails);
	  }else{
		  Booking.modify(request, bookingDetails);
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
	  var searchBarData = [{'id':'Tour_Name','title':'Tour Name', 'type':'text'}, 
		  {'id':'client_name', 'title': 'Client Name', 'type': 'text'},
		  {'id':'email_id', 'title': 'Email', 'type': 'email'},
		  {'id':'contact_number', 'title': 'Contact Number', 'type': 'number'}
	  ];
	  addSearchBar('booking', searchBarData, function(event){
		onOrOffControls('#booking #enq', searchBarData, false, document.bookingSearch);
		onOrOffControls('#booking #enq', [findControl(event.target.value, searchBarData)], true, document.bookingSearch);
	  }, function(event){
		  Booking.get([document.bookingSearch], searchBarData);
	  });	
	$('#booking #add').hide();
	$('#booking #enq').show();
	Booking.get();
}
function pmtDetails(){
	  var searchBarData = [{'id':'date_of_query','title':'Date Of Query', 'type':'date'}, 
		  {'id':'client_name', 'title': 'Client Name', 'type': 'text'},
		  {'id':'email_id', 'title': 'Email', 'type': 'email'},
		  {'id':'contact_number', 'title': 'Contact Number', 'type': 'number'}
	  ];
	  addSearchBar('pmt', searchBarData, function(event){
		onOrOffControls('#pmt #enq', searchBarData, false);
		onOrOffControls('#pmt #enq', [findControl(event.target.value, searchBarData)], true);
	  });	
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
	AlertDialog.show('Info', 'Are you sure?', function(event){
	if(document.staff.sId.value.toLowerCase() === 'Admin'.toLowerCase()){
		AlertDialog.show('Info', 'Admin User Cannot be removed');
		showViewStaff();
		return;
	}
	Staff.remove(document.staff, showViewStaff);
	}, function(event){});
}
function deletePackage(){
	AlertDialog.show('Info', 'Are you sure?', function(event){
		TourPackage.remove(document.packages, enquiryPkg);
	}, function(event){});
}
function deleteSales(){
	AlertDialog.show('Info', 'Are you sure?', function(event){
		document.salesinq.sId.value = $('#userName').attr('userId');
		Sales.remove(document.salesinq, enquiryDetails);
	}, function(event){});
}
function doForgotPswd(){
	document.loginPanel.reportValidity();
	  if(!document.loginPanel.checkValidity())
		  return;	
	AlertDialog.show('Info', 'Password sent to Registered email.');
	ApiService.getQuery(document.loginPanel, 'select sMail from staff where sId=$Login', '/api/1/auth', function(responseData, status){
		if(responseData.length > 0 ){
			ApiService.sendMail({email : responseData[0].sMail}, '/api/1/sendMail', function(responseData, status){
				
			},function(responseData, status){});
		}
	}, function(responseData, status){});
}
$('#btnAuth').click(doLogin);
function findFormData(id, formData){
	formData.reportValidity();
	  if(!formData.checkValidity())
		  return;
	  switch(id){
	  	case 'pkg':
	  		TourPackage.get(formData);
	  		break;
	  }
}

var TourPackage = {
	add : function(data, callback){
	  ApiService.post(data, 'tour_package', '/api/1/tour_package', function(){
			AlertDialog.show('Info', 'Package Created Successfully.');
			callback();
		  }, function(){
			
		  });		
	},
	modify : function(data, callback){
		  ApiService.put(data, ['Tour_Name'], 'tour_package', '/api/1/tour_package', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Package Updated Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Staff failed.");
			  }, function(){
				
			  });		
	},
	get : function(data, whereData){
		$('#pkg #add').hide();
		  ApiService.getQueryWithCrit(data, 'Tour_Id,Tour_Name, Gst_Number,Per,date_of_Travel,No_Of_Passengers,No_Of_Adult,No_Of_Child,Tour_Cost_Per_Adult,Tour_Cost_Per_Adult_With_Twin_Share_Base,Tour_Cost_Per_Adult_With_Triple_Share_Base,Child_With_Bed,Child_Without_Bed,infant_Cost,No_Of_days,countries_visiting,Description,Per_Child,Per_Adult,Per_Infant', whereData, 'tour_package', '/api/1/tour_package', function(responseData, status){
			  var pkgs = responseData;
			  if(pkgs.length > 0){
			  $('#pkg #enq').show();
			  var visibleCols = ['Tour_Name', 'date_of_Travel', 'No_Of_Passengers', 'No_Of_days'];
			  createTableFromJSON('#pkg #enq', pkgs, function(row, tableData){
				  $('#pkg #newBtn').click();
				  $('#pkg #add #Tour_Name').attr('readOnly','readOnly');
					addFillEntry('#pkg', tableData[row], "Package Details");
					$('#pkg #enq').hide();
				}, visibleCols);	
			  }else{
				  AlertDialog.show('Info', 'No Records Found.');
			  }
		  }, function(responseData, status){
			  
		  });		
	},
	remove : function(data, callback){
	  ApiService.remove(data, ['Tour_Name'], 'tour_package', '/api/1/tour_package', function(responseData, status){
		  if(responseData.length > 0 ){
			 if(responseData[0]['record_count'] > 0){
				 AlertDialog.show('Info', "Package deletion Successfully.");
				 callback();
				 return;
			 }
		  }
		  AlertDialog.show('Error', "Package deletion failed.");
		  }, function(){
			  AlertDialog.show('Error', "Package deletion failed.");
		  });		
	}
};
var Staff = {
	add : function(data, callback){
		  ApiService.post(data, 'staff', '/api/1/staff', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Staff Created Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Staff failed.");
			  }, function(){
				
			  });		
	},
	modify : function(data, callback){
		  ApiService.put(data, ['sId'], 'staff', '/api/1/staff', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Staff Created Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Staff failed.");
			  }, function(){
				
			  });		
	},
	get : function(data, whereData){
		ApiService.getQueryWithCrit(data, 'sId, sFirstName, sLastName, sMail, sBirthDate, isDisabled, sMobile, sBranch, sHno, sStreet, sCity, sState, sZipCode, roleName', whereData, 'staff', '/api/1/staff', function(responseData, status){
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
	},
	remove : function(data, callback){
	  ApiService.remove(data, ['sId'], 'staff', '/api/1/staff', function(responseData, status){
		  if(responseData.length > 0 ){
			 if(responseData[0]['record_count'] > 0){
				 AlertDialog.show('Info', "Staff deletion Successfully.");
				 callback();
				 return;
			 }
		  }
		  AlertDialog.show('Error', "Staff deletion failed.");
		  }, function(){
			  AlertDialog.show('Error', "Staff deletion failed.");
		  });		
	}
};
var Sales = {
		add : function(data, callback){
		  ApiService.post(data, 'sales', '/api/1/sales', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Sales Enquiry Created Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Sales Enquiry Creation failed.");
			  }, function(){
				  AlertDialog.show('Error', "Sales Enquiry Creation failed.");
			  });			
		},
		modify : function(data, callback){
		  ApiService.put(data, ['client_name'], 'sales', '/api/1/sales', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Sales Enquiry Updated Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Sales Enquiry Update failed.");
			  }, function(){
				  AlertDialog.show('Error', "Sales Enquiry Update failed.");
			  });			
		},
		get : function(data, whereData){
			ApiService.getQueryWithCrit(data, 'date_of_query, client_name, contact_number, email_id, destination, date_of_travel, current_status_of_the_query, expected_closure_date, remarks', whereData, 'sales', '/api/1/sales', function(responseData, status){
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
		},
		remove : function(data, callback){
		  ApiService.remove(data, ['client_name', 'sId'], 'sales', '/api/1/sales', function(responseData, status){
			  if(responseData.length > 0 ){
				 if(responseData[0]['record_count'] > 0){
					 AlertDialog.show('Info', "Sales Inquiry deletion Successfully.");
					 callback();
					 return;
				 }
			  }
			  AlertDialog.show('Error', "Sales Inquiry deletion failed.");
			  }, function(){
				  AlertDialog.show('Error', "Sales Inquiry deletion failed.");
			  });		
		}
};
var Booking = {
	add : function(data, callback){
	  ApiService.post(data, 'bookings', '/api/1/bookings', function(responseData, status){
		  if(responseData.length > 0 ){
			 if(responseData[0]['record_count'] > 0){
				 AlertDialog.show('Info', "Booking Created Successfully.");
				 callback();
				 return;
			 }
		  }
		  AlertDialog.show('Error', "Booking Creation failed.");
		  }, function(){
			  AlertDialog.show('Error', "Booking Creation failed.");
		  });		
	},
	modify : function(data, callback){
	  ApiService.put(data, ['client_name'], 'bookings', '/api/1/bookings', function(responseData, status){
		  if(responseData.length > 0 ){
			 if(responseData[0]['record_count'] > 0){
				 AlertDialog.show('Info', "Booking Updated Successfully.");
				 callback();
				 return;
			 }
		  }
		  AlertDialog.show('Error', "Booking Update failed.");
		  }, function(){
			  AlertDialog.show('Error', "Booking Update failed.");
		  });		
	},
	get : function(data, whereData){
		ApiService.getQueryWithCrit(data, 'Tour_Name, client_name, contact_number, email_id, destination, sHno, sStreet, sCity, sState, sZipCode, Infant', whereData, 'bookings', '/api/1/bookings', function(responseData, status){
			var staffData = responseData;
			createTableFromJSON('#booking #enq', staffData, function(row, tableData){
				var frmData = tableData[row];
				$('#booking #newBtn').click();
				addFillEntry('#booking', frmData, "Booking Details");
				$('#booking #add #client_name').attr('readOnly','readOnly');
				$('#booking #enq').hide();
				$('#PassportInfo').hide();
				$('#BasicInfo').show();
			});
			}, function(responseData, status){
				
			});			
	},
	remove : function(){
		
	}
};