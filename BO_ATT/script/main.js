require(['EmersonTest/scripts/Main'],function(myWidget){
    var myWidget = {
            
        onLoad: function () {
        dragAndDropComp.showDroppable();
        },
        
        updateWidget: function () {
            dragAndDropComp.showDroppable();
        }, 
        getDroppedObjectInfo: function (data) {
            if (data.length > 1) {
                alert("Please drop only one object");
                return;
            } else {
                myWidget.getCSRFToken(data);
            }
        }, 
}
    widget.myWidget = myWidget;
    return myWidget;
});