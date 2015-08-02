( function () {
	window.addEventListener( 'tizenhwkey', function( ev ) {
		if( ev.keyName === "back" ) {
			var page = document.getElementsByClassName( 'ui-page-active' )[0],
				pageid = page ? page.id : "";
			if( pageid === "main" ) {
				try {
					tizen.application.getCurrentApplication().exit();
				} catch (ignore) {
				}
			} else {
				
				screen.lockOrientation(previous_screen_orientation);
				
				window.history.back();
			}
		}
	} );
} () );

var oauthurl = "https://www.facebook.com/dialog/oauth?";
var client_id = "535218969958834";
var redirect_uri = "https://www.facebook.com/connect/login_success.html";
var scope = "public_profile,email,user_friends,user_photos,user_hometown,user_location,read_custom_friendlists,user_photos";
var final_uri = oauthurl + 'client_id=' + client_id + '&redirect_uri=' + redirect_uri + "&scope=" + scope;

//$(document).ready(function() {
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
	        /*
	        if (window.authCount > 30) {
	            alert('30 seconds time out');
	            window.authCount  =0;
	            window.clearInterval(int)
	            window.authWin.close();
	        }
	        */
		}, 100);
	}
	
	function  getAccesstoken(code){
	    $.ajax({
	        type : "GET",
	        url :'https://graph.facebook.com/oauth/access_token?client_id=535218969958834&redirect_uri=https://www.facebook.com/connect/login_success.html&client_secret=1533043b6b2efd0abfe54b55a0cc9b6a&code='+code,
	        success : function(data) {
	            try {
	            	console.log("getAccesstoken acess success");
	                accesstoken=data;
	                access_token=parseToken(accesstoken);
	                localStorage['accesstoken']=access_token;
	                tau.changePage("page_friend_list.html");            	
	                window.clearInterval(int);
	                window.authWin.close();
	               
	            }
	            catch (e) {
	                console.log(e);
	            }
	        },
	        error : function() {
	        	tau.changePage("facebook_login.html");
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
	
	function getProfile() {
		$.ajax({
	        type : "GET",
	        dataType : 'json',
	        url : 'https://graph.facebook.com/me?fields=first_name,last_name&access_token=' +localStorage['accesstoken'] ,
	        success : function(data1) {
		          
	            var firstname=data1.first_name;
	            var lastname=data1.last_name;     
	    
	            var pic_url=data1.picture.data.url;
	
	            $('#getProfile ul').append('<li><span>MyPofile</span> <br>'            					
	    	            					+ '<img src = ' + pic_url + '>');				
	        },
	        error : function() {
	        	tau.changePage("facebook_login.html");
	            console.log("Unable to get my profile");
	        }
	    });
	}
	
	function getFriends(){
	    $.ajax({
	        type : "GET",
	        dataType : 'json',
	        url : 'https://graph.facebook.com/me/friends?&access_token=' +localStorage['accesstoken'],
	        success : function(data1) {
	            var jsonlength=data1.data.length;
	         
	            $('#getFriends ul').append('<li><span>MyFriendList</span><br>');
	            
	            for(i=0;i < jsonlength;i++)
	            {
	                names=data1.data[i].name;
	                id=data1.data[i].id;
	                img_url="http://graph.facebook.com/"+id+"/picture";
	                console.log("i = " + i + " names = " + names + " id = " + id);
	
	                $('#getFriends ul').append('<img src = ' + img_url + '>'
	    					+ " names = " + names + " id = " + id);				
	            }
	
	            $('#getFriends ul').append('</li>');	
	         },
	         error : function() {
	         	console.log("Unable to get your friends on Facebook");
	         }
	    });
	}
	
	function Logout()
	{
	    $.ajax({
	        type : "GET",
	        url :'https://www.facebook.com/logout.php?next=https://www.facebook.com/connect/login_success.html&access_token='+localStorage['accesstoken'],
	        success : function(data) {
	        	tau.changePage("facebook_login.html");      
	        },
	    	error: function(){console.log("error");}
	    });
	}
//});