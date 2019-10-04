var Spinner = {
	start : function(){
		$('#cover-spin').show(0);
	},
	stop : function(){
		$('#cover-spin').hide(0);
	}
};
var AlertDialog = {
	show : function(type, message){
		var whitebg = document.getElementById("white-background");
        var dlg = document.getElementById("dlgbox");
        whitebg.style.display = "block";
        dlg.style.display = "block";
        
        var winWidth = window.innerWidth;
        var winHeight = window.innerHeight;
        
        dlg.style.left = (winWidth/2) - 480/2 + "px";
        dlg.style.top = "150px";
        $('#dlgbox #dlg-header').text(type);
        $('#dlgbox #dlg-body').text(message);
        $('#dialog-mdl').show(0);
	},
	hide : function(){
		$('#dialog-mdl').hide();
	}
};
var ApiService = {
	headers : {},
	complete : function(jqXHR, textStatus) {
		console.log(jqXHR.getResponseHeader('siteid'));
		ApiService.headers['siteid'] = jqXHR.getResponseHeader('siteid');
		},
	backEndUrl : '',
	post : function(requestData, tableId, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var count=0;
		for(var idx=0; idx<requestData.length; idx++){
			var packageItem = requestData[idx];
			if(packageItem['localName'] === 'input' || packageItem['localName'] === 'select'){
				if(packageItem['name'].trim() !== ""){
					if(count>0){
						keyElems +=","+packageItem['name'];
						tokenElems += ",$"+packageItem['name'];
					}else{
						keyElems +=packageItem['name'];
						tokenElems += "$"+packageItem['name'];
					}
					count++;
					if(packageItem['type'].trim() === "checkbox"){
						var userType = packageItem.checked === false ? 0 : 1;
						request[packageItem['name']] = userType;
					}else{
						request[packageItem['name']] = packageItem['value'];
					}
				}
			}
		}
		var query = "INSERT INTO "+tableId+"("+keyElems+") VALUES ("+tokenElems+")";
		request.query = query;
		console.log(JSON.stringify(request));
	$.ajax({
		type: 'POST',
		url: ApiService.backEndUrl+url,
		headers : ApiService.headers,
		contentType:'application/json',
		data: JSON.stringify(request),
		dataType: 'json',
		success: function(responseData, textStatus, jqXHR) {
			ApiService.headers['siteid'] = jqXHR.getResponseHeader('siteid');
			successCallback(responseData, textStatus);
			Spinner.stop();
		},
		error: function (responseData, textStatus, errorThrown) {
			errorCallback('POST failed.', textStatus);
			Spinner.stop();
		}
	});
	},
	put : function(updateData, whereData, tableId, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var query = "UPDATE "+tableId+" SET ";
		var count=0;
		for(var idx=0; idx<updateData.length; idx++){
			var packageItem = updateData[idx];
			if(packageItem['localName'] === 'input' || packageItem['localName'] === 'select'){
				if(packageItem['name'].trim() !== "" && whereData.indexOf(packageItem['name'].trim()) === -1 && packageItem['value'] !== undefined && packageItem['value'] !== 'undefined'){
					if(count>0){
						query += ","+packageItem['name']+'='+"$"+packageItem['name'];
					}else{
						query += packageItem['name']+'='+"$"+packageItem['name'];
					}
					count++;
					if(packageItem['type'].trim() === "checkbox"){
						var userType = packageItem.checked === false ? 0 : 1;
						request[packageItem['name']] = userType;
					}else{
						if(packageItem['value'] !== undefined && packageItem['value'] !== 'undefined')
							request[packageItem['name']] = packageItem['value'];
					}
				}
			}
		}
		count=0;
		query += " WHERE ";
		for(var idx=0; idx<whereData.length; idx++){
			var col = whereData[idx];
			var colData = updateData[col].value;
			if(colData.trim() !== ''){
				if(count>0){
					query += " AND "+col+'='+"$"+col;
				}else{
					query += col+'='+"$"+col;
				}
				count++;
				request[col] = colData;
			}
		}
		request.query = query;
		console.log(request);
		$.ajax({
			type: 'PUT',
			url: ApiService.backEndUrl+url,
			headers : ApiService.headers,
			contentType:'application/json',
			data: JSON.stringify(request),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				//ApiService.headers['siteid'] = jqXHR.getResponseHeader('siteid');
				successCallback(responseData, textStatus);
				Spinner.stop();
			},
			error: function (responseData, textStatus, errorThrown) {
				errorCallback('PUT failed.', textStatus);
				Spinner.stop();
			}
		});
	},
	remove : function(requestData, whereData, tableId, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var query = "DELETE FROM "+tableId;
		var count=0;
		query += " WHERE ";
		for(var idx=0; idx<whereData.length; idx++){
			var col = whereData[idx];
			var colData = requestData[col].value;
			if(colData.trim() !== ''){
				if(count>0){
					query += " AND "+col+'='+"$"+col;
				}else{
					query += col+'='+"$"+col;
				}
				count++;
				request[col] = colData;
			}
		}
		request.query = query;
		console.log(request);
		$.ajax({
			type: 'PUT',
			url: ApiService.backEndUrl+url,
			headers : ApiService.headers,
			contentType:'application/json',
			data: JSON.stringify(request),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				successCallback(responseData, textStatus);
				Spinner.stop();
			},
			error: function (responseData, textStatus, errorThrown) {
				errorCallback('PUT failed.', textStatus);
				Spinner.stop();
			}
		});		
	},
	getQuery : function(requestData, query, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var count=0;
		for(var idx=0; idx<requestData.length; idx++){
			var packageItem = requestData[idx];
			if(packageItem['localName'] === 'input' || packageItem['localName'] === 'select'){
				if(packageItem['name'] !== "")
				request[packageItem['name']] = packageItem['value'];
			}
		}
		request.query = query;
		var ajaxRq = $.ajax({
			type: 'POST',
			url: ApiService.backEndUrl+url,
			headers : ApiService.headers,
			contentType:'application/json',
			data: JSON.stringify(request),
			dataType: 'json',
			success: function(responseData, textStatus, jqXHR) {
				ApiService.headers['siteid'] = jqXHR.getResponseHeader('siteid');
				successCallback(responseData, textStatus);
				Spinner.stop();
			},
			error: function (responseData, textStatus, errorThrown) {
				errorCallback('POST failed.', textStatus);
				Spinner.stop();
			}
		});
	}
}
function createTableFromJSON1(tableId, myBooks, rowCallback, visibleCols) {
        // EXTRACT VALUE FOR HTML HEADER. 
        // ('Book ID', 'Book Name', 'Category' and 'Price')
        var col = [];
        for (var i = 0; i < myBooks.length; i++) {
            for (var key in myBooks[i]) {
                if (col.indexOf(key) === -1 && ((visibleCols === undefined || visibleCols.length ==0) || visibleCols.indexOf(key) > -1)) {
                    col.push(key);
                }
            }
        }

        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
		table.setAttribute("id","myTable");
		table.setAttribute("border","1");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
			th.setAttribute("id","a"+(i+1));
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < myBooks.length; i++) {
            tr = table.insertRow(-1);
			tr.onclick = function(event){rowCallback(this.rowIndex-1, myBooks)};
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
				tabCell.setAttribute("id", "a"+(j+1));
                tabCell.innerHTML = myBooks[i][col[j]];
            }
        }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById(tableId);
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
        addPagination(myBooks, 3);
    }

function buildMenu(menuItems){
	for(var idx=0; idx<menuItems.length; idx++){
		  var item = menuItems[idx];
		  $('#topMenu').append('<li id="'+item.id+'Tab"><a class="hrefClass" onclick="openMenu(this);">'+item.desc+'</a></li>');
	}
}
$.makeTable = function (mydata, rowCallback, visibleCols) {
	var rowClick = function(event){rowCallback(this, mydata)}
    var table = $('<table border=1 id="myTable" class="pagingTableData">');
    var tblHeader = "<tr>";
    var idx=0;
    for (var k in mydata[0]){ 
    	if((visibleCols === undefined || visibleCols === null) || visibleCols.indexOf(k) > -1){
    		tblHeader += "<th id='"+(idx+1)+"'>" + k + "</th>";
    	}
    }
    tblHeader += "</tr>";
    $(tblHeader).appendTo(table);
    $.each(mydata, function (index, value) {
        var TableRow = "<tr>";
        var j=0;
        $.each(value, function (key, val) {
        	if((visibleCols === undefined || visibleCols === null) || visibleCols.indexOf(key) > -1){
        		TableRow += "<td id='a"+(j+1)+"'>" + val + "</td>";
        		j++;
        	}
        });
        TableRow += "</tr>";
        $tr = $(TableRow);
        $tr.click(rowCallback);
        $(table).append($tr);
    });
    return ($(table));
};
function createTableFromJSONTemp(tableId, myBooks, rowCallback, visibleCols){
	var mydata = eval(myBooks);
	createTable(tableId, 0, mydata, function(event){
		rowCallback(this.rowIndex-1, myBooks);
	}, visibleCols);
}
function createTableFromJSON(tableId, myBooks, rowCallback, visibleCols){
	var table = $('<table id="gblTable"><tr><td><p id="showAll"></p></td></tr><tr><td><div id="addPagination"></div></td></tr></table>');
	$(tableId+' #showTbl').empty();
	$(tableId+' #showTbl').append($(table));
	var mydata = eval(myBooks);
	createTable(tableId, 0, mydata, function(event){
		rowCallback(this.rowIndex-1, myBooks);
	}, visibleCols);
}
function createTable(tableId, startIdx, mydata, rowCallback, visibleCols){
	var pageSize = 3;
	var tblData = mydata.slice(startIdx, (startIdx+pageSize));
	var table = $.makeTable(tblData, rowCallback, visibleCols);
	$(tableId+' #showAll').empty();
	$(tableId+' #showAll').append($(table));
	addPagination(tableId+' #addPagination', mydata, pageSize, function(event){
		var idx = parseInt(event.target.dataset.direction);
		createTable(tableId, (idx-1)+pageSize, mydata, rowCallback, visibleCols);
	});
}
function addPagination(id, myBooks, recsPerPage, callback){
	if(myBooks.length <= recsPerPage)
		return;
	var count = 0;
	var html = $('<ul class="pagination"></ul>');
	var beginRow = $('<li class="hrefClass"><a data-direction="1">&lt;&lt;</a></li>');
	beginRow.click(callback);
	html.append(beginRow);
	for (var i = 0; i < myBooks.length; i+=recsPerPage) {
		var row = $('<li class="hrefClass"><a data-direction="'+(count+1)+'">'+(count+1)+'</a></li>');
		row.click(callback);
		html.append(row);
		count++;
	}
	var endRow = $('<li class="hrefClass"><a data-direction="'+(count)+'">&gt;&gt;</a></li>');
	endRow.click(callback);
	html.append(endRow);
	$(id).empty();
	$(id).append(html);
}