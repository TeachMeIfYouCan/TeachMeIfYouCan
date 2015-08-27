//var nativeServiceAppId = "S8vjRcPYft.zserviceapp";
/*
var nativeServiceAppId = "jeITKUm4Mv.zserviceapp";

var remoteMessagePort;
var remoteAudioMessagePort;

var audio_flag = true;
*/
var localMessagePort_ID;

function native_init() {
	/*
	console.log("native_init() has been called");
	
	//Launch context transmitter service
	tizen.application.launch(nativeServiceAppId, function(){ 
		console.log('tizen.application.launch success');
	}, function(err){
		console.log('tizen.application.launch err = ' + err.message);
	});
	*/
	// Open message port //원격에서 로컬 포트로 "RECEIVE_HELLO_MESSAGE"라는 메세지이름을 data로 받음.
	
	
	if(typeof localMessagePort !== "undefined") {
		console.log("있네!!!!!!!!!!!!!!!!!!!!");
		localMessagePort.removeMessagePortListener(localMessagePort_ID);
	}
	localMessagePort = tizen.messageport.requestLocalMessagePort("RECEIVE_HELLO_MESSAGE");
	

	console.log("localMessagePort");

	localMessagePort_ID = localMessagePort.addMessagePortListener(function(data, replyPort) {
		console.log("native receive audio length = " + data[0].value.length);		
		//console.log("native receive audio = " + data[0].value);		
		
		send_audio_data(data[0]);
	});	
	console.log("localMessagePort_ID");
	
	if(typeof remoteMessagePort === "undefined") {
			//To open an message port to invoke message port 		
		remoteMessagePort = tizen.messageport.requestRemoteMessagePort(
				nativeServiceAppId, 'COMMAND_VALUE'); //로컬 포트로 "COMMAND_VALUE"이라는 메세지 이름으로 command 받음		
		console.log("remoteMessagePort");
	}
	if(typeof remoteAudioMessagePort === "undefined") {
			remoteAudioMessagePort = tizen.messageport.requestRemoteMessagePort(
				nativeServiceAppId, 'RECEIVE_AUDIO'); //로컬 포트로 "RECEIVE_AUDIO"이라는 메세지 이름으로 audio data 받음	
		console.log("remoteAudioMessagePort");		
	}
	
	$("#play").unbind('click').click(function() {
	
		//alert("Play");
		
		if(audio_flag == true){
			console.log("audio_start pressed");

			//To send a message 원격포트로 키와 값을 보냄
			remoteMessagePort.sendMessage([ {
				key : 'command',
				value : "audio_start"
			} ], null);
			
			audio_flag = false;
		}
	});	
	
	$("#pause").unbind('click').click(function() {
		
		//alert("Pause");
		
		console.log("audio_pause pressed");
		
		//To send a message 원격포트로 키와 값을 보냄
		remoteMessagePort.sendMessage([ {
			key : 'command',
			value : "audio_pause"
		} ], null);
		
		audio_flag = true;
	});
	
	$("#stop").unbind('click').click(function() {
		
		//alert("Stop");
		
		console.log("audio_stop pressed");
		
		//To send a message 원격포트로 키와 값을 보냄
		remoteMessagePort.sendMessage([ {
			key : 'command',
			value : "audio_stop"
		} ], null);
		
		audio_flag = true;
		
		
	});
}

function chat_init() {
	
	console.log("chat_init() has been called");
	
	//메세지 받기
	socket.on('message', function(data) {
		console.log("<chat msg> nickName = " + data.nickName + " roomName = " + data.roomName + " msg = " + data.message);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">'+ data.nickName+ ': '+ data.message + '</li>');	
		
		$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
		
		navigator.vibrate(500);
	});
	
	//캔버스 데이터 받기
	socket.on('canvasData', function(data) {
		console.log("canvasData 받음");			
		
		if(data.canvasCommand == "start") {
			startCanvs(data);
		} else if(data.canvasCommand == "move") {
			moveCanvs(data);
		} else if(data.canvasCommand == "end") {
			endCanvs(data)
		} else if(data.canvasCommand == "clear") {
			clear_canvas_only();
		}
	});
	
	//backgroud 올렸을때 canvs 받기
	socket.on('backgroundImage', function(data) {
		console.log("backgroundImage 받음 name = " + data.nickName + " my master_name = " + master_name);   
		
		var image = new Image();
		image.src = data.canvasData;
		//var image_data = atob(background_image);
		image.onload = function(){
			 context.drawImage(image, 0, 0, canvas.width, canvas.height);	
		}  
	});
	
	//audio 데이터 받음
	socket.on('audioData', function(data) {
	    console.log("recv server audio Data = " + data.audioData.value.length);
	    console.log("recv server audio = " + data.audioData.value);
	    
		remoteAudioMessagePort.sendMessage([ {
			key : data.audioData.key,
			value : data.audioData.value
		} ], null);		
 	});
	
	//다운로드 받을 수 있는 파일 목록 받음
	socket.on('get_files', function(data) {
	    console.log("recv server get_files.length = " + data.files.length);
		
	    for(var i = 0; i < data.length; i++)
	    	console.log(i + "번째 filename = " + data[i]);
	    
	    //파일 목록 보여주는 html 추가 해야함
 	});
}

//채팅 메세지 전송
function submitMessage() {
    $('#chat ul').append('<li class="ui-li-bubble-sent ui-li ui-li-static">'+ nickName+ ': '+ $('#inputMsg').val() + '</li>');	
	socket.emit('message', { nickName : nickName, roomName: roomName, message: $('#inputMsg').val() });		
	
	$('.ui-li-bubble-sent')[$('.ui-li-bubble-sent').length - 1].scrollIntoView(true);
	
	$('#inputMsg').val('');	
}

//그림 동기화 데이터 전송
function sendCanvasData(command, oldX, oldY, newX, newY, strokeWidth, strokeColor, lineJoin) {
	console.log("canvas command 보냄 = " + command);	
	socket.emit('canvasData', { nickName : nickName, roomName: roomName, id: id, canvasCommand: command, oldX: oldX, oldY: oldY, newX: newX, newY: newY, 
								strokeWidth: strokeWidth, strokeColor: strokeColor, lineJoin: lineJoin});			
	//streaming_socket.emit('canvasData', { nickName : nickName, roomName: roomName, id: id, canvasCommand: command, oldX: oldX, oldY: oldY, newX: newX, newY: newY, 
	//	strokeWidth: strokeWidth, strokeColor: strokeColor, lineJoin: lineJoin});			
}

//나중에 들어온 사람의 동기화 위해 캔버스 그림 전송
function sendBackgroundImage() {
	console.log("backgroundImage 보냄");		
	socket.emit('backgroundImage', { nickName : nickName, roomName: roomName, id: id, canvasData: canvas.toDataURL()});	
	//streaming_socket.emit('backgroundImage', { nickName : nickName, roomName: roomName, id: id, canvasData: canvas.toDataURL()});	
	
}

function recorderMsg_send() {
	if(master_name == nickName) {
		console.log("audio_data send to recorder server");	
		//streaming_socket.emit('audio_start', {nickName : nickName, roomName: roomName, id: id});
	}
}

//오디오 데이터 전송
function send_audio_data(audioData) {
	console.log("audio_data send to server");
	
	socket.emit('audioData', {nickName : nickName, roomName: roomName, id: id, audioData: audioData});
	//streaming_socket.emit('audioData', {nickName : nickName, roomName: roomName, id: id, audioData: audioData});
}

//오디오 정지 신호 전송
function audio_stop_send() {
	console.log("audio_stop message send");
	
	//파일 이름 생성
	var date = new Date();	
	var filename = roomName + "room" + date.getFullYear() + (date.getMonth() + 1) + date.getDate() + date.getHours() + date.getMinutes() + date.getSeconds();
	socket.emit('audio_stop', {nickName : nickName, roomName: roomName, id: id, filename: filename});
	if(master_name == nickName) {
		console.log("audio_stop message send to server");
		//streaming_socket.emit('audio_stop', {nickName : nickName, roomName: roomName, id: id, filename: filename});
	}

}

//service app exit 요청
function service_app_exit() {
   	//To send a message 원격포트로 종료 메세지  보냄
	
	remoteMessagePort.sendMessage([ {
		key : 'command',
		value : "app_exit"
	} ], null);
	
	console.log("native app에 app_exit 보냄");
	
	audio_flag = true;
	//그냥 나가는거는 서버에게 stop 메세지 안보냄
}

//파일 목록 요청
function get_files() {
	console.log("파일 목록 요청");
	socket.emit('get_files', {nickName : nickName, id: id});
	//streaming_socket.emit('get_files', {nickName : nickName, id: id});
}

//파일 다운로드 요청
function download(filename) {
	console.log("download 불림");
	window.location = 'http://211.189.127.154:53598/download/video/' + filename;
}

