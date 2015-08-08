function chat_init() {
	
	console.log("chat_init() has been called");
	
	//메세지 받기
	socket.on('message', function(data) {
		console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName + " msg = " + data.message);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">'+ data.nickName+ ': '+ data.message + '</li>');	
		navigator.vibrate(500);
	});
	
	//메세지 보내기
	$('#sendMsgBtn').off("click").on("click", (function() {
		
	}));
}

function submitMessage() {
//	console.log("sendMsgBtn 버튼 누름  보낸 메세지 = " + $('#inputMsg').val());		
	$('#chat ul').append('<li class="ui-li-bubble-sent ui-li ui-li-static">'+ nickName+ ': '+ $('#inputMsg').val() + '</li>');	
	socket.emit('message', { nickName : nickName, roomName: roomName, message: $('#inputMsg').val() });		
	$('#inputMsg').val('');	
}