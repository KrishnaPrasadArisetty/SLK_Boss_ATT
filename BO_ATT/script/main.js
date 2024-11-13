require(["DS/DataDragAndDrop/DataDragAndDrop","DS/PlatformAPI/PlatformAPI","DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"], 
function(DataDragAndDrop,PlatformAPI,WAFData,BaseUrl){	

var comWidget={
    widgetDataSelected: {},

	onLoad: function() { 
		var html = "<table><tr>"+
		"<td><lable class='myLbltype'>Drop in mmmmEditor</lable></td>"+
		"<td><input class='myInputType' type='text' size='60' /></td>"+
		"<tr></tr>"+
		"<td><lable class='myLbltype'>Drop status</lable></td>"+
		"<td><input class='myStatusDrop' type='text' size='60' /></td>"+
		"</tr></table>";

		widget.body.innerHTML=html;
		var theInput = widget.body.querySelector('myInputType');
		var theStatus = widget.body.querySelector('myStatusDrop');
		DataDragAndDrop.droppable(theInput,{
			drop : function(data){
				console.log("data", data);
				theInput.value = data;
				theStatus.value = 'drop';
			},
			enter : function(){
				theStatus.value = 'enter';
				console.log("Enter");
			},
			over : function(){
				theStatus.value = 'over';
			},
			leave : function(){
				theStatus.value = 'leave';
			}
		});
	},
	
};

widget.addEvent('onLoad',comWidget.onLoad);
widget.addEvent("onRefresh", comWidget.onLoad);
});