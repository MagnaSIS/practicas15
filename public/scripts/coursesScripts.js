function hide_show(id){

	var up1 = document.getElementById(id + "_up_1");
	var up2 = document.getElementById(id + "_up_2");	
	var down1 = document.getElementById(id + "_down_1");
	var down2 = document.getElementById(id + "_down_2");

	if(up1.offsetParent === null){
		up1.style.display = "block";
		up2.style.display = "block";
		down1.style.display = "none";
		down2.style.display = "none";
	}
	else{
		up1.style.display = "none";
		up2.style.display = "none";
		down1.style.display = "block";
		down2.style.display = "block";
	}
	
}

function selectCourse(course_id) {
	var id = '#' + course_id;
	$.post('/students/courses/select', {
		id: course_id
	}, function(data) {
		$(id).removeClass('alert-info');
		$(id).children(id + '_2').text(data.inscritos[2]);
		$(id).children(id + '_3').text(data.inscritos[3]);
		$(id).children(id + '_4').text(data.inscritos[4]);
		if (data.lleno) {
			$(id).addClass('alert-danger');
		} else {
			$(id).addClass('alert-success');
		}
		$(id + '_button').text('Descartar');
		$(id + '_button').attr("onclick", "removeCourse('"+course_id+"')");
	});
}

function removeCourse(course_id) {
	var id = '#' + course_id;
	$.post('/students/courses/remove', {
		id: course_id
	}, function(data) {
		$(id).removeClass('alert-danger alert-success');
		$(id).children(id + '_2').text(data.inscritos[2]);
		$(id).children(id + '_3').text(data.inscritos[3]);
		$(id).children(id + '_4').text(data.inscritos[4]);
		$(id).addClass('alert-info');
		$(id + '_button').text("Seleccionar");
		$(id + '_button').attr("onclick", "selectCourse('"+course_id+"')");
	});
}