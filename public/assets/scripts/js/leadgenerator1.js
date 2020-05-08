$(document).ready(function() {
	function CalculateBudgetCounts(formData){
		$('#geobudgetcounter').load('../functions/leadgen_geo_counts.php?'+formData,function(responseTxt,statusTxt,xhr){
		//if(statusTxt=="success")
//			document.getElementById('geobudgetcounter').scrollIntoView();		
		if(statusTxt=="error")
			alert("Error: "+xhr.status+": "+xhr.statusText);
		});
//		$.ajax({
//				type: "POST",
//				url: "../functions/leadgen_geo_counts.php?",
//				data : formData,
//				//data: { },
//				success: function(data, textStatus, jqXHR){
//					$('#geobudgetcounter').html(data);
//				},
//				error: function (jqXHR, textStatus, errorThrown){
//					$('#geobudgetcounter').html(textStatus);
//				}
//			});
	}
		
	$("#campaign_naming_next").click(function(e){
		e.preventDefault();
		//var CampaignNameField = $("#campaign_name").val();
		var BranchSelector = $("#Branch").val();
		var ErrorCount = 0;
		
		//if(jQuery.trim(CampaignNameField).length == 0){
		//	ErrorCount = 1;
		//}
		
		//if(jQuery.trim(CampaignNameField).length < 5 && jQuery.trim(CampaignNameField).length > 0){
		//	ErrorCount = 2;
		//}
		
		if(jQuery.trim(BranchSelector).length == 0){
			ErrorCount = 3;
		}
		
//		if(ErrorCount==1){
//			sweetAlert({
//					title: "Oops...",
//					text: "Please complete the Campaign Name!",
//					type: "error",
//					showCancelButton: false,
//					//confirmButtonColor: "#DD6B55",
//					confirmButtonText: "Ok",
//					closeOnConfirm: true 
//				},
//					function(){
//						 $("#campaign_name").focus();
//				});
//			$("#campaign_name").focus();
//		}else if(ErrorCount==2){
//			sweetAlert({
//					title: "Oops...",
//					text: "Campaign Name too short!",
//					type: "error",
//					showCancelButton: false,
//					//confirmButtonColor: "#DD6B55",
//					confirmButtonText: "Ok",
//					closeOnConfirm: true 
//				},
//					function(){
//						 $("#campaign_name").focus();
//				});
//			$("#campaign_name").focus();
//		}else 
		if(ErrorCount==3){
			sweetAlert({
					title: "Oops...",
					text: "Please select a location!",
					type: "error",
					showCancelButton: false,
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				},
					function(){
						 $("#Branch").focus();
				});
			$("#Branch").focus();
		}else{
			$("#campaign_naming").hide("slide");
			$('#new_header').html('<strong>Step 2:</strong> <font style="color:#A1C938;">Set Campaign Budget</font>');			
			$("#budget_selector").show("slide");
			$("#geobudgetcounter").html('<center><img id="preloader" src="../img/preloader.gif"></center>');
			var GeoLink = $("#geolink").val();
			var GeoRad = $("#rad").val();
			//var GeoBranchId = $("#selectedbranchid").val();
			
			var formData = GeoLink+"&rad="+GeoRad+"&lat="+$("#latitude").val()+"&lng="+$("#longitude").val()+"&bi="+$("#selectedbranchid").val();
			CalculateBudgetCounts(formData);
		}		
	});
	
	
	/* Branch Selector*/
	var GetLat = $('option:selected', this).attr('lat');
	var GetLng = $('option:selected', this).attr('lng');
	var BranchId = $('option:selected', this).val();

	$("#latitude").val(GetLat);
	$("#longitude").val(GetLng);
	$("#selectedbranchid").val(BranchId);
		
	$("#Branch").change(function () {
		var GetLat = $('option:selected', this).attr('lat');
		var GetLng = $('option:selected', this).attr('lng');
		var BranchId = $('option:selected', this).val();

		$("#latitude").val(GetLat);
		$("#longitude").val(GetLng);
		$("#selectedbranchid").val(BranchId);
	});
	/* Budget Selector*/
	$("#budget_selector_back").click(function(e){
		$('#new_header').html('<strong>Step 1:</strong> <font style="color:#A1C938;">Select Location</font>');
		$("#campaign_naming").show("slide");
		$('#geobudgetcounter').html();
		$("#budget_selector").hide("slide");
	});
});