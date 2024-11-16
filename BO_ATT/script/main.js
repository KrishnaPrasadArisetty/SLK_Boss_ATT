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
				var Spec = widget.createElement('div', { 'id' : 'Spec', 'text' : '' });
				Spec.style = "padding-bottom: 10px;";
				mainDiv.appendChild(Spec);
				mainDiv.appendChild(Spectable);
				var clearbutton = document.createElement('button', {'class':'dynamic-button'});
				clearbutton.style = "border-radius: 4px; padding: 5px 20px; font-size: 12px; text-align: center; margin: 10px; background-color: #368ec4; color: white; border: none; cursor: pointer";
				clearbutton.innerHTML = 'clear';
				clearbutton.addEventListener('click', comWidget.onLoad);
				mainDiv.appendChild(clearbutton);

				var exportbutton = document.createElement('button', {'class':'dynamic-button'});
				exportbutton.style = "border-radius: 4px; padding: 5px 20px; font-size: 12px; text-align: center; margin: 10px; background-color: #368ec4; color: white; border: none; cursor: pointer";
				exportbutton.innerHTML = 'export';
				//exportbutton.addEventListener('click', comWidget.exportTable('Part_Spec_BossAtt.csv'));
				exportbutton.addEventListener('click', () => comWidget.exportTable('Part_Spec_BossAtt.csv'));
				mainDiv.appendChild(exportbutton);
				
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
						var dataResp3 = comWidget.getPartDetails(PartId);
						console.log("dataResp3---->", dataResp3);
						
						let partName = dataResp3.member[0].name;
						let partTitle = dataResp3.member[0].title;
						console.log("partName---->", partName);
						console.log("partTitle---->", partTitle);
						comWidget.partDropped(PartId,partName,partTitle);
						
						// Append the header after the part is dropped
						thead.appendChild(headerRow);
						widget.body.innerHTML="";
						widget.body.appendChild(mainDiv);
					},
				});
			},

			exportTable: function(filename){
				
				let csvContent = "TESTTTTTTTT";
				const rows = parttable.rows;
				/*
				for (let i =0; i<rows.lenght; i++) {
					const row = rows[i];
					const rowData = [];
					for (let j =0; j<rows.lenght; j++){
						rowData.push(row.cell[j].innerHTML);
					}
					csvContent += rowData.join() + '/n';
				}
					*/
				//Create Download link
				let hiddenElement = widget.createElement('a');
				hiddenElement.href = 'data:text/csv/charset=utf-8,' + encodeURI(csvContent);
				hiddenElement.target = '_blank';
				hiddenElement.download = filename;
				hiddenElement.click();
			},
			
			setBaseURL: function() 
			{
				BaseUrl.getServiceUrl( { 
					platformId:  widget.getValue('x3dPlatformId'),
					serviceName: '3DSpace', 
					onComplete :  function (URLResult) {
						urlBASE = URLResult+"/";
						//urlBASE = "https://oi000186152-us1-space.3dexperience.3ds.com/enovia/";
						console.log("aaaaaaaaaaaaaaaaa-1111-----URL",URLResult);
						comWidget.setCSRF();
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
					//SecurityContext: "ctx%3A%3AVPLMProjectLeader.BU-0000001.Rosemount%20Flow",
					SecurityContext: "VPLMProjectLeader.Cross-Commodity.Requirements",
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
						console.log("getPartDetailsreturn--sss----- >> ",dataRespTC);
								
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
			partDropped: function(sPartId,partName,partTitle) { 
				console.log("PartId dropped:", sPartId);
				comWidget.specTable(sPartId);  // Populate the spec table with data
				comWidget.partTable(sPartId,partName,partTitle);  // Populate the part table with data
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
				const cell1 = document.createElement("td");
				cell1.innerText = "Name";
				const cell2 = document.createElement("td");
				cell2.innerText = "title";
				row.appendChild(cell1);
				row.appendChild(cell2);
				[ 'Att1 Value', 'Att2 Value', 'Att3 Value'].forEach(value => {
					
					const cell = widget.createElement("td");
					const select = widget.createElement("select");
					select.innerHTML = '<option>Y</option><option>N</option>';
					cell.appendChild(select)
					row.appendChild(cell);
				});
				tbody.appendChild(row);
			},
	
			partTable: function(sPartId,partName,partTitle) { 
	
				// Create header row for part table if not already created
				if (!partheaderRow) {
					partheaderRow = document.createElement("tr", { 'id': 'partheaderRow' });
					const headers = ['Part Names', 'Title'];
					headers.forEach(text => {
						const headerCol = document.createElement("th");
						headerCol.innerText = text;
						partheaderRow.appendChild(headerCol);
					});
				}
				var partDetailsRow;
				if (!partDetailsRow) {
					partDetailsRow = document.createElement("tr", { 'id': 'partDetailsRow' });
					const headers = [partName,partTitle];
					headers.forEach(text => {
						const headerCol = document.createElement("th");
						headerCol.innerText = text;
						partDetailsRow.appendChild(headerCol);
					});
				}
				parttable.appendChild(partheaderRow);
				parttable.appendChild(partDetailsRow);
	
			},
			connectBase : function (){
				/* 
									// Requiring modules
					const express = require('express');
					const app = express();
					const mssql = require("mssql");

					// Get request
					app.get('/', function (req, res) {

						// Config your database credential
						const config = {
							user: 'SA',
							password: 'Your_Password',
							server: 'localhost',
							database: 'geek'
						};

						// Connect to your database
						mssql.connect(config, function (err) {

							// Create Request object to perform
							// query operation
							let request = new mssql.Request();

							// Query to the database and get the records
							request.query('select * from student',
								function (err, records) {

									if (err) console.log(err)

									// Send records as a response
									// to browser
									res.send(records);

								});
						});
					});

					let server = app.listen(5000, function () {
						console.log('Server is listening at port 5000...');
					});

				*/
			},
		};
		widget.addEvent('onLoad', comWidget.onLoad);
		widget.addEvent('onRefresh', comWidget.onLoad);
	});