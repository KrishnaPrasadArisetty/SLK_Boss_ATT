require(["DS/DataDragAndDrop/DataDragAndDrop","DS/PlatformAPI/PlatformAPI","DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"], 
function(DataDragAndDrop,PlatformAPI,WAFData,BaseUrl){	

var comWidget={
    widgetDataSelected: {},

	onLoad: function() { 
		var html = "<table><tr>"+
		"<td><input class='myInputType' type='text' size='60' /></td>"+
		"</tr></table>";
		var dropbox = widget.createElement('div',{'class':'mydropclass',text :'drop objects here'});
		widget.body.innerHTML=dropbox;
		var theInput = widget.body.querySelector('.myInputType');
		var theStatus = widget.body.querySelector('.myStatusDrop');
		DataDragAndDrop.droppable(theInput,{
			drop : function(data){
				console.log("data", data);
				theInput.value = data;
				theStatus.value = 'drop';
			},
		});
	},
	
};
widget.addEvent('onLoad',comWidget.onLoad);
widget.addEvent("onRefresh", comWidget.onLoad);
});