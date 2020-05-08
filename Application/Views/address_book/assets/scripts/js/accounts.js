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
	
	$('#home').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.location.href='../home';
	});	
	
	/* Manage Outstanding Payments Start */
	$('#accounts_manage_outstanding_payments').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#accountsheader').html('<strong>Accounts: </strong> <font style="color:#A1C938;">Manage Outstanding Invoices</font>');
		$("#accountshome").hide("slide");
		$("#accountscontent").show("slide");
		$("#accountscontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		$('#accountscontent').load('../accounts/manage_outstanding_invoices.php');
	});
	/* Manage Outstanding Payments End */
});