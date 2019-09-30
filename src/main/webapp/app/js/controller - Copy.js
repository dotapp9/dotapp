function aa()
{
 /*var x = document.getElementById("aa");
var y= document.getElementById("bb");
var z= document.getElementById("cc");
 y.style.display="none";
    x.style.display = "block";
    z.style.display="none";*/
	$('#bbView').hide();
}
function bb()
{
 var x = document.getElementById("bb");
var y = document.getElementById("aa");
var z= document.getElementById("cc");
y.style.display="none";
z.style.display="none";
x.style.display = "block";
$('#myTable').show();
$('#bbView').hide();
}
function cc()
{
 var x = document.getElementById("aa");
var y= document.getElementById("bb");
var z= document.getElementById("cc");
 y.style.display="none";
    x.style.display = "none";
    z.style.display="block";
	$('#bbView').hide();
}
  
  function alerts(){
   var input1 = document.getElementById('sid').value+"";
    var input2 = document.getElementById('psw').value;
	 var input3 = document.getElementById('fn').value+" ";
	 input3+= document.getElementById('ln').value;
	 var dob= document.getElementById('Date_Of_Birth').value;
		 var branch=document.getElementById('branch').value;
	   var input5 = document.getElementById('phn').value;
	    var address= document.getElementById('dn').value+", ";
	    address+= document.getElementById('sn').value+", ";
	    address+= document.getElementById('ct').value+", ";
	    address+= document.getElementById('st').value+", ";
	    address+= document.getElementById('pc').value+". ";
			alert(" Staff-Id:"+input1+"\n Password:"+input2+"\n branch:"+branch+"\n First Name:"+input3+"\n Phone Number:"+input5+"\n address:"+address);
  }
  function addActive(elem){
	  elem.addClass( "active" );
  }
  function removeActive(elem){
	  elem.removeClass( "active" );
  }
  function loadSales(event){
	  $('#sales').show();
	  hideStaff();
	  $('#packages').hide();
	  $('#invoice').hide();
	  addActive($('#salesTab'));
	  removeActive($('#staffTab'));
	  removeActive($('#packagesTab'));
	  removeActive($('#invoiceTab'));
	  loadEnqSales();
  }
  function loadAdminPackage(event){
	  $('#sales').hide();
	  hideStaff();
	  $('#packages').show();
	  $('#invoice').hide();
	  addActive($('#packagesTab'));
	  removeActive($('#staffTab'));
	  removeActive($('#salesTab'));
	  removeActive($('#invoiceTab'));
	  loadEnquiryPkgs();
  }
  function loadStaff(event){
	  $('#sales').hide();
	  $('#packages').hide();
	  $('#staff').show();
	  $('#invoice').hide();
	  addActive($('#staffTab'));
	  removeActive($('#packagesTab'));
	  removeActive($('#salesTab'));
	  removeActive($('#invoiceTab'));
  }
  function loadInvoice(event){
	  $('#sales').hide();
	  $('#packages').hide();
	  hideStaff();
	  $('#invoice').show();
	  addActive($('#invoiceTab'));
	  removeActive($('#packagesTab'));
	  removeActive($('#salesTab'));
	  removeActive($('#staffTab'));
  }
  hideStaff();
  $('#packages').hide();
  $('#sales').hide();
  $('#invoice').hide();
  function hideStaff(){
	  $('#staff').hide();
	  $('#viewStaff').hide();
  }
  function showViewStaff(){
	$('#addStaff').hide();
	$('#viewStaff').show();
	var myBooks = [
				{
					"Tour Id": "1",
					"Date of Travel": "Computer Architecture",
					"No Of Passengers": "Computers",
					"No Of Days": "125.60"
				},
				{
					"Tour Id": "2",
					"Date of Travel": "Asp.Net 4 Blue Book",
					"No Of Passengers": "Programming",
					"No Of Days": "56.00"
				},
				{
					"Tour Id": "3",
					"Date of Travel": "Popular Science",
					"No Of Passengers": "Science",
					"No Of Days": "210.40"
				}
			];
	createTableFromJSON('showAllStaff', myBooks, function(row, tableData){
			//alert("Row index is: " + JSON.stringify(tableData[row.rowIndex-1]));
	});
}
  function submitPackage(){
	  $('#cover-spin').show(0);
	  ApiService.post(document.packages, 'tour_package', '/api/1/test', function(){
		$('#cover-spin').hide();
		alert("Package Created Successfully.");
	  }, function(){
		$('#cover-spin').hide();
	  });
  }
	$('#main').hide();
	function doLogin(elem){
		$('#cover-spin').show(0);

	  ApiService.getQuery(document.loginPanel, 'select sId from staff where sId=$Login and sPswd=$Password', '/api/1/test', function(responseData, status){
		$('#cover-spin').hide();
		if(responseData.length>0){
			$('#loginPanel').hide();
			$('#staff').show();
			$('#main').show();
		}else{
			responseData.role = 'admin123';
			//alert("Authentication failed.");
			$('#loginPanel').hide();
			if('admin' === responseData.role){
				$('#staff').show();
			}else
				loadAdminPackage();
			$('#main').show();
		}
	  }, function(){
		$('#cover-spin').hide();
	  });
	}
function loadEnquiryPkgs()
{
$('#pkgEntry').hide();
$('#bbView').hide();
$('#enqPackages').show();
var myBooks = [
            {
                "Tour Id": "1",
                "Date of Travel": "Computer Architecture",
                "No Of Passengers": "Computers",
                "No Of Days": "125.60"
            },
            {
                "Tour Id": "2",
                "Date of Travel": "Asp.Net 4 Blue Book",
                "No Of Passengers": "Programming",
                "No Of Days": "56.00"
            },
            {
                "Tour Id": "3",
                "Date of Travel": "Popular Science",
                "No Of Passengers": "Science",
                "No Of Days": "210.40"
            }
        ];
createTableFromJSON('showAllPackages', myBooks, function(row, tableData){
		//alert("Row index is: " + JSON.stringify(tableData[row.rowIndex-1]));
	/*$('#myTable').hide();
	$('#bbView').show();
	$('#bb').hide();*/
	$('#pkgEntry #h').text("Package Details");
	addPackage();
	//$('#pkgEntry').show();
});
}
function findPackage(){
 var x = document.getElementById("bb");
	var y = document.getElementById("aa");
	var z= document.getElementById("cc");
	y.style.display="none";
	z.style.display="none";
	x.style.display = "block";
	$('#bbView').show();
}

function createTableFromJSON(tableId, myBooks, rowCallback) {


        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
		table.setAttribute("id","myTable");
		table.setAttribute("border","1");
		//table.setAttribute("style", "border: solid 1px #DDD;border-collapse: collapse;padding: 2px 3px;text-align: center;");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
			th.setAttribute("id","a"+(i+1));
			//th.setAttribute("style", "text-align:center;font-size:8pt;width:100%;color:white;cellspacing:0px;cellpadding:0px;padding-right:16px;");
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myBooks.length; i++) {

            tr = table.insertRow(-1);
			tr.onclick = function(event){rowCallback(this, myBooks)};
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
				tabCell.setAttribute("id", "a"+(j+1));
				//tabCell.setAttribute("style", "border: solid 1px #DDD;border-collapse: collapse;padding: 2px 3px;text-align: center;");
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById(tableId);
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
    }
function closePkgDetails(){

}
function logoutLogin(){
	$('#main').hide();
	$('#loginPanel').show();
}
function loadEnqSales(){
/* var x = document.getElementById("bb");
var y = document.getElementById("aa");
var z= document.getElementById("cc");
y.style.display="none";
z.style.display="none";
x.style.display = "block";*/
	var myBooks = [
            {
                "SNO": "1",
                "EXECUTIVE_NAME": "Computer Architecture",
                "DATE_OF_QUERY": "Computers",
                "CLIENT_NAME": "125.60"
            },
            {
                "SNO": "2",
                "EXECUTIVE_NAME": "Asp.Net 4 Blue Book",
                "DATE_OF_QUERY": "Programming",
                "CLIENT_NAME": "56.00"
            },
            {
                "SNO": "3",
                "EXECUTIVE_NAME": "Popular Science",
                "DATE_OF_QUERY": "Science",
                "CLIENT_NAME": "210.40"
            }
        ];
	createTableFromJSON('showAllSales', myBooks, function(row, tableData){
		$('#myTable').hide();
		$('#bbView').show();
		$('#bb').hide();
	});
}
function addPackage(){
	$('#enqPackages').hide();
	$('#pkgEntry').show();
}
function closeBox(id){
	$('#'+id).hide();
	var txtId = $('#'+id+' #h').text();
	if('New Package' === txtId || 'Package Details' === txtId)
		closeAddPkg();
}
function closeAddPkg(){
	$('#enqPackages').show();
}