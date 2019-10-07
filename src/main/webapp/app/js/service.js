var Spinner = {
	start : function(){
		$('#cover-spin').show(0);
	},
	stop : function(){
		$('#cover-spin').hide(0);
	}
};

var AlertDialog = {
	show : function(type, message, okCallback, cancelCallback){
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
        $('#dlgbox #btnOk').show();
        $('#dlgbox #btnCancel').hide();
        if(okCallback){
        	$('#dlgbox #btnOk').click(function(event){
        		try{
        			okCallback(event);
        		}finally{
        			AlertDialog.hide();
        		}
        		});
        }else{
        	$('#dlgbox #btnOk').click(function(event){
        		AlertDialog.hide();
        		});
        }
        if(cancelCallback){
        	$('#dlgbox #btnCancel').click(function(event){
        		try{
        			cancelCallback(event);
        		}finally{
        			AlertDialog.hide();
        		}
        		});
        	$('#dlgbox #btnCancel').show();
        }
        $('#dialog-mdl').show(0);
	},
	hide : function(){
		$('#dialog-mdl').hide();
	}
};
var ApiService = {
	holder : [],
	isTran : false,
	beginTran : function(){
		this.holder = [];
		this.isTran = true;
	},
	endTran : function(){
		if(this.isTran){
			this.isTran = false;
			Spinner.start();
			$.each(this.holder, function (index, request) {
				$.ajax(request);
			});
		}
	},
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
		if(!Array.isArray(requestData))
			throw new Error('Request should be Array');
		$.each(requestData, function (index, data) {
			$.each(data, function (idx, packageItem) {
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
			});				
		});
		var query = "INSERT INTO "+tableId+"("+keyElems+") VALUES ("+tokenElems+")";
		request.query = query;
		console.log(JSON.stringify(request));
		var ajaxRequest = {
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
			};
		if(!this.isTran)
			$.ajax(ajaxRequest);
		else{
			this.holder.push(ajaxRequest);
			Spinner.stop();
		}
	},
	put : function(updateData, whereData, tableId, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var query = "UPDATE "+tableId+" SET ";
		var count=0;
		if(!Array.isArray(updateData))
			throw new Error('Request should be Array');
		$.each(updateData, function (index, data) {
			$.each(data, function (idx, packageItem) {
//		for(var idx=0; idx<updateData.length; idx++){
				//var packageItem = updateData[idx];
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
			});
		});
		count=0;
		query += " WHERE ";
		function findData(key){
			var retValue = '';
			$.each(updateData, function (idx, data) {
				if(data[key] !== undefined && data[key].value !== undefined && data[key].value.trim() !== "")
					retValue = data[key].value;
					return;
			});
			return retValue;
		}
		$.each(whereData, function (idx, col) {
		//for(var idx=0; idx<whereData.length; idx++){
			//var col = whereData[idx];
			var colData = findData(col);//updateData[col].value;
			if(colData.trim() !== ''){
				if(count>0){
					query += " AND "+col+'='+"$"+col;
				}else{
					query += col+'='+"$"+col;
				}
				count++;
				request[col] = colData;
			}
		});
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
	getQueryWithCrit : function(requestData, selectData, whereData, tableId, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var query = 'SELECT '+selectData;
		var count=0;
		query += " FROM "+tableId;
		if(whereData !== undefined && whereData.length > 0){
			query += " WHERE ";
			$.each(whereData, function (idx, col) {
				var colData = requestData[col.id].value;
				if(colData.trim() !== ''){
					if(count>0){
						query += " AND "+col.id+'='+"$"+col;
					}else{
						query += col.id+'='+"$"+col.id;
					}
					count++;
					request[col.id] = colData;
				}
			});
		}
		request.query = query;
		var ajaxRequest = {
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
			};
		if(!this.isTran)
			$.ajax(ajaxRequest);
		else{
			this.holder.push(ajaxRequest);
			Spinner.stop();
		}		
	},
	getQuery : function(requestData, query, url, successCallback, errorCallback){
		Spinner.start();
		var request = {};
		var keyElems = "";
		var tokenElems = "";
		var count=0;
		$.each(requestData, function (idx, packageItem) {
			if(packageItem['localName'] === 'input' || packageItem['localName'] === 'select'){
				var paramName = packageItem['name'];
				if(paramName !== "" && query.indexOf('$'+paramName) > -1)
				request[packageItem['name']] = packageItem['value'];
			}
		});
		request.query = query;
		var ajaxRequest = {
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
			};
		if(!this.isTran)
			$.ajax(ajaxRequest);
		else{
			this.holder.push(ajaxRequest);
			Spinner.stop();
		}
	},
	sendMail : function(requestData, url, successCallback, errorCallback){
		var ajaxRq = $.ajax({
			type: 'POST',
			url: ApiService.backEndUrl+url,
			headers : ApiService.headers,
			contentType:'application/json',
			data: JSON.stringify(requestData),
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
function addSearchBar(id, fields, changeCallback, searchCallback){
	var html = '<select class="l1" id="searchChg">';
	var frmHtml = $('<form name="'+id+'Search"><label>Search By:&nbsp;</label></form>');
	var elemHtml = '';
	var idx=0;
	$.each(fields, function (index, field) {
		html += '<option value="'+field.id+'" '+((idx==0)?"selected":"")+'>'+field.title+'</option>';
		elemHtml += '<input type="'+field.type+'" name="'+field.id+'" '+((idx==0)?"required":"")+' id="'+field.id+'" style="margin-left: 5px;margin-right: 10px;'+((idx==0)?"":"display:none;")+'">';
		idx++;
	});
	html += '</select>';
	var htmlElem = $(html);
	htmlElem.change(changeCallback);
	frmHtml.append(htmlElem);
	var btnElem = $('<button type="button" class="btn btn-info">Find</button>');
	btnElem.click(searchCallback);
	frmHtml.append($(elemHtml));
	frmHtml.append(btnElem);
	$('#'+id+' #enq #searchBar').empty();
	$('#'+id+' #enq #searchBar').append(frmHtml);
	
}