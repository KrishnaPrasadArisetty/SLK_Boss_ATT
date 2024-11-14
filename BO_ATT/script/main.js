require(["DS/DataDragAndDrop/DataDragAndDrop","DS/PlatformAPI/PlatformAPI","DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"], 
function(DataDragAndDrop,PlatformAPI,WAFData,BaseUrl){	

var comWidget={
    widgetDataSelected: {},

	onLoad: function() { 
		var html = "<table><tr>"+
		"<td><input class='myInputType' type='text' size='60' /></td>"+
		"</tr></table>";
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
					let PartId = ""
					if(objsLength>1){
						alert("please drop only one Object");
						return;
					} else {
						PartId = objList[0].objectId;
					}
					console.log("data-aaaaa-----", PartId);					
					
					dropbox.textContent = PartId;
			},
		});
	},
	
};
widget.addEvent('onLoad',comWidget.onLoad);
widget.addEvent("onRefresh", comWidget.onLoad);
});