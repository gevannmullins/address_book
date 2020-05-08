$(document).ready(function() {
	$(".bffn").click(function(e){
		e.preventDefault();
		$("#mainContainer").show();
		//var getReload = $(this).attr('reload');
		var getPage = $(this).attr('page');
		var Page = '../functions/'+getPage+'.php';
		var formData = $(this).attr('link');
		var DoRefresh = $("#ToggleRefreshReport").is(':checked');
		
		if(DoRefresh==true) {
			var getReload = $(this).attr('reload');
		}else{
			var getReload = 0;
		}
		
		if(getReload>0){
			var Reload = getReload*60000;
			$("#mainContainer").html('<img id="preloader" src="../img/preloader.gif">');
			LoadContent();
			setInterval(function(){
			//setTimeout(function(){
				$("#mainContainer").html('<img id="preloader" src="../img/preloader.gif">');
				LoadContent();
			}, Reload);
		}else{
			$("#mainContainer").html('<img id="preloader" src="../img/preloader.gif">');
			LoadContent();
		}

		function LoadContent(){
			$.ajax({
				type: "POST",
				url: Page,
				data : formData,
				//data: { },
				success: function(data, textStatus, jqXHR){
					$('#mainContainer').html(data);
				},
				error: function (jqXHR, textStatus, errorThrown){
					$('#mainContainer').html(textStatus);
				}
			});
		}
	});
	
	$("#home").click(function(e){
		e.preventDefault();
		window.location.href='../home';
	});	
	
	$("#dashboard_buy_credits").click(function(e){
		e.preventDefault();
		window.location.href='../credits';
	});
	
	/* Profile - Credits Start */
	$("#profile_buy_credits").click(function(e){
		e.preventDefault();
		$("#profile_menu").hide("slide");
		$('#profile_new_header').html('<strong>Credits: </strong> <font style="color:#A1C938;">Select required amount</font>');
		$("#profile_content_manager").show("slide");
		$("#profile_new_content").html('<center><img id="preloader" src="../img/preloader.gif"></center>');	
		var formData = $('#profile_link').val();
		$('#profile_new_content').load('../functions/profile_creditamounts.php?'+formData,function(responseTxt,statusTxt,xhr){	
		if(statusTxt=="error")
			alert("Error: "+xhr.status+": "+xhr.statusText);
		});
	});
	/* Profile - Credits End */

	/* Profile - Edit Start */
	$("#profile_edit_profile").click(function(e){
		e.preventDefault();
		$("#profile_menu").hide("slide");
		$('#profile_new_header').html('<strong>Profile: </strong> <font style="color:#A1C938;">Edit</font>');
		$("#profile_content_manager").show("slide");
		$("#profile_new_content").html('<center><img id="preloader" src="../img/preloader.gif"></center>');	
		var formData = $('#profile_link').val();
		$('#profile_new_content').load('../functions/profile_edit_profile.php?'+formData,function(responseTxt,statusTxt,xhr){	
		if(statusTxt=="error")
			alert("Error: "+xhr.status+": "+xhr.statusText);
		});
	});
	/* Profile - Edit End */
	
	/* Credits Start */
	$("#credits_new_content").html('<center><img id="preloader" src="../img/preloader.gif"></center>');	
	var formData = $('#profile_link').val();
	$('#credits_new_content').load('../functions/credits_creditamounts.php?'+formData,function(responseTxt,statusTxt,xhr){	
	if(statusTxt=="error")
		alert("Error: "+xhr.status+": "+xhr.statusText);
	});
	/* Credits End */
});