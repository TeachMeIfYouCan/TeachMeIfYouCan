function chat_init() {
	
	console.log("chat_init() has been called");
	
	//메세지 받기
	socket.on('message', function(data) {
		console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName + " msg = " + data.message);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">'+ data.nickName+ ': '+ data.message + '</li>');	
		navigator.vibrate(500);
	});
	
	//캔버스 데이타 받기
	socket.on('canvasData', function(data) {
		console.log("canvasData 받음");			
		
		if(data.canvasCommand == "start") {
			startCanvs(data);
		} else if(data.canvasCommand == "move") {
			moveCanvs(data);
		} else if(data.canvasCommand == "end") {
			endCanvs(data)
		}
	});
}

function submitMessage() {
    $('#chat ul').append('<li class="ui-li-bubble-sent ui-li ui-li-static">'+ nickName+ ': '+ $('#inputMsg').val() + '</li>');	
	socket.emit('message', { nickName : nickName, roomName: roomName, message: $('#inputMsg').val() });		
	$('#inputMsg').val('');	
}

function sendCanvasData(command, oldX, oldY, newX, newY, touches) {
	console.log("command 보냄 = " + command);	
	socket.emit('canvasData', { nickName : nickName, roomName: roomName, canvasCommand: command, oldX: oldX, oldY: oldY, newX: newX, newY: newY});			
}

