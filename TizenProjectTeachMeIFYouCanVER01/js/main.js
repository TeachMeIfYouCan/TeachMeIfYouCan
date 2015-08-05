var previous_screen_orientation = "portrait-primary";

var list_expand_toggle = 0;

( function () {
   window.addEventListener( 'tizenhwkey', function( ev ) {
      if( ev.keyName === "back" ) {
         var page = document.getElementsByClassName( 'ui-page-active' )[0],
            pageid = page ? page.id : "";
         if( pageid === "main" ) {
            try {
               tizen.application.getCurrentApplication().exit();
            } catch (ignore) {
            }
         } 
         else if( pageid === "teacher_screen" ) {
        	console.log("room에서 back 버튼 누름" );
        	socket.emit('leave', {nickName: nickName, roomName: roomName, pic_url: pic_url});	
        
        	screen.lockOrientation("portrait-primary");
        	change_page_class_list();
         }     
         else {     
        	 tizen.application.getCurrentApplication().exit();   
         }
      }
   });
}());


function expand_class_list(item){
	
	var class_list = item;
	
	var list_num = class_list.children[0].children[2].children.length;
	
	var title_height = class_list.children[0].children[0].offsetHeight;
	var participant_height = class_list.children[0].children[1].offsetHeight;
	var button_height = class_list.children[0].children[3].offsetHeight;
	
	if(list_expand_toggle == 0){
		class_list.style.height = list_num*16 + title_height + participant_height + button_height + 30 + "px";
		list_expand_toggle = 1;
	}
	else if(list_expand_toggle == 1){
		class_list.style.height = "30px";
		list_expand_toggle = 0;
	}
}


function change_student_screen(){
	
	screen.lockOrientation("landscape-primary");
	$.mobile.changePage("teacher_screen");
}

function change_page_class_list(){
	
	screen.lockOrientation("portrait-primary");
	$.mobile.changePage("page_class_list");
}

