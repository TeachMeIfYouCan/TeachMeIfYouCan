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

var editDrawerElement;
var edit_menu_open;

var background_image;

var join_button;
var create_button;

var invite_popup_element;

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

	play_button.style.marginLeft = document.height * 0.5 * (0.045) + "px";
	stop_button.style.marginRight = document.height * 0.5 * (0.045) + "px";

	editDrawerElement = document.getElementById("editDrawer");
	edit_menu_open = false;
	
	background_image = new Image();
	background_image.src = "test_js.jpg";	// This src path is based on the HTML file that loads this js file.

	background_image.onload = function(){
		context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
		sendBackgroundImage();	
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
	
	touches = e.changedTouches;
	drawPath.push(touches[0]);
	sendCanvasData("start", touches[0].pageX, touches[0].pageY, "", "");
}

var strokeWidth = "5";
var strokeColor = "#FF0000";
var lineJoin = "round";

function touchMoveHandler(e){
	
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

function touchEndHandler(){
	
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
	
	classmate_list_drawer.open();
}

function show_classmate_list(){
	
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
	
	socket.emit('inviteUserList', { roomName: roomName, nickName: nickName, id: id, inviteUserArray: inviteUserArray});	
	
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

/*
strokeColorSel = document.querySelector(".strokeColor");
strokeWidthSel = document.querySelector(".strokeWidth");
	
strokeColorSel.addEventListener("change", changeStrokeColor, false);
strokeWidthSel.addEventListener("change", changeStrokeWidth, false);
	
*/

function changeStrokeColor(color_change){ strokeColor = color_change.value; }
	
function changeStrokeWidth(width_change){ strokeWidth = width_change.value; }


function show_classmates(){}


