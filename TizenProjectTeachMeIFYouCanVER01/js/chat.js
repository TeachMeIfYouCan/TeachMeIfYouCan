
/*//메세지 받기
socket.on('message', function(data) {
console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName);
	
$('#chat ul').append('<li><span>'+data.nickName+': </span>'+data.message);
	navigator.vibrate(500);
});

//메세지 보내기
$('#sendMsgBtn').off("click").on("click", (function() {
	console.log("sendMsgBtn 버튼 누름" );
	
	var message =$('#inputMsg').val();
	 
	socket.emit('message', { nickName : nickName, roomName: roomName, message: message });
	
}));

*/
