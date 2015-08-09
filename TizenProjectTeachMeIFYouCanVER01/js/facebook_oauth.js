var oauthurl = "https://www.facebook.com/dialog/oauth?";
var client_id = "535218969958834";
var redirect_uri = "https://www.facebook.com/connect/login_success.html";
var scope = "public_profile,email,user_friends,user_photos,user_hometown,user_location,read_custom_friendlists,user_photos";
var final_uri = oauthurl + 'client_id=' + client_id + '&redirect_uri=' + redirect_uri + "&scope=" + scope;
var client_secret="1533043b6b2efd0abfe54b55a0cc9b6a";
//var name = "chu", id = "123", nickName = "chu123", roomName, pic_url = "http://graph.facebook.com/805566542823060/picture";
var name = "kim", id = "123", nickName = "kim123", roomName, pic_url = "http://graph.facebook.com/567949783318787/picture";

var loading_flag;

function FBLogin_check() {
	if(localStorage.getItem('accesstoken') !== null) {	
		/// DEBUG
		console.log("로그인 되어 있음");
		console.log("localStorage['accesstoken'] = " + localStorage['accesstoken']);
		
		getProfile();		
		getFriends();

		room_socket_init();
		chat_init();
	}
}

function FBLogin(){
	console.log("inside login");
	window.authWin = window.open(final_uri, "blank", "", true);
	montiorURL();
}
   
function montiorURL() {
	console.log("montiorURL");
    var check = 0;
      
    window.int = self.setInterval(function () {
    	window.authCount = window.authCount + 1;
   
	    if (window.authWin && window.authWin.location && check == 0) { 
	    	var currentURL = window.authWin.location.href;
	        var inCallback = currentURL.indexOf("?code");
	        if (inCallback >= 0) {
	           var codeData = currentURL.substr(currentURL.indexOf("="));
	           var code=codeData.substring(1);
	           getAccesstoken(code);
	           check = 1;
	        }
	    }
    }, 100);
}
   
function  getAccesstoken(code){
	$.ajax({
           type : "GET",
           url :'https://graph.facebook.com/oauth/access_token?client_id='+client_id+'&redirect_uri='+redirect_uri+'&client_secret='+client_secret+'&code='+code,
           success : function(data) {
        	   try {
        		   console.log("getAccesstoken acess success");
        		   accesstoken=data;
				   access_token=parseToken(accesstoken);
				   localStorage.setItem('accesstoken', access_token);
			   
				   getProfile();
				   getFriends();
				   
				   room_socket_init();
				   chat_init();
				      
				   window.clearInterval(int);
				   window.authWin.close();			          

				   //$.mobile.changePage("main");   
        	   }
        	   catch (e) {
        		   console.log("getAccesstoken = " + e);
        	   }
           },
           error : function() {
        	   $.mobile.changePage("loginPage");
        	   console.log("acess token error");
           }
    });    
}
   
function parseToken(accesstoken){
	var c = accesstoken.indexOf('access_token') ; 
	var L = accesstoken.indexOf('&expires') ;
	var y = accesstoken.substring(0, c) + accesstoken.substring(L, accesstoken.length);
	var remaining = accesstoken.replace(y,'');
   
	return (remaining.substring(13));
}

var MY_PROFILE_LOADED;

function getProfile() {
	$.ajax({
           type : "GET",
           dataType : 'json',
           url : 'https://graph.facebook.com/me?flied=id,name,picture&access_token=' + localStorage['accesstoken'] ,
           success : function(data) {       
		       name = data.name;
		       id = data.id;
		       nickName = name + id;
		       
		       MY_PROFILE_LOADED = data;
		       
		       //init_friend_list(data);
		       
		       console.log("Loading my profile has finished");
		   },
		   error : function() {
			   $.mobile.changePage("loginPage");
			   console.log("Unable to get my profile");
	       }
	});
}

var MY_FRIENDS_LOADED;
var main_flag = false;

function getFriends(){
	$.ajax({
		type : "GET",
		dataType : 'json',
		url : 'https://graph.facebook.com/me/friends?&access_token=' + localStorage['accesstoken'],
		success : function(data) {
				var jsonlength=data.data.length;
				
				MY_FRIENDS_LOADED = data.data;
				
				//refresh_friend_list(data.data);
				
				console.log("Loading friend profiles has finished");
				
				main_flag = true;
				
				//$.mobile.changePage("main");
		}
		,error : function() {
				console.log("Unable to get your friends on Facebook");
			
			}
	});
}
   
var logout_flag = false;

function FBLogout() {
	$.ajax({
		type : "GET",
		url :'https://www.facebook.com/logout.php?next=https://www.facebook.com/connect/login_success.html&access_token='+localStorage['accesstoken'],
		success : function(data) {
			localStorage.clear();
			//$.mobile.changePage("loginPage");  
			
			logout_flag = true;
		},
		error: function(){
			console.log("facebook logout error");
		}
    });
}


