$(document).ready(function() {
	$('#home').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.location.href='../home';
	});	
	
	$('#admin_dashboard_buy_credits').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		window.location.href='../admincredits';
	});
	
	/* Manage Products Start */
	$('#admin_dashboard_manage_products').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#adminheader').html('<strong>Products: </strong> <font style="color:#A1C938;"></font>');
		$("#adminhome").hide("slide");
		$("#admincontent").show("slide");
		$("#admincontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		
		var formData = 'client_id=';
		$('#admincontent').load('../admin/admin_view_products_clients.php?'+formData);
	});
	/* Manage Products End */
	
	/* Manage Users Start */
	$('#admin_dashboard_manage_users').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#adminheader').html('<strong>Users: </strong> <font style="color:#A1C938;"></font>');
		$("#adminhome").hide("slide");
		$("#admincontent").show("slide");
		$("#admincontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		
		var formData = 'client_id=';
		$('#admincontent').load('../admin/admin_users_view_all.php?'+formData);
	});
	/* Manage Users End */
	
	/* Manage Clients Start */
	$('#admin_dashboard_manage_clients').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#adminheader').html('<strong>Clients: </strong> <font style="color:#A1C938;"></font>');
		$("#adminhome").hide("slide");
		$("#admincontent").show("slide");
		$("#admincontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		
		var formData = 'client_id=';
		$('#admincontent').load('../admin/admin_clients_view_all.php?'+formData);
	});
	/* Manage Clients End */
	
	/* Manage Social Media Management Start */
	$('#admin_dashboard_manage_smm').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#adminheader').html('<strong>Other LG Management: </strong> <font style="color:#A1C938;"></font>');
		$("#adminhome").hide("slide");
		$("#admincontent").show("slide");
		$("#admincontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		
		var formData = 'client_id=';
		$('#admincontent').load('../admin/admin_do_social_media_management.php?'+formData);
	});
	/* Manage Social Media Management  End */
	
	/* Manage Clients NEW Start */
	$('#admin_dashboard_manage_clients_new').unbind('click').bind('click', function(e) {
		e.preventDefault();
		e.stopPropagation();
		$('#adminheader').html('<strong>Clients: </strong> <font style="color:#A1C938;"></font>');
		$("#adminhome").hide("slide");
		$("#users_filters").hide("slide");
		$("#admincontent").show("slide");
		$("#admincontent").html('<center><img id="preloader" src="../img/preloader.gif"></center><br />');	
		
		var formData = 'client_id=';
		$('#admincontent').load('../admin/admin.clients.view.all.php?'+formData);
	});
	/* Manage Clients NEW End */
});