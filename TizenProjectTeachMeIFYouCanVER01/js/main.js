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
	
	tau.changePage("teacher_screen.html");
}


