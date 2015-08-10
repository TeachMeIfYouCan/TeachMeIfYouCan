var master_name;
var master_id;

function room_socket_init() {
	
	console.log("Start initializing the socket");
	
	socket = io('http://211.189.127.154:53597');	
	
	//전체 room의 대한 정보를 가져옴
	socket.emit('roomList');
	socket.on('roomList', function(data) {
		
		console.log("<roomList>");
	
		empty_class_list();
	
		for(var i = 0; i < data.length; i++){
			console.log(data[i]);
			
			add_class_from_server(data[i].roomName, data[i].attendants, data[i].roomName);
		}		
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
	
	//본인이 방 생성
	$('#start_class').off("click").on("click", (function() {
		
		console.log("방 create 버튼 누름" );	
		socket.emit('requestRoomNum'); //생성할 방 키 요청
	}));
	
	//생성할 방 키값 받음 그 후 방 생성
	socket.on('requestRoomNum', function(data) {
		console.log("requestRoomNum = " + data);	
		roomName = data;		
		socket.emit( 'createRoom', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url});  /////////////////여기에 초대자들 정보도 같이 보내야함!!!!나중에 추가
		
		add_class(roomName, select_list, roomName);
	
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
		
		socket.emit('inviteUserList', { roomName: roomName, nickName: nickName, id: id, inviteUserArray: inviteUserArray});	
		
		console.log("본인이 참여 nickName = " + nickName + " roomName : " + roomName + " pic_url = " + data.pic_url);
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + nickName +'이' + roomName + '번방에 입장 </li>');				
		
		screen.lockOrientation("landscape-primary");
		
		select_list.pop();
		
		change_student_screen();
	});
			
	//초대자들 목록 받아와서 자신의 name과, id받아와서 맞으면 참여할껀지 팝업 띄어줌
	socket.on('inviteUserList', function(data) {	
		console.log("초대자들 목록 받아옴");	
		console.log("data.inviteUserArray = " + data.inviteUserArray);		
		console.log("nickName = " + nickName + " id = " + id)
		for(var i = 0; i < data.inviteUserArray.length; i++) {						
			
			console.log("data.inviteUserArray[i].text = " + data.inviteUserArray[i].text + " data.inviteUserArray[i].id = " + data.inviteUserArray[i].id)
			
			if(id == data.inviteUserArray[i].id) {
				
				console.log("아이디가 맞아서 팝업창 띄움");
				open_invite_popup();
				
				var invite_title = document.getElementById("invite_title").text;
				
				document.getElementById("invite_title").text = data.nickName + " " + invite_title;
				
				var title = document.getElementById("invite_class_title").text;
				
				document.getElementById("invite_class_title").text = title + " " + data.roomName;

				navigator.vibrate(500);
				
				//초대 찬성
				$('#invite_accept').off("click").on("click", (function() {	
					enter_class(data.roomName);
				}));
				//초대 거부
				$('#invite_deny').off("click").on("click", (function() {	
					reject_class(data.roomName);
				}));			
			}
		}		
	});
	
	//있던 방에 참여한 참가자 정보 받아옴
	socket.on('joined', function(data) {	
		console.log("<join> nickName = " + data.nickName + " roomName : " + data.roomName + " pic_url = " + data.pic_url);
				
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static"<img src = ' + pic_url + '>' + data.nickName +'이' + data.roomName + '번방에 입장 </li>');				
		navigator.vibrate(500);
		
		//참가자가 들어오면 마스터가 전체로 그려진 그림을 전송함
		if(master_name == data.master_name)
			sendBackgroundImage();
	});
	
	//기존 방에 있는 사람 리스트 받아옴
	socket.on('roomJoinUsers', function(data) {	
		//console.log("기존 방에 있는 사람 리스트 받아옴  data.attendants.length = " +  data.attendants.length);	
		master_name = data.master_name;
		
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
	
	//초대에 거부한 사용자 정보 받아옴
	socket.on('rejectJoinRoom', function(data) {	
		console.log("<rejectJoinRoom> nickName = " + data.nickName + " roomName : " + data.roomName);				
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + data.nickName +'이' + data.roomName + '번방에 초대 거부</li>');				
		navigator.vibrate(500);		
	});
	
	//채팅방에서 나간 참가자 정보
	socket.on( 'leaved', function(data) {
		console.log("<leaved> nickName = " + data.nickName + " roomName = " + data.roomName);		
		$('#chat ul').append('<li class="ui-li-bubble-receive ui-li ui-li-static">' + data.nickName +'이' + data.roomName + '번방에서 퇴장</li>');						
		navigator.vibrate(500);	
	});
	
	//나가기 버튼 
	$('#roomExit').off("click").on("click", function() {	
		console.log("roomExit 버튼 누름" );
		socket.emit('leave', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url});	
		
		
		
		var editDrawerElement = document.getElementById("editDrawer");
		
		var editDrawer = tau.widget.Drawer(editDrawerElement);
		
		editDrawer.close();
		edit_menu_open = false;
		
		var classmate_list_drawer_Element = document.getElementById("classmates_list_drawer");
		
		var classmate_list_drawer = tau.widget.Drawer(classmate_list_drawer_Element);
		
		classmate_list_drawer.close();
		
		
		
		screen.lockOrientation("portrait-primary");
		change_page_class_list();
		//나가기 버튼을 누른다면 방에 적어졌던 데이터는 모두 지우는 코드 필요함!!!!!!!!!!!
	});
}

//팝업창을 띄운다음에 ok 한다면  만들어진 방에 대한 함수인 joinRoom 메세지 보내게 하게 !!
	

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
		
		friend = '<li class="select_friend_list_element ui-li-has-thumb ui-li-anchor ui-li">';
					
	}
}

function empty_class_list(){
	
	$('#active_class_list ul').empty();
}

//만들어진 방에 참가 || 초대팝업에 응답했을 경우
function enter_class(room_num){
	
	console.log("만들어진 방 참가" );	
	roomName = room_num;
	socket.emit('joinRoom', {nickName: nickName, id: id, roomName: roomName, pic_url: pic_url}); //참가하고 자 하는 방에 정보 전송
	
	clear_canvas();
	
	close_invite_popup();
}

//초대팝업에 거절 했을 경우
function reject_class(room_num){
	
	console.log("초대에 거부" );	
	socket.emit('rejectJoinRoom', {nickName: nickName, id: id, roomName: room_num, pic_url: pic_url}); //참가하고 자 하는 방에 정보 전송
	
	close_invite_popup();
}


function add_class(title, participant_list, room_number){
	
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
				'<button onclick="enter_class(' + room_number + ');">Enter</button>' +
				'</div>' +
				'</li>';	
									
	$('#all_active_class').append(new_class);
}

function add_class_from_server(title, participant_list, room_number){
	
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
					'<li style="font-size:70%;">' + participant_list[i] + '</li>';
	}
	
	new_class = new_class + 
				'</ul>' +
				'<br>' +
				'<button id="enter_button" onclick="enter_class(' + room_number + ');">Enter</button>' +
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
	
	socket.emit('changePrivilege', { nickName: nickName, id: id, roomName: roomName, master_name: master_name, master_id: master_id})
	
	socket.on('changePrivilege', function(data) {	
		console.log("<changePrivilege> nickName = " + data.nickName + " roomName : " + data.roomName + " master_name = " + master_name + " master_id = " + master_id);
		
		master_name = data.master_name;
		master_id = data.master_id;
		
		//여기 이제 master_id로 권한 바꾸는 함수 넣어야함
		navigator.vibrate(500);
	});
}



