var master_name;
var master_id;

var active_classmates_list = new Array();
var active_classmates_pic_list = new Array();

var socket, streaming_socket;

function room_socket_init() {
	
	console.log("Start initializing the socket");
	
	socket = io('http://211.189.127.154:53597');	
	streaming_socket = io('http://211.189.127.154:53598');
	
	//전체 room의 대한 정보를 가져옴
	socket.emit('roomList');
	socket.on('roomList', function(data) {
		
		console.log("<roomList>");
	
		empty_class_list();
	
		for(var i = 0; i < data.length; i++){
			console.log(data[i]);
			
			add_class_from_server(data[i].classTitle, data[i].attendants, data[i].roomName);
		}		
		//html 방 정보 뿌려지 추가 해야함
		
		fix_tabbar_width();
	});
	
	//현재 room 참가자 정보를 받아옴
	socket.on('getRoomUserList', function(data) {
		
		fix_tabbar_width();
		
		console.log("<getRoomUserList>");
		
		for(var i = 0; i < active_classmates_list.length; i++){
			
			active_classmates_list.pop();
		}
		active_classmates_list.pop();
		
		for(var i = 0; i < temp_list_for_select.length; i++){
			
			temp_list_for_select.pop();
		}
		temp_list_for_select.pop();
		
		for(var i = 0; i < data.attendants.length; i++){
			console.log(data.attendants[i]);
			
			active_classmates_list.push(data.attendants[i].nickName);
			active_classmates_pic_list.push(data.userPic[i]);
			
			if((data.attendants[i].mike == true) && (data.attendants[i].nickName != master_name)){
				
				final_voice_change = data.attendants[i].nickName;
			}
		}
		
		show_classmates_open();
	});
	
	socket.on('echo_voice_change', function(data){
		
		console.log('<echo_voice_change>');
		
		final_voice_change = data.voice_change;
			
		current_classmate_list();
				
		if(am_i_master()){
			
			console.log("Joining the room as the master");
			
			play_button_image = new Image();
			play_button_image.src = "./Play Button - Inactive.png";
			pause_button_image = new Image();
			pause_button_image.src = "./Pause Button - Inactive.png";
			stop_button_image = new Image;
			stop_button_image.src = "./Stop Button - Inactive.png";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			
			$("#play").unbind('click').click(function() {
				
				if(audio_flag == true){
					console.log("audio_start pressed");
					
					play_button_image.src = "./Play Button - Active.png";
					$(play_button).empty();
					$(play_button).append(play_button_image);
					play_button_image.style.height = "100%";
					play_button.style.textAlign = "center";
					
					//To send a message 원격포트로 키와 값을 보냄
					remoteMessagePort.sendMessage([ {
						key : 'command',
						value : "audio_start"
					} ], null);
					
					audio_flag = false;
				}
			});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {
				console.log("audio_pause pressed");
				
				play_button_image.src = "./Play Button - Inactive.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_pause"
				} ], null);
				
				audio_flag = true;
			});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";
			$("#stop").unbind('click').click(function() {
				console.log("audio_stop pressed");
				
				play_button_image.src = "./Play Button - Inactive.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_stop"
				} ], null);
				
				audio_flag = true;
				
				audio_stop_send();
			});
		}
		else if(do_i_have_permit()){
			
			console.log("The authorization for microhpone use has been granted");
			
			play_button_image = new Image();
			play_button_image.src = "./Mic_Yes.png";
			pause_button_image = new Image();
			pause_button_image.src = "./Yes_Touch_Paint.png";
			stop_button_image = new Image;
			stop_button_image.src = "./Stop Button - Inactive.png";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			$("#play").unbind('click').click(function() {
				
				if(audio_flag == true){
					console.log("audio_start pressed");
					
					play_button_image.src = "./Mic_Yes.png";
					$(play_button).empty();
					$(play_button).append(play_button_image);
					play_button_image.style.height = "100%";
					play_button.style.textAlign = "center";
					
					//To send a message 원격포트로 키와 값을 보냄
					remoteMessagePort.sendMessage([ {
						key : 'command',
						value : "audio_start"
					} ], null);
					
					audio_flag = false;
				}
			});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";
			$("#stop").unbind('click').click(function() {
				
				console.log("audio_stop pressed");
				
				play_button_image.src = "./Mic_No.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_stop"
				} ], null);
				
				audio_flag = true;
				
				audio_stop_send();
			});
		}
		else{
			
			console.log("Joining the room as the classmate");
			
			play_button_image = new Image();
			play_button_image.src = "./Mic_No.png";
			pause_button_image = new Image();
			pause_button_image.src = "./No_Touch_Paint.png";
			stop_button_image = new Image;
			stop_button_image.src = "";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			$("#play").unbind('click').click(function() {});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";
			$("#stop").unbind('click').click(function() {});
		}
		
		fix_tabbar_width();
	});
	
	//전체 방 새로고침 버튼 
	$('#roomListRefresh').off("click").on("click", (function() {
		
		console.log('<roomListRefresh>');
		
		console.log("roomListRefresh 버튼 누름" );
		socket.emit('roomList');
		
		fix_tabbar_width();
	}));
	
	//친구 찾기 및 선택
	$('#find_friends').off("click").on("click", (function() {
		
		console.log('<find_friends>');
		
		change_select_friend();
		
		fix_tabbar_width();
	}));
	
	//본인이 방 생성
	$('#start_class').off("click").on("click", (function() {
		
		console.log('<start_class>');
		
		console.log("방 create 버튼 누름" );	
		socket.emit('requestRoomNum'); //생성할 방 키 요청
		
		
		// Audio control image for the master
		play_button_image = new Image();
		play_button_image.src = "./Play Button - Inactive.png";
		pause_button_image = new Image();
		pause_button_image.src = "./Pause Button - Inactive.png";
		stop_button_image = new Image;
		stop_button_image.src = "./Stop Button - Inactive.png";
		
		$(play_button).append(play_button_image);
		play_button_image.style.height = "100%";
		play_button.style.textAlign = "center";
		
		$(pause_button).append(pause_button_image);
		pause_button_image.style.height = "100%";
		pause_button.style.textAlign = "center";
		
		$(stop_button).append(stop_button_image);
		stop_button_image.style.height = "100%";
		stop_button.style.textAlign = "center";
		
		fix_tabbar_width();
		
		close_all_drawers();
	}));
	
	//생성할 방 키값 받음 그 후 방 생성
	socket.on('requestRoomNum', function(data) {
		
		console.log("requestRoomNum = " + data);	
		roomName = data;
		
		socket.emit( 'createRoom', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url, classTitle: classTitle});  /////////////////여기에 초대자들 정보도 같이 보내야함!!!!나중에 추가
		
		add_class(classTitle, select_list, roomName);
	
		master_name = nickName;
		master_id = id;
		
		var me = {
			text: nickName,
			id: id
		};
		
		select_list.push(me);
		
		//초대자 목록 전송
		var inviteUserArray = select_list;
		
		console.log("Before sending the list to the server ");
		for(var i = 0; i < select_list.length; i++){

			console.log(inviteUserArray[i]);	
		}
		
		socket.emit('inviteUserList', { roomName: roomName, nickName: nickName, id: id, inviteUserArray: inviteUserArray, classTitle: classTitle});	
		
		console.log("본인이 참여 nickName = " + nickName + " roomName : " + roomName + " pic_url = " + data.pic_url);
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + nickName +'이' + roomName + '번방에 입장 </li>');				
		
		$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
		
		screen.lockOrientation("landscape-primary");
		
		select_list.pop();
		
		change_student_screen();
	});
	
	//초대자들 목록 받아와서 자신의 name과, id받아와서 맞으면 참여할껀지 팝업 띄어줌
	socket.on('inviteUserList', function(data) {	
		
		console.log("초대자들 목록 받아옴");	
		console.log("data.inviteUserArray = " + data.inviteUserArray);		
		console.log("nickName = " + nickName + " id = " + id)
		
		//all_the_invites = data.inviteUserArray;
		console.log(data);
		
		for(var i = 0; i < data.inviteUserArray.length; i++) {						
			
			console.log("data.inviteUserArray[i].text = " + data.inviteUserArray[i].text + " data.inviteUserArray[i].id = " + data.inviteUserArray[i].id)
			
			if(id == data.inviteUserArray[i].id) {
				
				console.log("아이디가 맞아서 팝업창 띄움");
				open_invite_popup();
				
				console.log("Inviter : " + data.nickName);
				
				$('#invite_title h1').text(data.nickName + " " + $('#invite_title h1').text());
				$('#invite_class_title').text($('#invite_class_title').text() + " " + data.classTitle);
				
				console.log('data.classTitle : ' + data.classTitle);
				
				navigator.vibrate(500);
				
				//초대 찬성
				$('#invite_accept').off("click").on("click", (function() {
					
					console.log('<invite_accept>');
					
					console.log('data.classTitle : ' + data.classTitle);
					enter_class(data.roomName, data.classTitle);
				}));
				//초대 거부
				$('#invite_deny').off("click").on("click", (function() {	
					
					console.log('<invite_deny>');
					
					reject_class(data.roomName);
				}));			
			}
		}
	});
	
	//있던 방에 참여한 참가자 정보 받아옴
	socket.on('joined', function(data) {	
		
		console.log("<join> nickName = " + data.nickName + " roomName : " + data.roomName + " pic_url = " + data.pic_url);
		
		$('#teacher_screen #header_title #class_title').text(data.classTitle);
		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static"<img src = ' + pic_url + '>' + data.nickName +'이' + data.roomName + '번방에 입장 </li>');				
		
		$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
		
		navigator.vibrate(500);
		
		console.log("joined my client master_name = " + master_name + "data.master_name = " + data.master_name);
		//참가자가 들어오면 마스터가 전체로 그려진 그림을 전송함
		if(master_name == data.master_name) {
			console.log("내가 마스터라 들어온 사용자에게 그림 전송");
			sendBackgroundImage();
		}
	});
	
	//기존 방에 있는 사람 리스트 받아옴
	socket.on('roomJoinUsers', function(data) {	
		
		//console.log("기존 방에 있는 사람 리스트 받아옴  data.attendants.length = " +  data.attendants.length);	
		master_name = data.master_name;
		
		if(data.attendants.length > 0) {
			var attendants_list = "";
			for(var i = 0; i < data.attendants.length; i++)	{
				attendants_list += data.attendants[i].nickName;
				if(i != data.attendants.length - 1)
					attendants_list += ", ";	
			}
			$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + attendants_list + '님이 방에 있습니다.</li>');				
			
			$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
			
			console.log("attendants_list = " +  attendants_list);							
		}
		screen.lockOrientation("landscape-primary");
		change_student_screen();
	});	
	
	//초대에 거부한 사용자 정보 받아옴
	socket.on('rejectJoinRoom', function(data) {	
		
		console.log('<rejectJoinRoom>');
		
		console.log("<rejectJoinRoom> nickName = " + data.nickName + " roomName : " + data.roomName);				
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + data.nickName +'이' + data.roomName + '번방에 초대 거부</li>');				
		
		$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
		
		navigator.vibrate(500);	
		
		fix_tabbar_width();
	});
	
	socket.on('changePrivilege', function(data) {	
		
		console.log('<changePrivilege>');
		
		console.log("<changePrivilege> nickName = " + data.nickName + " roomName : " + data.roomName + " master_name = " + master_name + " master_id = " + master_id);
		
		master_name = data.master_name;
		master_id = data.master_id;
		
		//여기 이제 master_id로 권한 바꾸는 함수 넣어야함
		navigator.vibrate(500);
		
		
		if(am_i_master()){
			
			console.log("Joining the room as the master");
			
			play_button_image = new Image();
			play_button_image.src = "./Play Button - Inactive.png";
			pause_button_image = new Image();
			pause_button_image.src = "./Pause Button - Inactive.png";
			stop_button_image = new Image;
			stop_button_image.src = "./Stop Button - Inactive.png";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			$("#play").unbind('click').click(function() {
				
				if(audio_flag == true){
					console.log("audio_start pressed");
					
					play_button_image.src = "./Play Button - Active.png";
					$(play_button).empty();
					$(play_button).append(play_button_image);
					play_button_image.style.height = "100%";
					play_button.style.textAlign = "center";
					
					//To send a message 원격포트로 키와 값을 보냄
					remoteMessagePort.sendMessage([ {
						key : 'command',
						value : "audio_start"
					} ], null);
					
					audio_flag = false;
				}
			});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {
				console.log("audio_pause pressed");
				
				play_button_image.src = "./Play Button - Inactive.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_pause"
				} ], null);
				
				audio_flag = true;
			});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";

			$("#stop").unbind('click').click(function() {
				console.log("audio_stop pressed");	
				
				play_button_image.src = "./Play Button - Inactive.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_stop"
				} ], null);
				
				audio_flag = true;
				
				audio_stop_send();
			});
		}
		else if(do_i_have_permit()){
			
			console.log("The authorization for microhpone use has been granted");
			
			play_button_image = new Image();
			play_button_image.src = "./Mic_Yes.png";
			pause_button_image = new Image();
			pause_button_image.src = "./Yes_Touch_Paint.png";
			stop_button_image = new Image;
			stop_button_image.src = "./Stop Button - Inactive.png";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			$("#play").unbind('click').click(function() {
				
				if(audio_flag == true){
					console.log("audio_start pressed");
					
					play_button_image.src = "./Mic_Yes.png";
					$(play_button).empty();
					$(play_button).append(play_button_image);
					play_button_image.style.height = "100%";
					play_button.style.textAlign = "center";
					
					//To send a message 원격포트로 키와 값을 보냄
					remoteMessagePort.sendMessage([ {
						key : 'command',
						value : "audio_start"
					} ], null);
					
					audio_flag = false;
				}
			});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";
			$("#stop").unbind('click').click(function() {
				
				console.log("audio_stop pressed");	
				
				play_button_image.src = "./Mic_No.png";
				$(play_button).empty();
				$(play_button).append(play_button_image);
				play_button_image.style.height = "100%";
				play_button.style.textAlign = "center";
				
				//To send a message 원격포트로 키와 값을 보냄
				remoteMessagePort.sendMessage([ {
					key : 'command',
					value : "audio_stop"
				} ], null);
				
				audio_flag = true;
				
				audio_stop_send();
			});
		}
		else{
			
			console.log("Joining the room as the classmate");
			
			play_button_image = new Image();
			play_button_image.src = "./Mic_No.png";
			pause_button_image = new Image();
			pause_button_image.src = "./No_Touch_Paint.png";
			stop_button_image = new Image;
			stop_button_image.src = "";
			
			$(play_button).empty();
			$(play_button).append(play_button_image);
			play_button_image.style.height = "100%";
			play_button.style.textAlign = "center";
			$("#play").unbind('click').click(function() {});
			
			$(pause_button).empty();
			$(pause_button).append(pause_button_image);
			pause_button_image.style.height = "100%";
			pause_button.style.textAlign = "center";
			$("#pause").unbind('click').click(function() {});
			
			$(stop_button).empty();
			$(stop_button).append(stop_button_image);
			stop_button_image.style.height = "100%";
			stop_button.style.textAlign = "center";
			$("#stop").unbind('click').click(function() {});
		}
		
		//screen.lockOrientation("landscape-primary");
	});
	
	//채팅방에서 나간 참가자 정보
	socket.on( 'leaved', function(data) {
		
		console.log('<leaved>');
		
		console.log("<leaved> nickName = " + data.nickName + " roomName = " + data.roomName);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + data.nickName +'이' + data.roomName + '번방에서 퇴장</li>');						
		
		$('.ui-li-bubble-receive')[$('.ui-li-bubble-receive').length - 1].scrollIntoView(true);
		
		navigator.vibrate(500);	
		
		//screen.lockOrientation("landscape-primary");
		//final_voice_change = "";
		//socket.emit('echo_voice_change', {voice_change : final_voice_change, roomName: roomName});
	});
	
	//나가기 버튼 
	$('#roomExit').off("click").on("click", function() {
		
		console.log('<roomExit>');
		
		console.log("roomExit 버튼 누름" );
		socket.emit('leave', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url});	
		
		screen.lockOrientation("portrait-primary");
		
		close_all_drawers();
		socket.emit('roomList');
		
		final_voice_change = "";
		socket.emit('echo_voice_change', {voice_change : final_voice_change, roomName: roomName});
		
		change_page_class_list();
		//나가기 버튼을 누른다면 방에 적어졌던 데이터는 모두 지우는 코드 필요함!!!!!!!!!!!
		
		console.log("audio_stop pressed for leaving the room");
		
		//To send a message 원격포트로 키와 값을 보냄
		remoteMessagePort.sendMessage([ {
			key : 'command',
			value : "audio_stop"
		} ], null);
		
		audio_flag = true;
		
		audio_stop_send();

	});
	
	socket.on('disconnect', function() {
		
		console.log('<disconnect>');
		
		console.log("서버가 다운");
		
		screen.lockOrientation("portrait-primary");
		$.mobile.changePage("main");
		screen.lockOrientation("portrait-primary");
		
		$("all_active_class").empty();
		
		
		console.log("audio stopped for server disconnection");
		
		//To send a message 원격포트로 키와 값을 보냄
		remoteMessagePort.sendMessage([ {
			key : 'command',
			value : "audio_stop"
		} ], null);
		
		audio_flag = true;
		
		
		fix_tabbar_width();
	});
	
	socket.on('connect', function(){
		
		console.log('<connect>');
		
		socket.emit('roomList');
		
		/*
		console.log("audio stopped for server connection / reconnection");
		
		//To send a message 원격포트로 키와 값을 보냄
		remoteMessagePort.sendMessage([ {
			key : 'command',
			value : "audio_stop"
		} ], null);
		
		audio_flag = true;
		*/
		
		fix_tabbar_width();
		
	});
}

//팝업창을 띄운다음에 ok 한다면  만들어진 방에 대한 함수인 joinRoom 메세지 보내게 하게 !!
	

function am_i_master(){			// Am I the master ?
	
	if(nickName == master_name){ return true; }
	else{ return false; }
}

function do_i_have_permit(){	// Do I have the permisison for microhpone?
	
	if(nickName == final_voice_change){ return true; }
	else{ return false; }
}


function init_friend_list(me){
	
	console.log("Init the friend list");
	
	$('#my_friend_list').empty();
	
	var ME = '<li data-role="list-divider">Me</li>' +        
                '<li class="friend_list_element ui-li-has-thumb ui-li-anchor ui-li">' +
		 			'<a href="#">' +
	 					'<img src=' + "http://graph.facebook.com/" + me.id + "/picture" + ' class="ui-li-bigicon ui-li-thumb" />' +
	 					'&nbsp;' + me.name +
	 					/*<span class="ui-li-text-sub">
	 						<h5 class="speciality" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
	 							Electronics and Communication
	 						</h5>
	 						<h5 class="organization" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
	 							Hanyang Univeristy
	 						</h5>
	 						<h5 class="status" style="margin:0; padding-bottom:3px; font-size:70%; color:green;">
	 							Free
	 						</h5>
	 					</span>*/
 					'</a>' +
                '</li>' + '<li data-role="list-divider">Friends</li>';
	
	$('#my_friend_list').append(ME);
}

function refresh_friend_list(friend_list){
	
	console.log("Refresh the friend list");
	
	var friend = '<li class="friend_list_element ui-li-has-thumb ui-li-anchor ui-li"';
	
	for(var i = 0; i < friend_list.length; i++){
		
		friend = friend + ' id=' + friend_list[i].id + '>' + 
					'<a href="#">';
		friend = friend + '<img src=http://graph.facebook.com/' + friend_list[i].id + '/picture' + ' class="ui-li-bigicon ui-li-thumb" />';
		friend = friend + '&nbsp;' + friend_list[i].name;
		/*friend = friend + <span class="ui-li-text-sub">
									<h5 class="speciality" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
									Electronics and Communication
								</h5>
								<h5 class="organization" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
									Hanyang Univeristy
								</h5>
								<h5 class="status" style="margin:0; padding-bottom:3px; font-size:70%; color:green;">
									Free
								</h5>
							</span>; */
		friend = friend + '</a> </li>';
		
		$('#my_friend_list').append(friend);
		
		friend = '<li class="friend_list_element ui-li-has-thumb ui-li-anchor ui-li"';
					
	}
}

function refresh_friend_select_list(friend_list){
	
	$('#select_friend_list').empty();
	$('#select_friend_list').append('<li data-role="list-divider" id="top">Choose Your Classmates</li>');
	
	console.log("Refresh the friend list");
	
	//////////////////////////////////////////////////////////////////////////
	$('#invite_friend_list').empty();
	$('#invite_friend_list').append('<li data-role="list-divider" id="top">Choose Your Classmates</li>');
	
	console.log("Refresh the friend list for sending invites");
	//////////////////////////////////////////////////////////////////////////
	
	var friend = '<li class="select_friend_list_element ui-li-has-thumb ui-li-anchor ui-li">';
	
	for(var i = 0; i < friend_list.length; i++){
		
		friend = friend +  
					'<a href="#" onclick="add_the_selected(this);" id=' + friend_list[i].id + ' class="select_item">';
		friend = friend + '<img src=http://graph.facebook.com/' + friend_list[i].id + '/picture' + ' class="ui-li-bigicon ui-li-thumb" />';
		friend = friend + '&nbsp;' + friend_list[i].name;
		/*friend = friend + <span class="ui-li-text-sub">
									<h5 class="speciality" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
									Electronics and Communication
								</h5>
								<h5 class="organization" style="margin:0; padding-bottom:3px; font-size:70%; font-weight:normal;">
									Hanyang Univeristy
								</h5>
								<h5 class="status" style="margin:0; padding-bottom:3px; font-size:70%; color:green;">
									Free
								</h5>
							</span>; */
		friend = friend + '</a> </li>';
		
		$('#select_friend_list').append(friend);
		
		////////////////////////////////////////////////////////////////////////
		$('#invite_friend_list').append(friend);
		////////////////////////////////////////////////////////////////////////
		
		friend = '<li class="select_friend_list_element ui-li-has-thumb ui-li-anchor ui-li">';
					
	}
}

function empty_class_list(){
	
	$('#active_class_list ul').empty();
}

//만들어진 방에 참가 || 초대팝업에 응답했을 경우
function enter_class(room_num, classTitle){
	
	$('#invite_title h1').text('has invited you to the class');
	
	console.log(classTitle);
	$('#teacher_screen #header_title #class_title').text(classTitle);
	
	console.log("만들어진 방 참가" );	
	roomName = room_num;
	socket.emit('joinRoom', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url}); //참가하고 자 하는 방에 정보 전송
	
	clear_canvas();
	
	close_invite_popup();
	
	
	
	var editDrawerElement = document.getElementById("editDrawer");
 	
	var editDrawer = tau.widget.Drawer(editDrawerElement);
	
	editDrawer.close();
	edit_menu_open = false;
	
	var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
 	
	var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
	
	classmate_list_drawer.close();
}

//초대팝업에 거절 했을 경우
function reject_class(room_num){
	
	$('#invite_title h1').text('has invited you to the class');
	
	console.log("초대에 거부" );	
	socket.emit('rejectJoinRoom', {nickName: nickName, id: id, roomName: room_num, pic_url: pic_url}); //참가하고 자 하는 방에 정보 전송
	
	close_invite_popup();
}


function add_class(title, participant_list, room_number){
	
	var class_title = "'" + title + "'";
	
	console.log(class_title);
	
	var new_class = '<li id=' + 'room' + room_number + ' onclick="expand_class_list(this);" style="height:30px; overflow:hidden; padding-top:0px; border-bottom: solid #99CCFF; border-bottom-width:1px;" class="ui-li ui-li-static ui-li-has-right-btn ui-li-last" tabindex="0">' +   	
						'<div style="padding:0px; margin:0px;">' + 
							'<h4 style="padding:5px; padding-top:15px; margin:0px;" class="ui-li-heading">' +
								'Title: ';
	
	new_class = new_class + title + 	
				'</h4>' +
				'<h5 style="padding:5px; margin:0px; font-size:70%;" class="ui-li-heading">' +
					'Participant:' +
				'</h5>' +
				'<ul id="participant_list">';
	
	for(var i = 0; i < participant_list.length; i++){
		
		new_class = new_class + 
					'<li style="font-size:70%;">' + participant_list[i].text + " / " + participant_list[i].id + '</li>';
	}
	
	new_class = new_class + 
				'</ul>' +
				'<br>' +
				'<button onclick="enter_class(' + room_number + ',' + class_title + ');">Enter</button>' +
				'</div>' +
				'</li>';	
									
	$('#all_active_class').append(new_class);
}

function add_class_from_server(title, participant_list, room_number){
	
	var class_title = "'" + title + "'";
	
	console.log(class_title);
	
	var new_class = '<li id=' + 'room' + room_number + ' onclick="expand_class_list(this);" style="height:30px; overflow:hidden; padding-top:0px; border-bottom: solid #99CCFF; border-bottom-width:1px;" class="ui-li ui-li-static ui-li-has-right-btn ui-li-last" tabindex="0">' +   	
						'<div style="padding:0px; margin:0px;">' + 
							'<h4 style="padding:5px; padding-top:15px; margin:0px;" class="ui-li-heading">' +
								'Title: ';
	
	new_class = new_class + title + 	
				'</h4>' +
				'<h5 style="padding:5px; margin:0px; font-size:70%;" class="ui-li-heading">' +
					'Participant:' +
				'</h5>' +
				'<ul id="participant_list">';
	
	for(var i = 0; i < participant_list.length; i++){
		
		new_class = new_class + 
					'<li style="font-size:70%;">' + participant_list[i].nickName + '</li>';
	}
	
	new_class = new_class + 
				'</ul>' +
				'<br>' +
				'<button id="enter_button" onclick="enter_class(' + room_number+ ',' + class_title + ');">Enter</button>' +
				'</div>' +
				'</li>';	
									
	$('#all_active_class').append(new_class);
}

function remove_class(room_number){
	//chu  여기는 방 인원이 0일때 불리수 있도록
	$('#active_class_list ul ' + '#room' + room_number).remove();
}

//마이크 권한 변경
function changePrivilege(master_name, master_id) {
	socket.emit('changePrivilege', { nickName: nickName, id: id, roomName: roomName, master_name: master_name, master_id: master_id});
}



