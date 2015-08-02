$('#invite').unbind('click').click(function() {
	$('#invite').click(function() {
		console.log("invite 버튼 누름" );

		socket = io('http://211.189.127.154:53597');
		
		socket.emit( 'requestRoomNum');
		
		socket.on( 'requestRoomNum', function(data) {
			console.log("requestRoomNum = " + data);	
			roomName = data;		
			socket.emit( 'createRoom', {nickName: nickName, roomName: roomName});			
			change_student_screen();
		});
		
		socket.on( 'disconnect', function(data) {
			console.log("server is disconnect" );	
			screen.lockOrientation(previous_screen_orientation);			
			window.history.back();
		});
	});
});

$('#roomExit').click(function() {	
	console.log("roomExit 버튼 누름" );
	socket.emit('leave', {nickName: nickName, roomName: roomName});	
	socket.disconnect();
	
	screen.lockOrientation(previous_screen_orientation);
	window.history.back();
});
