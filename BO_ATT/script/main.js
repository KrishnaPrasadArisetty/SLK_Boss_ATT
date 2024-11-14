require(["DS/DataDragAndDrop/DataDragAndDrop","DS/PlatformAPI/PlatformAPI","DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"], 
function(DataDragAndDrop,PlatformAPI,WAFData,BaseUrl){	


var Spectable;
var parttable;
var thead;
var tbody;
var headerRow;


var comWidget={
    widgetDataSelected: {},


	onLoad: function() { 
		Spectable = widget.createElement('table', {'id' : 'spectable'});
		parttable = widget.createElement('table', {'id' : 'parttable'});
		thead = widget.createElement('thead', {'id' : 'tablehead'});
		tbody = widget.createElement('tbody', {'id' : 'tablebody'});
		mainDiv = widget.createElement('div', {'id' : 'mainDiv'});
		Spectable.appendChild(thead);
		Spectable.appendChild(tbody);
		mainDiv.appendChild(parttable);
		mainDiv.appendChild(Spectable);
		var dropbox = widget.createElement('div',{'class':'mydropclass',text :''});
		var dropimage = widget.createElement('img', {'src': '../Images/dropImage.png', 'alt': 'Dropbox Image'});
		dropbox.append(dropimage);
		widget.body.innerHTML="";
		dropbox.style = "border:2px #c6c5c5 dashed; margin:10px; padding: 5%; text-align: center";
		dropbox.inject(widget.body);
		var theInput = widget.body.querySelector('.mydropclass');
		DataDragAndDrop.droppable(theInput,{
			drop : function(data){
					const objs 		= JSON.parse(data);
					let objList 	= objs.data.items;
					let objsLength	= objList.length;
					let PartId;
					if(objsLength>1){
						alert("please drop only one Part");
						return;
					}
					PartId = objList[0].objectId;
					console.log("data-aaaaa--bbbb---", PartId);		
					comWidget.partDropped(PartId);
					//dropbox.textContent = PartId;
					thead.appendChild(headerRow);
					widget.body.appendChild(Spectable);
			},
		});
	},

	partDropped: function(sPartId) { 
		console.log("Partid--partdropped->", sPartId);
		comWidget.specTable(sPartId);	
	},

	specTable: function(sPartId) { 
		console.log("Partid--SpecTable->", sPartId);
		headerRow = document.createElement("tr");
		const headers = ['Specification Name', 'Title', 'Att1', 'Att2','Att3'];
		headers.forEach(text => {
			const headerCol = document.createElement("th");
			headerCol.innerText = text;
			headerRow.appendChild(headerCol);
		});

	},
	partTable: function(sPartId) { 
		console.log("Partid--SpecTable->", sPartId);
		var partheaderRow = document.createElement("tr",{'id':'partheaderRow'});
		const headers = ['Part Name', 'Title'];
		headers.forEach(text => {
			const headerCol = document.createElement("th");
			headerCol.innerText = text;
			partheaderRow.appendChild(headerCol);
		});
		parttable.appendChild(partheaderRow);
	},
	
};
widget.addEvent('onLoad',comWidget.onLoad);
widget.addEvent("onRefresh", comWidget.onLoad);
});