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