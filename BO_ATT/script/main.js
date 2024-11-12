require(["DS/DataDragAndDrop/DataDragAndDrop","DS/PlatformAPI/PlatformAPI","DS/WAFData/WAFData","DS/i3DXCompassServices/i3DXCompassServices"], function(DataDragAndDrop,PlatformAPI,WAFData,BaseUrl){
	
	
	
    var comWidget={
        
        onLoad: function () {
            dragAndDropComp.showDroppable();
            },
            
        updateWidget: function () {
                dragAndDropComp.showDroppable();
            }, 
        
    };
    
    widget.addEvent('onLoad',comWidget.onLoad);
    widget.addEvent("onRefresh", comWidget.onLoad);
    });