require(["DS/DataDragAndDrop/DataDragAndDrop", "DS/PlatformAPI/PlatformAPI", "DS/WAFData/WAFData", "DS/i3DXCompassServices/i3DXCompassServices"], 
	function(DataDragAndDrop, PlatformAPI, WAFData, BaseUrl) {
		
		var Spectable, parttable, thead, tbody, headerRow, partheaderRow;
		var urlBASE,csrfToken;
		var comWidget = {
			widgetDataSelected: {},
	
			onLoad: function() { 
				// Create table elements
				Spectable = widget.createElement('table', { 'id' : 'spectable' });
				parttable = widget.createElement('table', { 'id' : 'parttable' });
				thead = widget.createElement('thead', { 'id' : 'tablehead' });
				tbody = widget.createElement('tbody', { 'id' : 'tablebody' });
				var mainDiv = widget.createElement('div', { 'id' : 'mainDiv' });
				
				// Append table sections
				Spectable.appendChild(thead);
				Spectable.appendChild(tbody);
				mainDiv.appendChild(parttable);
				mainDiv.appendChild(Spectable);
				
				// Create a dropbox for drag-and-drop functionality
				var dropbox = widget.createElement('div', { 'class' : 'mydropclass', 'text' : '' });
				var dropimage = widget.createElement('img', { 'src': 'https://krishnaprasadarisetty.github.io/SLK_Boss_ATT/BO_ATT/Images/dropImage.png', 'alt': 'Dropbox Image' });
				dropbox.append(dropimage);
				var dropboxsep = widget.createElement('div', { 'class' : 'dropboxsep', 'text' : '-- or --' });
				dropboxsep.style= "font-size: 12px; color: #d5e8f2; text-align: center";
				dropbox.append(dropboxsep);
				var button = document.createElement('button', {'class':'dynamic-button'});

				button.style = "padding: 10px 20px; font-size: 14px; text-align: center; margin: 10px; background-color: #368ec4; color: white; border: none; cursor: pointer";
				button.innerHTML = 'Open content';
				dropbox.append(button);
				dropbox.style = "border:2px #c6c5c5 dashed; margin:10px; padding: 5%; text-align: center";
				widget.body.innerHTML="";
				dropbox.inject(widget.body);
				//
				comWidget.setBaseURL();
				comWidget.setCSRF();
				// Set up drag-and-drop functionality
				var theInput = widget.body.querySelector('.mydropclass');
				DataDragAndDrop.droppable(theInput, {
					drop: function(data) {
						const objs = JSON.parse(data);
						let objList = objs.data.items;
						let objsLength = objList.length;
						if (objsLength > 1) {
							alert("Please drop only one part.");
							return;
						}
						const PartId = objList[0].objectId;
						console.log("PartId dropped:", PartId);	
						comWidget.getPartDetails(PartId);	
						comWidget.partDropped(PartId);

						// Append the header after the part is dropped
						thead.appendChild(headerRow);
						widget.body.innerHTML="";
						widget.body.appendChild(mainDiv);
					},
				});
			},
			setBaseURL: function() 
			{
				BaseUrl.getServiceUrl( { 
					platformId:  widget.getValue('x3dPlatformId'),
					serviceName: '3DSpace', 
					onComplete :  function (URLResult) {
								urlBASE = URLResult+"/";
								urlBASE = "https://oi000186152-us1-space.3dexperience.3ds.com/enovia/";
								console.log("aaaaaaaaaaaaaaaaa-1111-----URL",URLResult);
								},
					onFailure:  function( ) { alert("Something Went Wrong");
					}
				}) ; 
			},
	
			setCSRF: function() {
				console.log("aaaaaaaaaaaaaaaaa-2222-----URL");
				// Web Service call to get the crsf token (security) for the current session
				let urlWAF = urlBASE+"resources/v1/application/CSRF";
				let dataWAF = {};
				let headerWAF = {};
				let methodWAF = "GET";
				let dataResp=WAFData.authenticatedRequest(urlWAF, {
					method: methodWAF,
					headers: headerWAF,
					data: dataWAF,
					type: "json",
					async : false,
					onComplete: function(dataResp) {
						// Save the CSRF token to a hidden widget property so it can be recalled
						let csrfArr=dataResp["csrf"];
						csrfToken = csrfArr["value"];
						console.log("aaaaaaaaaaaaaaaaa------csrfToken",csrfToken);
					},
					onFailure: function(error) {
						widget.body.innerHTML += "<p>Something Went Wrong- "+error+"</p>";
						widget.body.innerHTML += "<p>" + JSON.stringify(error) + "</p>";
					}
				});
			},
			getPartDetails: function(PartId) 
			{
				var headerWAF = {
					ENO_CSRF_TOKEN: csrfToken,
					SecurityContext: "ctx%3A%3AVPLMProjectLeader.BU-0000001.Rosemount%20Flow",
					Accept: "application/json",
					'Content-Type': 'application/json'
				};
				var methodWAF = "GET";
				// Web Service for getting Test Case Object Detail
				var urlObjWAF = urlBASE+"resources/v1/modeler/dseng/dseng:EngItem/";
				urlObjWAF += PartId;
				urlObjWAF += "?$mask=dsmveng:EngItemMask.Details";
				var dataRespTC;
				let dataResp=WAFData.authenticatedRequest(urlObjWAF, {
					method: methodWAF,
					headers: headerWAF,
					data: {},
					type: "json",
					async : false,
					onComplete: function(dataResp) {
						dataRespTC=dataResp;
						console.log("getPartDetailsreturn------- >> ",dataRespTC);
								
					},
					onFailure: function(error, backendresponse, response_hdrs) {
						alert(backendresponse.message);
						console.log(backendresponse);
						console.log(response_hdrs);
						widget.body.innerHTML += "<p>Something Went Wrong"+error+"</p>";
					}
				})
				return dataRespTC;
			},
			partDropped: function(sPartId) { 
				console.log("PartId dropped:", sPartId);
				comWidget.specTable(sPartId);  // Populate the spec table with data
				comWidget.partTable(sPartId);  // Populate the part table with data
			},
	
			specTable: function(sPartId) { 
				console.log("Creating spec table for PartId:", sPartId);
	
				// Create header row for specification table if not already created
				if (!headerRow) {
					headerRow = document.createElement("tr");
					const headers = ['Specification Name', 'Title', 'Att1', 'Att2', 'Att3'];
					headers.forEach(text => {
						const headerCol = document.createElement("th");
						headerCol.innerText = text;
						headerRow.appendChild(headerCol);
					});
				}
	
				// Here, populate the tbody with rows based on the partId
				// You can add dynamic data for rows as needed
				const row = document.createElement("tr");
				['Spec 1', 'Title 1', 'Att1 Value', 'Att2 Value', 'Att3 Value'].forEach(value => {
					const cell = document.createElement("td");
					cell.innerText = value;
					row.appendChild(cell);
				});
				tbody.appendChild(row);
			},
	
			partTable: function(sPartId) { 
				console.log("Creating part table for PartId:", sPartId);
	
				// Create header row for part table if not already created
				if (!partheaderRow) {
					partheaderRow = document.createElement("tr", { 'id': 'partheaderRow' });
					const headers = ['Part Name', 'Title'];
					headers.forEach(text => {
						const headerCol = document.createElement("th");
						headerCol.innerText = text;
						partheaderRow.appendChild(headerCol);
					});
				}
				
				parttable.appendChild(partheaderRow);
	
			},
		};
	
		widget.addEvent('onLoad', comWidget.onLoad);
		widget.addEvent('onRefresh', comWidget.onLoad);
	});