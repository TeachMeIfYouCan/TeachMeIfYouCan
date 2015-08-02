$('#sendMsgBtn').unbind('click').click(function() {
	$('#sendMsgBtn').click(function() {
		console.log("sendMsgBtn 버튼 누름" );

		var message =$('#inputMsg').val();
		 
		socket.emit('message', { nickName : nickName, roomName: roomName, message: message });
		
		socket.on('message', function(data) {
			console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName);
				
			$('#chat ul').append('<li><span>'+data.nickName+': </span>'+data.message);
			navigator.vibrate(500);
		});
	});
});