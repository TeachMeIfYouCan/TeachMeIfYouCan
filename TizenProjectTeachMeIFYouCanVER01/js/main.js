function expand_class_list(item){
	
	var class_list = item;
	
	var list_num = class_list.children[0].children[2].children.length;
	
	var title_height = class_list.children[0].children[0].offsetHeight;
	var participant_height = class_list.children[0].children[1].offsetHeight;
	var button_height = class_list.children[0].children[3].offsetHeight;
	
	if(list_expand_toggle == 0){
		class_list.style.height = list_num*16 + title_height + participant_height + button_height + 30 + "px";
		list_expand_toggle = 1;
	}
	else if(list_expand_toggle == 1){
		class_list.style.height = "30px";
		list_expand_toggle = 0;
	}
}


function change_student_screen(){
	
	screen.lockOrientation("landscape-primary");
	$.mobile.changePage("teacher_screen");
}

function change_page_class_list(){
	
	screen.lockOrientation("portrait-primary");
	//history.back();
	$.mobile.changePage("page_class_list");
}


$('#page_friend_button').off("click").on("click", (function() {
	console.log("main 버튼 누름" );
	$.mobile.changePage("main");
}));

$('#page_class_button').off("click").on("click", (function() {
	console.log("page_class 버튼 누름" );
	$.mobile.changePage("page_class_list");

}));

$('#page_option_button').off("click").on("click", (function() {
	console.log("page_option 버튼 누름" );
	$.mobile.changePage("page_option_list");
}));
