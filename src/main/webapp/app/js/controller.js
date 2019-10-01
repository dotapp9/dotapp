  
  var mainMenuItems = [];
  $('#cnfrmPswd').onComplete= function() {
	  alert('Hi');
  };
  $( "#cnfrmPswdtd" ).focusout(function() {
	  if($('#pswd').val() !== $('#cnfrmPswd').val()){
		  alert('Passwords should be matched');
	  }
  })
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
			continue;
		}
		$('#'+menuItem.id).hide();
		removeActive($('#'+menuItem.id+'Tab'));
	  }
  }
  
  function doLogin(elem){
	  ApiService.getQuery(document.loginPanel, 'select sId, roleName, sFirstName, sLastName from staff where sId=$Login and sPswd=$Password and roleName=$Selection', '/api/1/auth', function(responseData, status){
		if(responseData.length>0){
			$('#loginPanel').hide();
			if('admin' === responseData[0].roleName.toLowerCase()){
				addMenu('admin');
				openMenu({parentElement:{id:'pkgTab'}});
			}else if('sales' === responseData[0].roleName.toLowerCase()){
				addMenu('sales');
				openMenu({parentElement:{id:'salTab'}});
			}else{
			}
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
		  var salesMenuItems = [{'id': 'sal', desc:'Inquiry'}, {'id': 'booking', desc:'Booking'}, {'id': 'pmt', desc:'Paments'}, {'id': 'pkg', desc:'Package'}, {'id': 'inv', desc:'Invoice'}];
		  mainMenuItems = salesMenuItems;
	  }
	  buildMenu(mainMenuItems);
  }
  function openSubMenu(parentid, show, hide){
	  $('#'+parentid+' #'+show).show();
	  $('#'+parentid+' #'+hide).hide();
  }
  function addPkg(){
	$('#pkgEntry #h').text("Add Package");
	addPkgEntry();
  }
  function addPkgEntry(){
	$('#enqPackages').hide();
	$('#pkgEntry').show();
  }
  function enquiryPkg(){
	  $('#pkg #add').hide();
	  ApiService.getQuery(document.loginPanel, 'select Tour_Id,Tour_Name, Gst_Number,Per,date_of_Travel,No_Of_Passengers,No_Of_Adult,No_Of_Child,Tour_Cost_Per_Adult,Tour_Cost_Per_Adult_With_Twin_Share_Base,Tour_Cost_Per_Adult_With_Triple_Share_Base,Child_With_Bed,Child_Without_Bed,infant_Cost,No_Of_days,countries_visiting,Description,Per_Child,Per_Adult,Per_Infant from tour_package', '/api/1/tour_package', function(responseData, status){
	  var pkgs = responseData;
	  var visibleCols = ['Tour_Name', 'date_of_Travel', 'No_Of_Passengers', 'No_Of_days'];
	  createTableFromJSON('showAllPackages', pkgs, function(row, tableData){
		$('#pkg #add #h').text("Package Details");
			addPkgFillEntry(tableData[row.rowIndex-1]);
			$('#pkg #newBtn').click();
			//addPkgEntry();
		}, visibleCols);
	  $('#pkg #enq').show();
	  }, function(){

	  });
  }
  function addPkgFillEntry(tableData){
	  for(var key in tableData){
		  var elemId = 'input[name='+key+']';
		  $('#pkg #add '+elemId).val(tableData[key]);
		  $('#pkg #add #pkgBtn').text('Modify');
		  $('#pkg #add #pkgDelBtn').show();
	  }
  }
  function addStfFillEntry(tableData){
	  for(var key in tableData){
		  var elemId = 'input[name='+key+']';
		  $('#stf #add '+elemId).val(tableData[key]);
		  $('#stf #add #addBtn').text('Modify');
		  $('#stf #add #delBtn').show();
	  }
  }
  function addFillEntry(id, tableData, lblHdr){
	  $(id+' #add #h').text(lblHdr);
	  for(var key in tableData){
		  var elemId = 'input[name='+key+']';
		  $(id+' #add '+elemId).val(tableData[key]);
		  $(id+' #add #addBtn').text('Modify');
		  $(id+' #add #delBtn').show();
	  }
  }
  function closeBox2(cntrl, callback){
	  cntrl.hide();
	  callback();
  }
  function showViewStaff(){
	$('#stf #add').hide();
	$('#stf #enq').show();
	ApiService.getQuery(document.loginPanel, 'select sId, sFirstName, sLastName, sBirthDate, sMobile, sBranch, sHno, sStreet, sCity, sState, sZipCode from staff', '/api/1/staff', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllStaff', staffData, function(row, tableData){
		addStaff("Staff Details");
		addStfFillEntry(tableData[row.rowIndex-1]);
		$('#stf #add').show();
		$('#stf #enq').hide();
	});
	}, function(responseData, status){
		
	});
}
function loadStateMaster(id){
	if($(id+' #sBranch').prop('options').length == 0){
		ApiService.getQuery([], 'select stateName, stateDesc from statemaster', '/api/1/statemaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				$(id+' #sBranch').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
				$(id+' #sState').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
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
				$(id+' #roleName').append('<option value="'+item.roleName+'">'+item.roleDesc+'</option>');
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
				$(id+' #sCity').append('<option value="'+item.cityName+'">'+item.cityDesc+'</option>')
			}
		},function(responseData, status){
			
		});	
	}	
}
/*function addStaff(hdrLbl){
	$('#stf #view').hide();
	$('#stf #add #h').text(hdrLbl);
	if($('#roleName').prop('options').length == 0){
	ApiService.getQuery([], 'select roleName, roleDesc from rolemaster', '/api/1/rolemaster', function(responseData, status){
		for(var idx=0; idx<responseData.length; idx++){
			var item = responseData[idx];
			$('#roleName').append('<option value="'+item.roleName+'">'+item.roleDesc+'</option>');
		}
	},function(responseData, status){
		
	});
	}
	if($('#sBranch').prop('options').length == 0){
		ApiService.getQuery([], 'select stateName, stateDesc from statemaster', '/api/1/statemaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				$('#sBranch').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
				$('#sState').append('<option value="'+item.stateName+'">'+item.stateDesc+'</option>');
			}
		},function(responseData, status){
			
		});
	}
	if($('#sCity').prop('options').length == 0){
		ApiService.getQuery([], 'select cityName, cityDesc from citymaster', '/api/1/citymaster', function(responseData, status){
			for(var idx=0; idx<responseData.length; idx++){
				var item = responseData[idx];
				$('#sCity').append('<option value="'+item.cityName+'">'+item.cityDesc+'</option>')
			}
		},function(responseData, status){
			
		});	
	}
	$('#stf #add').show();
	
}*/
function loadEnqSales(){
	var salesData = myBooks;
	createTableFromJSON('showAllSales', salesData, function(row, tableData){
		
	});
}
function logoutLogin(){
	//$('#main').hide();
	//$('#loginPanel').show();
	location.reload();
}
window.onpopstate = function() {
		location.href;
       alert("clicked back button "+location.hash);
    }; history.pushState({}, '');
  function submitPackage(){
	  ApiService.post(document.packages, 'tour_package', '/api/1/tour_package', function(){
		alert("Package Created Successfully.");
		enquiryPkg();
	  }, function(){
		
	  });
  }
  function submitStaff(){
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
function bookingDetails(){
	$('#booking #add').hide();
	$('#booking #enq').show();
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales_enq', '/api/1/sales_enq', function(responseData, status){
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
	ApiService.getQuery(document.loginPanel, 'select DATE_OF_QUERY, CLIENT_NAME, CONTACT_NUMBER, EMAIL_ID, DESTINATION, DATE_OF_TRAVEL, CURRENT_STATUS_OF_THE_QUERY, EXPECTED_CLOSURE_DATE, REMARKS from sales_enq', '/api/1/sales_enq', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllPayments', staffData, function(row, tableData){
		addFillEntry('#pmt', tableData[row.rowIndex-1], "Payment Details");
		$('#pmt #add').show();
		$('#pmt #enq').hide();
	});
	}, function(responseData, status){
		
	});	
}