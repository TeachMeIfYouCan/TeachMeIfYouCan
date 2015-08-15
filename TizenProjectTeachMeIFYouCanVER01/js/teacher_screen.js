//screen.lockOrientation("landscape-primary");

var canvas_area;
var canvas;
var context;
var isCanvas_clear;

var chat_box;
var chat_bubble_list;
var send_message;

var audio_control;
var play_button;
var pause_button;
var stop_button;

var play_button_image;
var pause_button_image;
var stop_button_image;

var editDrawerElement;
var edit_menu_open;

var background_image;

var join_button;
var create_button;

var invite_popup_element;

var voice_change_auth;

var final_voice_change;
var confirm_flag;

function canvas_init(){
	
	console.log("Canvas Init Function Called");
	
	FBLogin_check();
	
	canvas_area = document.getElementById("canvas_area");
	
	canvas = document.getElementById("canvas");
	
	context = canvas.getContext("2d");
	
	canvas.width = document.height * 0.5;
	canvas.height = document.width * 0.8;
	
	canvas_area.style.width = canvas.width + 10 + "px";
	canvas_area.style.height = canvas.height + "px";
	
	canvas.addEventListener("touchstart", touchStartHandler, false);
	canvas.addEventListener("touchmove", touchMoveHandler, false);
	canvas.addEventListener("touchend", touchEndHandler, false);
	
	isCanvas_clear = true;
	
	chat_box = document.getElementById("chat");
	chat_box.style.width = document.height * 0.5 + "px";
	chat_box.style.height = document.width * 0.67 * 0.65 + "px";
	
	chat_bubble_list = document.getElementById("chat_bubble_list");

	send_message = document.getElementById("send_message");
	send_message.style.width = document.height * 0.5 + "px";
	send_message.style.height = document.width * 0.67 * 0.3 + "px";
	
	audio_control = document.getElementById("audio_control");
	audio_control.style.width = document.height * 0.5 + "px";
	audio_control.style.height = document.width * 0.112 + "px";

	play_button = document.getElementById("play");
	pause_button = document.getElementById("pause");
	stop_button = document.getElementById("stop");
	
	play_button.style.width = document.height * 0.5 * (0.28) + "px";
	pause_button.style.width = document.height * 0.5 * (0.28) + "px";
	stop_button.style.width = document.height * 0.5 * (0.28) + "px";

	play_button_image = new Image();
	play_button_image.src = "./Play Button - Inactive.png";
	pause_button_image = new Image();
	pause_button_image.src = "./Pause Button - Inactive.png";
	stop_button_image = new Image;
	stop_button_image.src = "./Stop Button - Inactive.png";
	
	$(play_button).append(play_button_image);
	play_button_image.style.height = "100%";
	play_button.style.textAlign = "center";
	
	$(pause_button).append(pause_button_image);
	pause_button_image.style.height = "100%";
	pause_button.style.textAlign = "center";
	
	$(stop_button).append(stop_button_image);
	stop_button_image.style.height = "100%";
	stop_button.style.textAlign = "center";
	
	play_button.style.marginLeft = document.height * 0.5 * (0.045) + "px";
	stop_button.style.marginRight = document.height * 0.5 * (0.045) + "px";

	editDrawerElement = document.getElementById("editDrawer");
	edit_menu_open = false;
	
	background_image = new Image();
	background_image.src = "test_js.jpg";	// This src path is based on the HTML file that loads this js file.

	//cdy 이거 지워야 되는거 아님?
	background_image.onload = function(){
		context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
		//sendBackgroundImage();	
	}
	
	join_button = document.getElementById("enter_button");
	join_button.onclick = function(){
		
		console.log("Clearing the canvas");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	create_button = document.getElementById("start_class");
	create_button.onclick = function(){
		
		console.log("Clearing the canvas");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
}

function clear_canvas(){
	
	console.log("Clearing the canvas");
	
	$('#chat_bubble_list').empty();
	
	context.clearRect(0, 0, canvas.width, canvas.height);
}

var touches;

var drawPath = new Array();

var isMoved = false;

function drawPathSetting(idx) 
{
	
	for (var i = 0; i < drawPath.length; i++) 
	{
		var _idx = drawPath[i].identifier;
		if (_idx === idx) 
		{
			return i;
		}
	}

	return -1;
} 

function touchStartHandler(e){
	
	if(am_i_master()){
		
		console.log("Touch paint is activated (Master)"); 
		
		touches = e.changedTouches;
		drawPath.push(touches[0]);
		sendCanvasData("start", touches[0].pageX, touches[0].pageY, "", "");
	}
	else{ console.log("Touch paint is not activated (Not Master)"); }
}

var strokeWidth = "5";
var strokeColor = "#FF0000";
var lineJoin = "round";

function touchMoveHandler(e){
	
	if(am_i_master()){
		
		console.log("Touch paint is activated (Master)"); 
		
		isMoved = true;
		touches = e.changedTouches;
		
		context.lineWidth = strokeWidth;
		context.strokeStyle = strokeColor;
		context.lineJoin = lineJoin;
		
		for(var i = 0; i < touches.length; i++){
			
			var index = drawPathSetting(touches[i].identifier);
			
			context.beginPath();
			context.moveTo(drawPath[index].pageX, drawPath[index].pageY - 60);
			context.lineTo(touches[i].pageX, touches[i].pageY - 60);
			context.closePath();
			context.stroke();
			
			sendCanvasData("move", drawPath[index].pageX, drawPath[index].pageY,
							touches[i].pageX,  touches[i].pageY, strokeWidth, strokeColor, lineJoin);
	
			//socket.emit("imageData", {imageData : canvas.toDataURL("image/webp")});
					
			drawPath.splice(index, 1, touches[i]);
			
		}
		
		e.preventDefault();
	}
	else{ console.log("Touch paint is not activated (Not Master)"); }
}

function touchEndHandler(){
	
	if(am_i_master()){
		
		console.log("Touch paint is activated (Master)"); 
		
		if(!isMoved){
			
			var startPoint = (Math.PI/180) * 0;
			var endPoint = (Math.PI/180) * 360;
			
			context.fillStyle = strokeColor;
			
			context.beginPath();
			context.arc(touches[0].pageX, touches[0].pageY - 60, strokeWidth/2, startPoint, endPoint, true);
			context.closePath();
			
			context.fill();
			
			sendCanvasData("end", "", "", touches[0].pageX, touches[0].pageY);
		}
	
		isMoved = "false";
		drawPath.length = 0;
	}
	else{ console.log("Touch paint is not activated (Not Master)"); }
}

function edit_menu(){
	
	console.log("edit_menu");
	
	var editDrawerElement = document.getElementById("editDrawer");
	
	var editDrawer = tau.widget.Drawer(editDrawerElement);
	
	if(edit_menu_open == false){
		
		editDrawer.open();
		edit_menu_open = true;
	}
	else if(edit_menu_open == true){
		
		editDrawer.close();
		edit_menu_open = false;
		
		var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
     	
		var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
    	
		classmate_list_drawer.close();
	}
}

function open_classmate_list(){
	
	console.log("Open Classmate List");
	
	var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
	
	var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
	
	classmate_list_drawer.close();
}




function move_invite_more_friends(){
	
	//getFriends();
	//invite_friend_list_refresh(MY_FRIENDS_LOADED);
	
	screen.lockOrientation("portrait-primary");	
	change_invite_friend();
	
	console.log('setting width before');
	
	var width;
	
	if(document.width >= document.height){width = document.height * 0.5}
	else if(document.width < document.height){width = document.width * 0.5}
	
	console.log(width);
	
	$('#invite_button').css('width', width);
	$('#invite_button a').css('width', width * 0.95);
	
	$('#invite_cancel_button').css('width', width);
	$('#invite_cancel_button a').css('width', width * 0.95);
	
	console.log('setting width after');
}

function cancel_invite(){
	
	screen.lockOrientation("landscape-primary");
	 
	clear_selected(); 

	$.mobile.changePage("teacher_screen");
	 
	screen.lockOrientation("landscape-primary");
}

function adjust_width(li){
	
	li.style.width = document.width/2 + "px";
}

function invite_more_friends(){
	
	//초대자 목록 전송
	var inviteUserArray = select_list;
	
	console.log("Before sending the list to the server ");
	for(var i = 0; i < select_list.length; i++){

		console.log(inviteUserArray[i]);	
	}
	
	var classTitle = $('#teacher_screen #header_title #class_title').text();
	
	socket.emit('inviteUserList', { roomName: roomName, nickName: nickName, id: id, inviteUserArray: inviteUserArray, classTitle: classTitle});	
	
	screen.lockOrientation("landscape-primary");
	change_student_screen();
}

function close_classmate_list(){
	
	console.log("Close Classmate List");
	
	var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
	
	var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
	
	classmate_list_drawer.close();
}



function startCanvs(data) {	
	var touchData = [];
	touchData[0] = data.oldX;
	touchData[1] = data.oldY;
		
	drawPath.push(touchData);
}


function moveCanvs(data) {
	
	isMoved = true;
	var touchData = [];
	touchData[0] = data.newX;
	touchData[1] = data.newY;
	
	context.lineWidth = data.strokeWidth;
	context.strokeStyle = data.strokeColor;
	context.lineJoin = data.lineJoin;
	
	for(var i = 0; i < 1; i++){
		
		//var index = drawPathSetting(touches[i].identifier);
		
		context.beginPath();
		context.moveTo(data.oldX, data.oldY - 60);
		context.lineTo(data.newX, data.newY - 60);
		context.closePath();
		context.stroke();
				
		drawPath.splice(i, 1);
		
	}
}


function endCanvs(data) {
	
	if(!isMoved){
		
		var startPoint = (Math.PI/180) * 0;
		var endPoint = (Math.PI/180) * 360;
		
		context.fillStyle = strokeColor;
		
		context.beginPath();
		context.arc(data.newX, data.newY - 60, strokeWidth/2, startPoint, endPoint, true);
		context.closePath();
		
		context.fill();
	}

	isMoved = "false";
	drawPath.length = 0;
}




function check_leave(){
	
	var check_leave_element = document.getElementById('check_exit');
	
	check_leave_element.style.display="";
	
	var check_leave = tau.widget.Popup(check_leave_element);
	
	check_leave.open();
	
	close_all_drawers();
}





function open_invite_popup(){
	
	var invite_popup_element = document.getElementById('invite_popup_1');
	
	invite_popup_element.style.display="";
	
	var invite_popup = tau.widget.Popup(invite_popup_element);
	
	invite_popup.open();
}

function close_invite_popup(){
	
	var invite_popup_element = document.getElementById('invite_popup_1');
	
	invite_popup_element.style.display="none";
	
	var invite_popup = tau.widget.Popup(invite_popup_element);
	
	invite_popup.close();
}







function open_edit_canvas_main_popup(){
	
	var invite_popup_element = document.getElementById('invite_popup_1');
	
	invite_popup_element.style.display="";
	
	var invite_popup = tau.widget.Popup(invite_popup_element);
	
	invite_popup.open();
}

function close_edit_canvas_main_popup(){
	
	var invite_popup_element = document.getElementById('invite_popup_1');
	
	invite_popup_element.style.display="none";
	
	var invite_popup = tau.widget.Popup(invite_popup_element);
	
	invite_popup.close();
}

function edit_canvas(){
	
	var editDrawerElement = document.getElementById("editDrawer");
	
	var editDrawer = tau.widget.Drawer(editDrawerElement);
	
	editDrawer.close();
	edit_menu_open = false;
	
	
	var canvas_edit_popup_element = document.getElementById('canvas_edit_popup_main');
	
	canvas_edit_popup_element.style.display="";
	
	var canvas_edit_popup = tau.widget.Popup(canvas_edit_popup_element);
	
	canvas_edit_popup.open();
}

function canvas_edit_popup_background_image(){
	
	var canvas_edit_popup_element = document.getElementById('canvas_edit_popup_main');
	
	canvas_edit_popup_element.style.display="";
	
	var canvas_edit_popup = tau.widget.Popup(canvas_edit_popup_element);
	
	canvas_edit_popup.close();
	
	
	
	
	
	var canvas_edit_popup_background_image_element = document.getElementById('canvas_edit_popup_background_image');
	
	canvas_edit_popup_background_image_element.style.display="";
	
	var canvas_edit_popup_background_image = tau.widget.Popup(canvas_edit_popup_background_image_element);
	
	canvas_edit_popup_background_image.open();
}

function canvas_edit_popup_pen_tool(){
	
	var canvas_edit_popup_element = document.getElementById('canvas_edit_popup_main');
	
	canvas_edit_popup_element.style.display="";
	
	var canvas_edit_popup = tau.widget.Popup(canvas_edit_popup_element);
	
	canvas_edit_popup.close();
	
	
	
	
	
	var canvas_edit_popup_pen_tool_element = document.getElementById('canvas_edit_popup_pen_tool');
	
	canvas_edit_popup_pen_tool_element.style.display="";
	
	var canvas_edit_popup_pen_tool = tau.widget.Popup(canvas_edit_popup_pen_tool_element);
	
	canvas_edit_popup_pen_tool.open();
}

function send_clear_canvas_only(){
	
	sendCanvasData("clear");
}

function clear_canvas_only(){
	
	console.log("Clearing only the canvas");

	context.clearRect(0, 0, canvas.width, canvas.height);
	
	
	
	var canvas_edit_popup_background_image_element = document.getElementById('canvas_edit_popup_background_image');
	
	var canvas_edit_popup_background_image = tau.widget.Popup(canvas_edit_popup_background_image_element);
	
	canvas_edit_popup_background_image.close();
	
	canvas_edit_popup_background_image_element.style.display="none";
}

function change_background_image(image_input_tag){
	
	if(image_input_tag.files && image_input_tag.files[0]){
		
		console.log("Creating File Reader");
		
		var reader = new FileReader();
		
		reader.onload = function(e){
			
			console.log("File Reader Onload");
			
			$(background_image).attr('src', e.target.result);
			
			console.log(background_image);
			
			background_image.onload = function(){
				
				context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
				sendBackgroundImage();
			}
			
			console.log("Canvas Background Changed");
		}
		
		reader.readAsDataURL(image_input_tag.files[0]);
	}
}

var strokeColorSel;
var strokeWidthSel;

function changeStrokeColor(color_change){ strokeColor = color_change.value; }
	
function changeStrokeWidth(width_change){ strokeWidth = width_change.value; }


function show_classmates(){
	
	socket.emit('getRoomUserList', {roomName: roomName, nickName:nickName, id: id});
}

/*
function show_classmates_open(){
	
	$('#show_active_classmates_list ul').empty();
	
	var show_active_classmates_list_element = document.getElementById('show_active_classmates_list');
	
	show_active_classmates_list_element.style.display="";
	
	var show_active_classmates_list = tau.widget.Popup(show_active_classmates_list_element);
	
	show_active_classmates_list.open();
	
	
	console.log("Start adding the list element");
	for(var i = 0; i < active_classmates_list.length; i++){
	
		console.log("Adding " + active_classmates_list[i]);
		$('#show_active_classmates_list ul').append('<li style="font-size:70%;">' + active_classmates_list[i] + '</li>');
	}
	
	for(var i = 0; i < active_classmates_list.length; i++){
		
		active_classmates_list.pop();
	}
}
*/

var temp_list_for_select = new Array();

function show_classmates_open(){
	
	screen.lockOrientation("portrait-primary");	
	
	$('#select_classmates_list').empty();
	$('#select_classmates_list').append('<li data-role="list-divider" id="show_classmates_top">Current Classmates</li>');
	
	console.log("Refresh the friend list");
	
	var friend = '<li class="ui-li-has-thumb ui-li-anchor ui-li">';
	
	var role;
	
	var voice_auth;
	
	for(var i = 0; i < active_classmates_list.length; i++){
		
		if(active_classmates_list[i] == master_name){ role = "Master"; }
		else{ role = "Classmate"; }
		
		if(active_classmates_list[i] == final_voice_change){ voice_auth = "Voice"; }
		else if(active_classmates_list[i] == master_name){ voice_auth = "Voice"; }
		else{ voice_auth = ""; }
		
		console.log(active_classmates_list[i]);
		
		temp_list_for_select.push(active_classmates_list[i]);
		
		friend = friend +  
					'<a href="#" onclick="select_voice_change(' + i + ');" class="select_item"' + ' id=' + active_classmates_list[i].toString() + '>';
		friend = friend + '<img src=' + active_classmates_pic_list[i] + ' class="ui-li-bigicon ui-li-thumb" />';
		friend = friend + '&nbsp;' + active_classmates_list[i];
		friend = friend + '<span class="ui-li-text-sub">' +
							'<h5 class="speciality" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">' +
								role +
							'</h5>' +
							'<h5 class="organization" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:bold; color:red;">' +
								voice_auth +
							'</h5>'
							/*
							<h5 class="status" style="margin:0; padding-bottom:3px; font-size:70%; color:green;">
								Free
							</h5>
							*/
						'</span>'; 
		friend = friend + '</a> </li>';
		
		$('#select_classmates_list').append(friend);
		
		friend = '<li class="ui-li-has-thumb ui-li-anchor ui-li">';			
	}
	
	var width;
	
	if(am_i_master()){
		
		if(document.width >= document.height){width = document.height * 0.5;}
		else if(document.width < document.height){width = document.width * 0.5;}	
	}
	else{
		
		if(document.width >= document.height){width = document.height;}
		else if(document.width < document.height){width = document.width;}	
	}
	
	console.log(width);
	
	change_classmate_list();
	
	if(am_i_master()){
		$('#change_master').css('width', width);
		$('#change_master a').css('width', width * 0.95);
		$('#change_master').show();
		$('#change_master a').show();
		
		$('#cancel_change_master').css('width', width);
		$('#cancel_change_master a').css('width', width * 0.95);
		$('#cancel_change_master').show();
		$('#cancel_change_master a').show();
	}
	else{
		$('#change_master').css('width', 0);
		$('#change_master a').css('width', 0 * 0.95);
		$('#change_master').hide();
		$('#change_master a').hide();
		
		$('#cancel_change_master').css('width', width);
		$('#cancel_change_master a').css('width', width * 0.97);
		$('#cancel_change_master').show();
		$('#cancel_change_master a').show();
	}
}

function current_classmate_list(){
	
	//screen.lockOrientation("portrait-primary");	
	
	$('#select_classmates_list').empty();
	$('#select_classmates_list').append('<li data-role="list-divider" id="show_classmates_top" class="ui-li ui-bar-s ui-li-divider"><span class="ui-divider-text">Current Classmates</span><span class="ui-divider-normal-line"></span></li>');
	
	console.log("Refresh the friend list after voice change");
	
	var friend = '<li class="ui-li-has-thumb ui-li-anchor ui-li">';
	
	var role;
	
	var voice_auth;
	
	for(var i = 0; i < active_classmates_list.length; i++){
		
		if(active_classmates_list[i] == master_name){ role = "Master"; }
		else{ role = "Classmate"; }
		
		if(active_classmates_list[i] == final_voice_change){ voice_auth = "Voice"; }
		else if(active_classmates_list[i] == master_name){ voice_auth = "Voice"; }
		else{ voice_auth = ""; }
		
		console.log(active_classmates_list[i]);
		
		temp_list_for_select.push(active_classmates_list[i]);
		
		friend = friend +  
					'<a href="#" onclick="select_voice_change(' + i + ');" class="select_item"' + ' id=' + active_classmates_list[i].toString() + '>';
		friend = friend + '<img src=' + active_classmates_pic_list[i] + ' class="ui-li-bigicon ui-li-thumb" />';
		friend = friend + '&nbsp;' + active_classmates_list[i];
		friend = friend + '<span class="ui-li-text-sub">' +
							'<h5 class="speciality" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">' +
								role +
							'</h5>' +
							'<h5 class="organization" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:bold; color:red;">' +
								voice_auth +
							'</h5>'
							/*
							<h5 class="status" style="margin:0; padding-bottom:3px; font-size:70%; color:green;">
								Free
							</h5>
							*/
						'</span>'; 
		friend = friend + '</a> </li>';
		
		$('#select_classmates_list').append(friend);
		
		friend = '<li class="ui-li-has-thumb ui-li-anchor ui-li">';			
	}
	
	var width;
	
	if(am_i_master()){
		
		if(document.width >= document.height){width = document.height * 0.5;}
		else if(document.width < document.height){width = document.width * 0.5;}	
	}
	else{
		
		if(document.width >= document.height){width = document.height;}
		else if(document.width < document.height){width = document.width;}	
	}
	
	console.log(width);
	
	//change_classmate_list();
	
	if(am_i_master()){
		$('#change_master').css('width', width);
		$('#change_master a').css('width', width * 0.95);
		
		$('#cancel_change_master').css('width', width);
		$('#cancel_change_master a').css('width', width * 0.95);
	}
	else{
		$('#change_master').css('width', 0);
		$('#change_master a').css('width', 0 * 0.95);
		
		$('#cancel_change_master').css('width', width);
		$('#cancel_change_master a').css('width', width * 0.95);
	}
}

function back_to_class(){
	
	$('#select_classmates_list').empty();
	
	screen.lockOrientation("landscape-primary");
	change_student_screen();
	screen.lockOrientation("landscape-primary");
	
	
	voice_change_auth = false;
	
	for(var i = 0; i < temp_list_for_select.length; i++){
		
		temp_list_for_select.pop();
	}
	
	for(var i = 0; i < active_classmates_list.length; i++){
		
		active_classmates_list.pop();
		active_classmates_pic_list.pop();
	}
	
	active_classmates_list.pop();
	active_classmates_pic_list.pop();
}


function master_voice_change(){
	
	console.log("master_voice_change function called");
}



function close_all_drawers(){
	
	var editDrawerElement = document.getElementById("editDrawer");
	
	var editDrawer = tau.widget.Drawer(editDrawerElement);
	 
	editDrawer.close();
	edit_menu_open = false;
	
	var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
	
	var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
	
	classmate_list_drawer.close();
}


function close_pop_up_by_id(pop_up_id){
	
	console.log("Close Pop Up : " + pop_up_id);
	
	var pop_up_element = document.getElementById(pop_up_id);
	
	var pop_up = tau.widget.Popup(pop_up_element);
	
	pop_up.close();
	
	pop_up_element.style.display="none";
}

function open_pop_up_by_id(pop_up_id){
	
	console.log("Close Pop Up : " + pop_up_id);
	
	var pop_up_element = document.getElementById(pop_up_id);
	
	var pop_up = tau.widget.Popup(pop_up_element);
	
	pop_up.open();
	
	pop_up_element.style.display="";
}



function yes_no_voice_change_pop_up(){
	
	var voice_change_pop_up_element = document.getElementById('voice_change_pop_up');
	
	var voice_change_pop_up = tau.widget.Popup(voice_change_pop_up_element);
	
	voice_change_pop_up.open();
	
	voice_change_pop_up_element.style.display="";
	
	
	voice_change_auth = false;
}

function give_voice_auth(){

	voice_change_auth = true; 
	
	open_pop_up_by_id("voice_change_introduction");
}

var temp_voice_change;

function select_voice_change(index){
	
	console.log("Change to : " + temp_list_for_select[index]);
	
	if(voice_change_auth == true){
		
		confirm_voice_change_pop_up();
		
		temp_voice_change = temp_list_for_select[index];
	}
}

function confirm_voice_change_pop_up(){
	
	var confirm_voice_change_pop_up_element = document.getElementById('confirm_voice_change_pop_up');
	
	var confirm_voice_change_pop_up = tau.widget.Popup(confirm_voice_change_pop_up_element);
	
	confirm_voice_change_pop_up.open();
	
	confirm_voice_change_pop_up_element.style.display="";
}

function yes_voice_change(){
	
	confirm_flag = true;
	
	final_voice_change = temp_voice_change;
	
	console.log("Final Result : " + final_voice_change);
	
	
	var confirm_voice_change_pop_up_element = document.getElementById('confirm_voice_change_pop_up');
	
	var confirm_voice_change_pop_up = tau.widget.Popup(confirm_voice_change_pop_up_element);
	
	confirm_voice_change_pop_up.close();
	
	confirm_voice_change_pop_up_element.style.display="none";
	
	current_classmate_list();
	
	socket.emit('echo_voice_change', {voice_change : final_voice_change, roomName: roomName});
	
	for(var i = 0; i < temp_list_for_select.length; i++){
		
		temp_list_for_select.pop();
	}
}

function credit(){
	
	var credit_pop_up_element = document.getElementById('credit_pop_up');
	
	var credit_pop_up = tau.widget.Popup(credit_pop_up_element);
	
	credit_pop_up.open();
	
	credit_pop_up_element.style.display="";
}

function enter_title(){
	
	$('#enter_class_title_input_form').width(document.width * 0.9);
	$('#enter_class_title_input').width(document.width * 0.9);
	
	var enter_class_title_popup_element = document.getElementById('enter_class_title_popup');
	
	var enter_class_title_popup = tau.widget.Popup(enter_class_title_popup_element);
	
	enter_class_title_popup.open();
	
	enter_class_title_popup_element.style.display="";
}

function define_title(){
	
	$('#teacher_screen #header_title #class_title').text($('#enter_class_title_input').val());
	
	classTitle = $('#enter_class_title_input').val();
	
	$('#enter_class_title_input').val('');
}

function close_enter_title(){
	
	var enter_class_title_popup_element = document.getElementById('enter_class_title_popup');
	
	var enter_class_title_popup = tau.widget.Popup(enter_class_title_popup_element);
	
	enter_class_title_popup.close();
	
	enter_class_title_popup_element.style.display="none";
	
	$('#enter_class_title_input').val('');
}


function fix_tabbar_width(){
	
	console.log('Fixing the width of tabbar elements');
	
	var width;
	
	if(document.width <= document.height){ width = document.width; }
	else if(document.width > document.height){ width = document.height; }
	
	$('#main .ui-block-a').width(width/3);
	$('#main .ui-block-b').width(width/3);
	$('#main .ui-block-c').width(width/3);
	
	$('#main .ui-block-a a').width(width/3);
	$('#main .ui-block-b a').width(width/3);
	$('#main .ui-block-c a').width(width/3);
	
	$('#page_class_list .ui-block-a').width(width/3);
	$('#page_class_list .ui-block-b').width(width/3);
	$('#page_class_list .ui-block-c').width(width/3);
	
	$('#page_class_list .ui-block-a a').width(width/3);
	$('#page_class_list .ui-block-b a').width(width/3);
	$('#page_class_list .ui-block-c a').width(width/3);
	
	$('#page_option_list .ui-block-a').width(width/3);
	$('#page_option_list .ui-block-b').width(width/3);
	$('#page_option_list .ui-block-c').width(width/3);
	
	$('#page_option_list .ui-block-a a').width(width/3);
	$('#page_option_list .ui-block-b a').width(width/3);
	$('#page_option_list .ui-block-c a').width(width/3);
	
	$('#find_friends').width(width* 0.96);
}







