function chat_init() {
	//메세지 받기
	socket.on('message', function(data) {
		console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName + " msg = " + data.message);		
		$('#chat ul').append('<li><span>'+data.nickName+': </span>'+ data.message);	
		navigator.vibrate(500);
	});
	
	//메세지 보내기
	$('#sendMsgBtn').off("click").on("click", (function() {
		console.log("sendMsgBtn 버튼 누름  보낸 메세지 = " + $('#inputMsg').val());		
		socket.emit('message', { nickName : nickName, roomName: roomName, message: $('#inputMsg').val() });
		$('#inputMsg').val('');	
	}));
}