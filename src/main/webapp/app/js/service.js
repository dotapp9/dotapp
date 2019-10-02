var ApiService = {
	headers : {},
	complete : function(jqXHR, textStatus) {
		console.log(jqXHR.getResponseHeader('siteid'));
		ApiService.headers['siteid'] = jqXHR.getResponseHeader('siteid');
		},
	//backEndUrl : 'http://dotapp-dotapp.apps.ca-central-1.starter.openshift-online.com',
	backEndUrl : '',
	post : function(requestData, tableId, url, successCallback, errorCallback){
		$('#cover-spin').show(0);
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
			$('#cover-spin').hide();
		},
		error: function (responseData, textStatus, errorThrown) {
			errorCallback('POST failed.', textStatus);
			$('#cover-spin').hide();
		}
	});
	},
	put : function(updateData, whereData, tableId, url, successCallback, errorCallback){
		$('#cover-spin').show(0);
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
				$('#cover-spin').hide();
			},
			error: function (responseData, textStatus, errorThrown) {
				errorCallback('PUT failed.', textStatus);
				$('#cover-spin').hide();
			}
		});
	},
	remove : function(requestData, whereData, tableId, url, successCallback, errorCallback){
		$('#cover-spin').show(0);
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
				$('#cover-spin').hide();
			},
			error: function (responseData, textStatus, errorThrown) {
				errorCallback('PUT failed.', textStatus);
				$('#cover-spin').hide();
			}
		});		
	},
	getQuery : function(requestData, query, url, successCallback, errorCallback){
		$('#cover-spin').show(0);
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
			$('#cover-spin').hide();
		},
		error: function (responseData, textStatus, errorThrown) {
			errorCallback('POST failed.', textStatus);
			$('#cover-spin').hide();
		}
	});
	}
}
function createTableFromJSON(tableId, myBooks, rowCallback, visibleCols) {
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
			tr.onclick = function(event){rowCallback(this, myBooks)};
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
    }
function buildMenu(menuItems){
	for(var idx=0; idx<menuItems.length; idx++){
		  var item = menuItems[idx];
		  $('#topMenu').append('<li id="'+item.id+'Tab"><a class="hrefClass" onclick="openMenu(this);">'+item.desc+'</a></li>');
	}
}
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