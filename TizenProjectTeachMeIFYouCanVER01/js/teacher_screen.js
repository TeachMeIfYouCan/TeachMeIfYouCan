//screen.lockOrientation("landscape-primary");

var canvas_area;
var canvas;
var context;
var isCanvas_clear;

var chat_box;
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
	}
	
	join_button = document.getElementById("joinRoom");
	join_button.onclick = function(){
		
		console.log("Clearing the canvas");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
	
	create_button = document.getElementById("createRoom");
	create_button.onclick = function(){
		
		console.log("Clearing the canvas");
		
		context.clearRect(0, 0, canvas.width, canvas.height);
	}
}

var touches;

var drawPath = new Array();

var drawPath_all = new Array();

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
	drawPath_all.push(touches[0]);
	sendCanvasData("start", touches[0].pageX, touches[0].pageY, "", "", touches);
}

var strokeWidth = "5";
var strokeColor = "#FF0000";

function touchMoveHandler(e){
	
	isMoved = true;
	touches = e.changedTouches;
	
	context.lineWidth = strokeWidth;
	context.strokeStyle = strokeColor;
	context.lineJoin = "round";
	
	for(var i = 0; i < touches.length; i++){
		
		var index = drawPathSetting(touches[i].identifier);
		
		context.beginPath();
		context.moveTo(drawPath[index].pageX, drawPath[index].pageY - 60);
		context.lineTo(touches[i].pageX, touches[i].pageY - 60);
		context.closePath();
		context.stroke();
		
		sendCanvasData("move", drawPath[index].pageX, drawPath[index].pageY, touches[i].pageX,  touches[i].pageY, drawPath_all);

		socket.emit("imageData", {imageData : canvas.toDataURL("image/webp")});
		
		
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
		
		sendCanvasData("end", "", "", touches[0].pageX, touches[0].pageY, drawPath_all);
		
	}

	isMoved = "false";
	drawPath.length = 0;
}

function edit_menu(){
	
	console.log("edit_menu");
	
	var editDrawer = tau.widget.Drawer(editDrawerElement);
	
	if(edit_menu_open == false){
		
		editDrawer.open();
		edit_menu_open = true;
	}
	else if(edit_menu_open == true){
		
		editDrawer.close();
		edit_menu_open = false;
	}
}


function edit_canvas(){
	
	
}


function startCanvs(data) {	
	var touchData = [];
	touchData[0] = data.oldX;
	touchData[1] = data.oldY;
		
	drawPath.push(touchData);
	drawPath_all.push(touchData);
}


function moveCanvs(data) {
	
	isMoved = true;
	var touchData = [];
	touchData[0] = data.newX;
	touchData[1] = data.newY;
	
	context.lineWidth = strokeWidth;
	context.strokeStyle = strokeColor;
	context.lineJoin = "round";
	
	for(var i = 0; i < 1; i++){
		
		//var index = drawPathSetting(touches[i].identifier);
		
		context.beginPath();
		context.moveTo(data.oldX, data.oldY - 60);
		context.lineTo(data.newX, data.newY - 60);
		context.closePath();
		context.stroke();
				
		drawPath.splice(index, 1);
		
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

function mikePrivilige() {
	
}





