var previous_screen_orientation = "portrait-primary";

var list_expand_toggle = 0;

var select_list = new Array();

$(document).ready(function() {
	
	//로딩 이미지
	//var loading = $('<img src="icon.png" id="load_test" alt="loading" style="border:0; position:absolute; left:50%; top:50%;" />').appendTo(document.body).hide();	
	$("*").ajaxStart(function(){
		//loading.show();
		console.log('ajaxStart');
	});
	
	$(document).ajaxStop(function() {
		//loading.hide();
		
		if(main_flag == true){
			console.log("$(document).ajaxStop - main");
			
			init_friend_list(MY_PROFILE_LOADED);
			refresh_friend_list(MY_FRIENDS_LOADED);
			refresh_friend_select_list(MY_FRIENDS_LOADED);
			
			$.mobile.changePage("main");
			
			main_flag = false;
			logout_flag = false;
		}
		else if(logout_flag == true){
			console.log("$(document).ajaxStop - logout");
			$.mobile.changePage("loginPage");
			
			main_flag = false;
			logout_flag = false;
		}
	});
});

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
        	socket.emit('leave', {nickName: nickName,id: id, roomName: roomName, pic_url: pic_url});	
        	
        	/*
        	console.log("audio_stop pressed for leaving the room");
    		
    		//To send a message 원격포트로 키와 값을 보냄
    		remoteMessagePort.sendMessage([ {
    			key : 'command',
    			value : "audio_stop"
    		} ], null);
    		
    		audio_flag = true;
    		
    		audio_stop_send();
        	*/
        	
        	var editDrawerElement = document.getElementById("editDrawer");
        	
        	var editDrawer = tau.widget.Drawer(editDrawerElement);
        	
        	editDrawer.close();
        	edit_menu_open = false;
        	
        	var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
        	
        	var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
        	
        	classmate_list_drawer.close();
        	
        	socket.emit('roomList');
        	
        	
        	screen.lockOrientation("portrait-primary");
        	change_page_class_list();
         }  
         else if( pageid === "select_friends" ) {
        	 
        	 
        	 var editDrawerElement = document.getElementById("editDrawer");
         	
        	 var editDrawer = tau.widget.Drawer(editDrawerElement);
         	
        	 editDrawer.close();
        	 edit_menu_open = false;
         	
        	 var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
         	
        	 var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
         	
        	 classmate_list_drawer.close();
        	 
        	 
        	 
        	 screen.lockOrientation("portrait-primary");
        	 
        	 clear_selected(); 

        	 $.mobile.changePage("main");
         }
         
         else if( pageid === "invite_friends" ) {
        	 
        	 screen.lockOrientation("landscape-primary");
        	 
        	 clear_selected(); 

        	 $.mobile.changePage("teacher_screen");
        	 
        	 screen.lockOrientation("landscape-primary");
         }
         
         else if(pageid === "loginPage"){
        	 
        	 tizen.application.getCurrentApplication().exit();
         }
         
         else {
        	 
        	 close_all_drawers();
        	 
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
		class_list.style.height = list_num*16 + title_height + participant_height + button_height + 70 + "px";
		list_expand_toggle = 1;
	}
	else if(list_expand_toggle == 1){
		class_list.style.height = "30px";
		list_expand_toggle = 0;
	}
}


function change_student_screen(){
	
	clear_selected();
	
	screen.lockOrientation("landscape-primary");
	$.mobile.changePage("teacher_screen");
	
	if(am_i_master()){
		
		console.log("Joining the room as the master");
		
		play_button_image = new Image();
		play_button_image.src = "./Play Button - Inactive.png";
		pause_button_image = new Image();
		pause_button_image.src = "./Pause Button - Inactive.png";
		stop_button_image = new Image;
		stop_button_image.src = "./Stop Button - Inactive.png";
		
		$(play_button).empty();
		$(play_button).append(play_button_image);
		play_button_image.style.height = "100%";
		play_button.style.textAlign = "center";
		$("#play").unbind('click').click(function() {
			
			if(audio_flag == true){
				console.log("audio_start pressed");
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_start"
				} ], null);
				
				audio_flag = false;
			}
		});
		
		$(pause_button).empty();
		$(pause_button).append(pause_button_image);
		pause_button_image.style.height = "100%";
		pause_button.style.textAlign = "center";
		$("#pause").unbind('click').click(function() {
			console.log("audio_pause pressed");
			
			//To send a message 원격포트로 키와 값을 보냄
			remoteMessagePort.sendMessage([ {
				key : 'command',
				value : "audio_pause"
			} ], null);
			
			audio_flag = true;
		});
		
		$(stop_button).empty();
		$(stop_button).append(stop_button_image);
		stop_button_image.style.height = "100%";
		stop_button.style.textAlign = "center";
		$("#stop").unbind('click').click(function() {
			console.log("audio_stop pressed");
			
			//To send a message 원격포트로 키와 값을 보냄
			remoteMessagePort.sendMessage([ {
				key : 'command',
				value : "audio_stop"
			} ], null);
			
			audio_flag = true;
			
			audio_stop_send();
		});
	}
	else if(do_i_have_permit()){
		
		console.log("The authorization for microhpone use has been granted");
		
		play_button_image = new Image();
		play_button_image.src = "./Mic_Yes.png";
		pause_button_image = new Image();
		pause_button_image.src = "./No_Touch_Paint.png";
		stop_button_image = new Image;
		stop_button_image.src = "";
		
		$(play_button).empty();
		$(play_button).append(play_button_image);
		play_button_image.style.height = "100%";
		play_button.style.textAlign = "center";
		$("#play").unbind('click').click(function() {
			
			if(audio_flag == true){
				console.log("audio_start pressed");
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_start"
				} ], null);
				
				audio_flag = false;
			}
		});
		
		$(pause_button).empty();
		$(pause_button).append(pause_button_image);
		pause_button_image.style.height = "100%";
		pause_button.style.textAlign = "center";
		$("#pause").unbind('click').click(function() {});
		
		$(stop_button).empty();
		$(stop_button).empty();
		stop_button_image.style.height = "100%";
		stop_button.style.textAlign = "center";
		$("#stop").unbind('click').click(function() {});
		
		/*
		if(audio_flag == true){
			console.log("audio permit given ---> Native audio is working");
			
			//To send a message 원격포트로 키와 값을 보냄
			remoteMessagePort.sendMessage([ {
				key : 'command',
				value : "audio_start"
			} ], null);
			
			audio_flag = false;
		}
		*/
	}
	else{
		
		console.log("Joining the room as the classmate");
		
		play_button_image = new Image();
		play_button_image.src = "./Mic_No.png";
		pause_button_image = new Image();
		pause_button_image.src = "./No_Touch_Paint.png";
		stop_button_image = new Image;
		stop_button_image.src = "";
		
		$(play_button).empty();
		$(play_button).append(play_button_image);
		play_button_image.style.height = "100%";
		play_button.style.textAlign = "center";
		$("#play").unbind('click').click(function() {});
		
		$(pause_button).empty();
		$(pause_button).append(pause_button_image);
		pause_button_image.style.height = "100%";
		pause_button.style.textAlign = "center";
		$("#pause").unbind('click').click(function() {});
		
		$(stop_button).empty();
		$(stop_button).empty();
		stop_button_image.style.height = "100%";
		stop_button.style.textAlign = "center";
		$("#stop").unbind('click').click(function() {});
	}
}

function change_page_class_list(){
	
	clear_selected();
	
	screen.lockOrientation("portrait-primary");
	$.mobile.changePage("page_class_list");
	screen.lockOrientation("portrait-primary");
	
	fix_tabbar_width();
}

function change_select_friend(){
	
	screen.lockOrientation("portrait-primary");
	$.mobile.changePage("select_friends");
}

function change_invite_friend(){
	
	screen.lockOrientation("portrait-primary");
	$.mobile.changePage("invite_friends");
}

function change_classmate_list(){
	
	screen.lockOrientation("portrait-primary");
	$.mobile.changePage("select_classmates");
}

function add_the_selected(friend){
	
	console.log(friend.style.backgroundColor);
	
	var data = {
			text : nickName,
			id : id
	};
	
	if(friend.style.backgroundColor != "rgb(255, 204, 204)"){
	
		console.log("Adding the item into the array");
		
		friend.style.backgroundColor = "#FFCCCC";
		
		data.text = friend.text;
		data.id = friend.id;
		
		select_list.push(data);
	}
	else{

		friend.style.backgroundColor = "";

		console.log("Removing the item into the array");
		
		data.text = friend.text;
		data.id = friend.id;
		
		remove_select_list(data);
	}
}

function remove_select_list(friend){
	
	for(var i = 0; i < select_list.length; i++){
		
		if((select_list[i].text == friend.text) && (select_list[i].id == friend.id)){
			
			select_list.splice(i, 1);
			console.log("removed");
		}
	}
}

function clear_selected(){
	
	console.log('Clearing select_list');
	
	var all_checkbox = document.getElementsByClassName("select_item");

	var reset_list_top = document.getElementById("top");
	reset_list_top.scrollIntoView(true);
	
	for(var i = 0; i < select_list.length; i++){

		console.log(select_list[i]);	
	}
	
	for(var i = 0; i < all_checkbox.length; i++){
		 
		console.log("Unchecking the checkbox");
		 
		all_checkbox[i].style.backgroundColor = "";
		select_list.pop();
	}  
}










