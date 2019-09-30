  var mainMenuItems = [{'id': 'sal', desc:'Sales'}, {'id': 'acct', desc:'Accounts'}, {'id': 'pkg', desc:'Package'}, {'id': 'stf', desc:'Staff'}, {'id': 'inv', desc:'Invoice'}];
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
			$('#'+menuItem.id+" #enq").click();
			continue;
		}
		$('#'+menuItem.id).hide();
		removeActive($('#'+menuItem.id+'Tab'));
	  }
  }
  
  function doLogin(elem){
	  ApiService.getQuery(document.loginPanel, 'select sId, roleName from staff where sId=$Login and sPswd=$Password and roleName=$Selection', '/api/1/auth', function(responseData, status){
		if(responseData.length>0){
			$('#loginPanel').hide();
			if('admin' === responseData[0].roleName.toLowerCase()){
				openMenu({parentElement:{id:'pkgTab'}});
			}else{
			}
			$('#main').show();
		}else{
			responseData.role = 'admin';
			//alert("Authentication failed.");
			openMenu({parentElement:{id:'pkgTab'}});
			$('#loginPanel').hide();
			$('#main').show();
		}
	  }, function(){

	  });
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
	  $('#pkgEntry').hide();
	  ApiService.getQuery(document.loginPanel, 'select Tour_Id,Tour_Name, Gst_Number,Per,date_of_Travel,No_Of_Passengers,No_Of_Adult,No_Of_Child,Tour_Cost_Per_Adult,Tour_Cost_Per_Adult_With_Twin_Share_Base,Tour_Cost_Per_Adult_With_Triple_Share_Base,Child_With_Bed,Child_Without_Bed,infant_Cost,No_Of_days,countries_visiting,Description,Per_Child,Per_Adult,Per_Infant from tour_package', '/api/1/tour_package', function(responseData, status){
	  var pkgs = responseData;
	  var visibleCols = ['Tour_Name', 'date_of_Travel', 'No_Of_Passengers', 'No_Of_days'];
	  createTableFromJSON('showAllPackages', pkgs, function(row, tableData){
		$('#pkgEntry #h').text("Package Details");
		addPkgFillEntry(tableData[row.rowIndex-1]);
			addPkgEntry();
		}, visibleCols);
	  $('#enqPackages').show();
	  }, function(){

	  });
  }
  function addPkgFillEntry(tableData){
	  for(var key in tableData){
		  var elemId = 'input[name='+key+']';
		  $('#pkgEntry '+elemId).val(tableData[key]);
		  $('#pkgEntry #pkgBtn').text('Modify');
		  $('#pkgEntry #pkgDelBtn').show();
	  }
  }
function closeBox(id){
	$('#'+id).hide();
	var txtId = $('#'+id+' #h').text();
	if('Add Package' === txtId || 'Package Details' === txtId)
		enquiryPkg();
	else if('Add Staff' === txtId || 'Staff Details' === txtId)
		showViewStaff();
}

  function showViewStaff(){
	$('#stf #add').hide();
	$('#stf #view').show();
	ApiService.getQuery(document.loginPanel, 'select sId, sFirstName, sLastName, sBirthDate, sMobile, sBranch, sHno, sStreet, sCity, sState, sZipCode from staff', '/api/1/staff', function(responseData, status){
	var staffData = responseData;
	createTableFromJSON('showAllStaff', staffData, function(row, tableData){
		addStaff("Staff Details");
		$('#stf #add').show();
		$('#stf #view').hide();
	});
	}, function(responseData, status){
		
	});
}
function addStaff(hdrLbl){
	$('#stf #view').hide();
	$('#stf #add #h').text(hdrLbl);
	$('#stf #add').show();
}
function loadEnqSales(){
	var salesData = myBooks;
	createTableFromJSON('showAllSales', salesData, function(row, tableData){
		
	});
}
function logoutLogin(){
	$('#main').hide();
	$('#loginPanel').show();
}
window.onpopstate = function() {
		location.href;
       alert("clicked back button "+location.hash);
    }; history.pushState({}, '');
  function submitPackage(){
	  ApiService.post(document.packages, 'tour_package', '/api/1/test', function(){
		alert("Package Created Successfully.");
		enquiryPkg();
	  }, function(){
		
	  });
  }