var new_class = '<li id="active_class_list1" onclick="expand_class_list(this);" style="height:30px; overflow:hidden; padding-top:0px;">' +   	
					'<div style="padding:0px; margin:0px;">' + 
				'<h4 style="padding:5px; padding-top:15px; margin:0px;">' +
					'Title: Integrated Circuit' +
				'</h4>' +
				'<h5 style="padding:5px; margin:0px; font-size:70%;">' +
					'Participant:' +
				'</h5>' +
				'<ul id="participant_list">' +
					'<li style="font-size:70%;">' + 'Participant 1' + '</li>' +
				'</ul>' +
				
				'<div data-role="button" data-inline="false" style="margin-top:25px;" id="joinRoom">Enter</div>' +
				
				'</div>' +
				'</li>';

function room_socket_init() {
	
	socket = io('http://211.189.127.154:53597');	
	
	//전체 room의 대한 정보를 가져옴
	socket.emit('roomList');
	socket.on('roomList', function(data) {
	console.log("<roomList>");
		for(var i = 0; i < data.length; i++)
			console.log(data[i]);
		
		//html 방 정보 뿌려지 추가 해야함
	});
		
	//전체 방 새로고침 버튼 
	$('#roomListRefresh').off("click").on("click", (function() {
		console.log("roomListRefresh 버튼 누름" );
		socket.emit('roomList');
	}));
	
	//친구 찾기 및 선택
	$('#find_friends').off("click").on("click", (function() {
		
		change_select_friend();
	}));
	
	//본인이 방 생성 버튼
	$('#start_class').off("click").on("click", (function() {
		/*
		console.log("방 create 버튼 누름" );
		
		socket.emit('requestRoomNum', id); //방 키값 받음
		socket.on('requestRoomNum', function(data) {
			console.log("requestRoomNum = " + data);	
			roomName = data;		
			socket.emit( 'createRoom', {nickName: nickName, roomName: roomName, pic_url: pic_url});  /////////////////여기에 초대자들 정보도 같이 보내야함!!!!나중에 추가
			
			screen.lockOrientation("landscape-primary");
			change_student_screen();
		});
		*/
		screen.lockOrientation("landscape-primary");
		change_student_screen();
	}));
	
	//만들어진 방 참가 버튼
	$('#joinRoom').off("click").on("click", function() {	
		
		console.log("joinRoom 버튼 누름" );	
		roomName = 5;
		socket.emit('joinRoom', {nickName: nickName, roomName: roomName, pic_url: pic_url}); //참가하고 자 하는 방에 정보 전송
		
		//기존 방에 있는 사람 리스트 받아옴
		socket.on('roomJoinUsers', function(data) {	
			//console.log("기존 방에 있는 사람 리스트 받아옴  data.attendants.length = " +  data.attendants.length);	
			
			if(data.attendants.length > 0) {
				var attendants_list = "";
				for(var i = 0; i < data.attendants.length; i++)	{
					attendants_list += data.attendants[i];
					if(i != data.attendants.length - 1)
						attendants_list += ", ";	
				}
				$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + attendants_list + '님이 방에 있습니다.</li>');				
				
				console.log("attendants_list = " +  attendants_list);							
			}
			screen.lockOrientation("landscape-primary");
			change_student_screen();
		});	
		
		screen.lockOrientation("landscape-primary");
		change_student_screen();
	});
	
	//있던 방에 참여한 참가자 정보 받아옴
	socket.on('joined', function(data) {	
		console.log("<join> nickName = " + data.nickName + " roomName : " + data.roomName + " pic_url = " + data.pic_url);
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static"<img src = ' + pic_url + '>' + data.nickName +'이' + data.roomName + '번방에 입장 </li>');				
		
		navigator.vibrate(500);
	});
	
	
	//나가기 버튼 
	$('#roomExit').off("click").on("click", function() {	
		
		console.log("roomExit 버튼 누름" );
		socket.emit('leave', {nickName: nickName, roomName: roomName, pic_url: pic_url});	
		
		screen.lockOrientation("portrait-primary");
		//window.history.back();
		change_page_class_list();
		//나가기 버튼을 누른다면 방에 적어졌던 데이터는 모두 지우는 코드 필요함!!!!!!!!!!!
	});
	
	//채팅방에서 나간 참가자 정보
	socket.on( 'leaved', function(data) {
		console.log("<leaved> nickName = " + data.nickName + " roomName = " + data.roomName);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static"' + data.nickName +'이' + data.roomName + '번방에서 퇴장<li>');						
		navigator.vibrate(500);
		
		//html 에서 참가자 제거 코드 넣기	
	});
	
	//친구 선택 후 초대버튼
	//ivite 버튼 아직 없음 만들어야함~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
	$('#invite').off("click").on("click", (function() {
	
		console.log("invite 버튼 누름" );
		
		//data 가져오는 소스 만들어야함
		
		socket.emit('inviteUserList',  "         "  );
		//필드  nickName 
		
		//자기 자신 html 에 초대했습니다 띄우기
	
	}));
	
	//초대자들 목록 받아옴
	socket.on('inviteUserList', function(data) {	
		console.log("초대자들 목록 받아옴" );	
		
		//필드  nickName값 받아서 html에 초대 하였습니다 출력하기  
		//for(var i = 0; i < data.attendants.length; i++)	
		//	$('#chat ul').append('<li><img src = ' + data.userPic[i] + '>'+ data.attendants[i]);
		
		navigator.vibrate(500);
		
	});
}

//팝업창을 띄운다음에 ok 한다면  만들어진 방에 대한 함수인 joinRoom 메세지 보내게 하게 !!
	





//socket.on('disconnect', function(data) {
//	console.log("server is disconnect" );	
//	screen.lockOrientation(previous_screen_orientation);			
//	window.history.back();
//});





