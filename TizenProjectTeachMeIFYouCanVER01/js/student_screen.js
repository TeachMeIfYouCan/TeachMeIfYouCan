//screen.lockOrientation("landscape-primary");

var canvas_area;
var canvas;
var context;

var chat_box;
var audio_control;
var play_button;
var pause_button;
var stop_button;

var editDrawerElement;
var edit_menu_open;

var background_image;

function canvas_init(){

	console.log("Init Function Called");
	
	canvas_area = document.getElementById("canvas_area");
	
	canvas = document.getElementById("canvas");
	
	context = canvas.getContext("2d");
	
	canvas.width = document.height * 0.5;
	canvas.height = document.width * 0.8;
	
	canvas_area.style.width = canvas.width + 20 + "px";
	canvas_area.style.height = canvas.height + "px";
	
	canvas.addEventListener("touchstart", touchStartHandler, false);
	canvas.addEventListener("touchmove", touchMoveHandler, false);
	canvas.addEventListener("touchend", touchEndHandler, false);
	
	chat_box = document.getElementById("chat");
	chat_box.style.width = document.height * 0.45 + "px";
	chat_box.style.height = document.width * 0.67 + "px";


	audio_control = document.getElementById("audio_control");
	audio_control.style.width = document.height * 0.45 + "px";
	audio_control.style.height = document.width * 0.112 + "px";

	play_button = document.getElementById("play");
	pause_button = document.getElementById("pause");
	stop_button = document.getElementById("stop");

	play_button.style.width = document.height * 0.45 * (0.28) + "px";
	pause_button.style.width = document.height * 0.45 * (0.28) + "px";
	stop_button.style.width = document.height * 0.45 * (0.28) + "px";

	play_button.style.marginLeft = document.height * 0.45 * (0.04) + "px";
	stop_button.style.marginRight = document.height * 0.45 * (0.04) + "px";

	editDrawerElement = document.getElementById("editDrawer");
	edit_menu_open = false;
	
	background_image = new Image();
	background_image.src = "test_js.jpg";	// This src path is based on the HTML file that loads this js file.

	background_image.onload = function(){
		context.drawImage(background_image, 0, 0, canvas.width, canvas.height);
	}
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
	}
	
	isMoved = "false";
	drawPath.length = 0;
}



function edit_menu(){
	
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





