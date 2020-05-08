$(document).ready(function() {
	<!-- Targeted Area Selection START -->
	$("#TargetedAreaSelectionNext").click(function(e){
		e.preventDefault();
		var ErrorCount = 0;
		
		if ($("input[name='TargetedAreaSelection']:checked").size()==0) {
		   	ErrorCount = 9;
		   	var AreaSelection = '0';
		}else{
		  	var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();
			var AreaSelectionAccess = $("input[name='TargetedAreaSelection']:checked").attr('have_access');
			if(AreaSelectionAccess==0){
				ErrorCount = 1;
			}
		}
		
		if(ErrorCount==9){
			sweetAlert({
					title: "Oops...",
					text: "Please select an valid option!",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				});
		}else if(ErrorCount==1){
			sweetAlert({
					title: "Oops...",
					text: "You do not have access to use this selection! Please contact us on 087 351 6492 or via support@bastionflowe.com for further information",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				});
		}else{
			$("#TargetedArea").hide("slide");
			if(AreaSelection==2){
				$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Province(s)</font><br><font class="mainsupportfont">Select the province(s) you would like to target</font>');
				$("#SelectedProvinceTargetedArea").show("slide");
				
			}else if(AreaSelection==3){
				$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Specific Location</font><br><font class="mainsupportfont">Drop the pin on the specific area you wish to target or type the physical address in the address bar</font>');
				$("#SelectedSpecificLocationTargetedArea").show("slide");
				setTimeout("initialize();",1000);
				//initialize();
			}else if(AreaSelection==4){
				$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Specific Branch</font><br><font class="mainsupportfont">Select the specific branch you would like to target</font>');
				$("#SelectedSpecificStoreTargetedArea").show("slide");
				
			}else{
				$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
				$("#SelectedProductCreative").show("slide");
				$("#product_selection_back").attr('redirect','1');
				$("#creativeselections").html('<center><img id="preloader" src="../img/preloader.gif"></center>');
				var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();	
				var GeoLink = $("#geolink").val();
				var GeoBranchId = $("#selectedbranchid").val();
				var formData = GeoLink+"&bi="+GeoBranchId+'&area_type='+AreaSelection;
				DisplayCreatives(formData);
			}
		}

	});
	<!-- Targeted Area Selection END -->
	
	<!-- Targeted Area Province START --> 
	$("#ProvinceSelectorBack").click(function(e){
		e.preventDefault();
		$("#SelectedProvinceTargetedArea").hide("slide");
		$("#product_selection_back").attr('redirect','2');
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection</font><br><font class="mainsupportfont">Select the area you would like to market to</font>');
		$("#TargetedArea").show("slide");
		
	});
	
	$("#ProvinceSelectorNext").click(function(e){
		e.preventDefault();
		var ErrorCount = 0;
		if ($("input[name='ProvinceSelector']:checked").size()==0) {
		   	ErrorCount = 1;
		   	var ProvinceSelection = '0';
		}else{
		  	//var ProvinceSelection = $("input[name='ProvinceSelector']:checked").val();
			var SelectedProvinces = "'"+$("input[name=ProvinceSelector]:checked").map(function(){ return this.value; }).get().join("','")+"'";
			//var ProvinceSelection = SelectedProvinces.replace(/"/g, "");
			var ProvinceSelection = encodeURI(SelectedProvinces);
		}
		<!--get selected provinces-->
//		alert($("input[name=ProvinceSelector]:checked").map(function(){
//			return this.value;
//		}).get().join(","));
		if(ErrorCount==1){
			sweetAlert({
					title: "Oops...",
					text: "Please select at least one province!",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				});
		}else{
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
			$("#SelectedProvinceTargetedArea").hide("slide");
			$("#SelectedProductCreative").show("slide");
			$("#product_selection_back").attr('redirect','2');
			$("#creativeselections").html('<center><img id="preloader" src="../img/preloader.gif"></center>');	
			var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();		
			var GeoLink = $("#geolink").val();
			var GeoBranchId = $("#selectedbranchid").val();
			var formData = GeoLink+"&bi="+GeoBranchId+'&area_type='+AreaSelection+'&province='+ProvinceSelection;
			DisplayCreatives(formData);	
		}
		
	});
	<!-- Targeted Area Province END --> 
	
	<!-- Targeted Area Location START --> 
	$("#LocationSelectorBack").click(function(e){
		e.preventDefault();
		$("#SelectedSpecificLocationTargetedArea").hide("slide");
		$("#product_selection_back").attr('redirect','3');
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection</font><br><font class="mainsupportfont">Select the area you would like to market to</font>');
		$("#TargetedArea").show("slide");
		
	});
	
	$("#LocationSelectorNext").click(function(e){
		e.preventDefault();
		var ErrorCount = 0;
//		var MapLat = $("#map_latitude").val();
//		var Maplng = $("#map_longitude").val();
//		var MapAddress = $("#pac-input").val();
		var MapLat = jQuery.trim($("#map_latitude").val()).length;
		var Maplng = jQuery.trim($("#map_longitude").val()).length;
		var MapAddress = jQuery.trim($("#pac-input").val()).length;
		
		if((MapLat==0) || (Maplng==0) || (MapAddress==0)){
			ErrorCount = 1;
		}
		
		if(ErrorCount==1){
			sweetAlert({
					title: "Oops...",
					text: "Please select a valid address point!",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				});
		}else{		
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
			$("#SelectedSpecificLocationTargetedArea").hide("slide");
			$("#SelectedProductCreative").show("slide");
			$("#product_selection_back").attr('redirect','3');
			$("#creativeselections").html('<center><img id="preloader" src="../img/preloader.gif"></center>');
			var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();			
			var GeoLink = $("#geolink").val();
			var GeoBranchId = $("#selectedbranchid").val();
			var formData = GeoLink+"&bi="+GeoBranchId+'&area_type='+AreaSelection;
			DisplayCreatives(formData);
		}
	});
	<!-- Targeted Area Location END --> 
	
	<!-- Targeted Area Store START --> 
	$("#StoreSelectorBack").click(function(e){
		e.preventDefault();
		$("#SelectedSpecificStoreTargetedArea").hide("slide");
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection</font><br><font class="mainsupportfont">Select the area you would like to market to</font>');
		$("#TargetedArea").show("slide");
		
	});
		
	$("#StoreSelectorNext").click(function(e){
		e.preventDefault();
		var BranchSelector = $("#Branch").val();
		var ErrorCount = 0;
		
		if(jQuery.trim(BranchSelector).length == 0){
			ErrorCount = 3;
		}

		if(ErrorCount==3){
			sweetAlert({
					title: "Oops...",
					text: "Please select a location!",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				},
					function(){
						setTimeout("document.getElementById('Branch').focus();",500);
				});
		}else{
			$("#SelectedSpecificStoreTargetedArea").hide("slide");
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
			$("#product_selection_back").attr('redirect','4');
			$("#SelectedProductCreative").show("slide");
			$("#creativeselections").html('<center><img id="preloader" src="../img/preloader.gif"></center>');
			var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();			
			var GeoLink = $("#geolink").val();
			var GeoBranchId = $("#selectedbranchid").val();
			var formData = GeoLink+"&bi="+GeoBranchId+'&area_type='+AreaSelection;
			DisplayCreatives(formData);
		}		
	});
	
	/* Branch Selector*/
	var BranchId = $('option:selected', "#Branch").val();
	$("#selectedbranchid").val(BranchId);
					
	$("#Branch").change(function () {
		var BranchId = $('option:selected', this).val();
		$("#selectedbranchid").val(BranchId);
	});
	<!-- Targeted Area Store END -->
	
	function DisplayCreatives(formData){
		$('#creativeselections').load('../functions/leadgen_creatives.php?'+formData,function(responseTxt,statusTxt,xhr){	
		if(statusTxt=="error")
			alert("Error: "+xhr.status+": "+xhr.statusText);
		});
	}
	
	<!-- Product Selection START -->
	$("#product_selection_back").click(function(e){
		var RedirectSelector = $(this).attr('redirect');
		if(RedirectSelector==4){
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Specific Branch</font><br><font class="mainsupportfont">Select the specific branch you would like to target</font>');
			$("#SelectedSpecificStoreTargetedArea").show("slide");
			
		}else if(RedirectSelector==3){
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Specific Location</font><br><font class="mainsupportfont">Drop the pin on the specific area you wish to target or type the physical address in the address bar</font>');
			$("#SelectedSpecificLocationTargetedArea").show("slide");
			
		}else if(RedirectSelector==2){
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection > Province(s)</font><br><font class="mainsupportfont">Select the province(s) you would like to target</font>');
			$("#SelectedProvinceTargetedArea").show("slide");
		}else{
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Targeted Area Selection</font><br><font class="mainsupportfont">Select the area you would like to market to</font>');
			$("#TargetedArea").show("slide");
		}
		$('#creativeselections').html();
		$("#SelectedProductCreative").hide("slide");
	});	
	
	$("#product_selection_next").click(function(e){
		e.preventDefault();
		var ProductSelector = $("#product").val();
		var ErrorCount = 0;
		
		if(jQuery.trim(ProductSelector).length == 0){
			ErrorCount = 1;
		}

		if(ErrorCount==1){
			sweetAlert({
					title: "Oops...",
					text: "Please select a creative!",
					type: "error",
					showCancelButton: false,
					//confirmButtonColor: "#DD6B55",
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				},
					function(){
						setTimeout("document.getElementById('product').focus();",500);
				});
		}else{
			$("#SelectedProductCreative").hide("slide");
			$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Set Campaign Budget</font><br><font class="mainsupportfont">Set the amount you would like to spend</font>');			
			$("#budget_selector").show("slide");
			$("#geobudgetcounter").html('<center><font class="mainsupportfont">Searching for data... This might take a few minutes...</font><br><img id="preloader" src="../img/preloader.gif"></center>');
			var Provinces = '';
			var AreaCriteria = '';
			var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();
			if(AreaSelection==2){
				var Provinces = encodeURIComponent('"'+$("input[name=ProvinceSelector]:checked").map(function(){return this.value;}).get().join('","')+'"');
				AreaCriteria = '&selected_provinces='+Provinces;
			}else if(AreaSelection==3){
				AreaCriteria = '&map_radius='+$("#map_rad").val()+'&map_lat='+$("#map_latitude").val()+'&map_lng='+$("#map_longitude").val();
			}else if(AreaSelection==4){
				AreaCriteria = '&map_radius='+$("#radius").val()+'&map_lat='+$("#latitude").val()+'&map_lng='+$("#longitude").val();
			}else{
				var AreaCriteria = '';
			}
			var GeoLink = $("#geolink").val();
			var SelectedProduct = $('option:selected', "#product").val();
			var GeoBranchId = $("#selectedbranchid").val();
			var formData = GeoLink+"&bi="+GeoBranchId+"&prodid="+SelectedProduct+'&areatype='+AreaSelection+AreaCriteria;

			CalculateBudgetCounts(formData);
		}		
	});
	<!-- Product Selection END -->
	
	function CalculateBudgetCounts(formData){
		$('#geobudgetcounter').load('../functions/leadgen_geo_counts.php?'+formData,function(responseTxt,statusTxt,xhr){		
		if(statusTxt=="error")
			//alert("Error: "+xhr.status+": "+xhr.statusText);
			sweetAlert({
					title: "Oops...",
					text: "We are currently experiencing a high volumes of requests! Please try again in a few minutes.",
					type: "error",
					showCancelButton: false,
					confirmButtonText: "Ok",
					closeOnConfirm: true 
				},
					function(){
						$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
						$("#SelectedProductCreative").show("slide");
						$('#geobudgetcounter').html();
						$("#budget_selector").hide("slide");
				});
		});
	}
	
	
	/* Budget Selector*/
	$("#budget_selector_back").click(function(e){
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Select Creative Message</font><br><font class="mainsupportfont">Select the creative message you would like to use</font>');
		$("#SelectedProductCreative").show("slide");
		$('#geobudgetcounter').html();
		$("#budget_selector").hide("slide");
	});
	
	/* Step 5 Start */
	$("#campaign_summary_back").click(function(e){
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Set Campaign Dates</font><br><font class="mainsupportfont">Select the dates your campaign should run. Your creatives will be delivered over the selected time period</font><br><font style="color:#A1C938;" class="mainsupportfont">(Please note: SMS and eMail campaigns will not execute over weekends)</font>');
		$("#campaign_summary").hide("slide");
		$("#date_selector").show("slide");
	});
	
	$("#campaign_summary_next").click(function(e){
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Confirmation</font>');
		$("#campaign_summary").hide("slide");
		$("#confirm_OTP").show("slide");
		var formData = $('#geolink').val();
		$.ajax({
				type: "POST",
				url: "../functions/post_smsportal.php",
				data : formData,
				//contentType: "application/json; charset=utf-8",
//        			dataType: "json",
				success: function(data, textStatus, jqXHR){
					$('#otp_session').val(data);
				},
				error: function (jqXHR, textStatus, errorThrown){
					$('#otp_session').val(data);
				}
			});
		$('html, body').animate({
			scrollTop: $("#new").offset().top
		}, 2000);
	});
	/* Step 5 End */
	
	/* OTP  */
	$("#confirm_OTP_back").click(function(e){
//		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Campaign Summary</font><br><font class="mainsupportfont">Confirm your selection</font>');
//		$("#confirm_OTP").hide("slide");
//		$("#campaign_summary").show("slide");
//		$('#otp_session').val('');
//		$('#OneTimePin').val('');
		swal({
				title: "Are you sure?",   
				text: "You are about to go back, this will reset your OTP!",   
				type: "warning",   
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Yes, reset OTP!",   
				cancelButtonText: "No, stay here!",   
				closeOnConfirm: true,   
				closeOnCancel: true 
			}, 
			function(isConfirm){
				if (isConfirm) {
					$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Campaign Summary</font><br><font class="mainsupportfont">Confirm your selection</font>');
					$("#confirm_OTP").hide("slide");
					$("#campaign_summary").show("slide");
					$('#otp_session').val('');
					$('#OneTimePin').val('');
				} 
			});
	});
	
	$("#confirm_OTP_next").click(function(e){
		function DisplayBuyCredits(creditsformData){
			$('#buy_credits_selector').load('../functions/leadgen_buy_credits.php?'+creditsformData,function(responseTxt,statusTxt,xhr){	
			$('#buy_credits_selector').slideDown("slow");
			if(statusTxt=="error")
				alert("Error: "+xhr.status+": "+xhr.statusText);
			});
		}
	
		var ThisSession = $('#otp_session').val();
		var ThisOTP = $('#OneTimePin').val();
		var ThisLink = $('#geolink').val();
		var formData = ThisLink+'&ses='+ThisSession+'&otp='+ThisOTP;
		function GetBranchCredits(postData){
			$.ajax({
					type: "POST",
					url: "../functions/user_credit_balance.php",
					data : postData,
					//contentType: "application/json; charset=utf-8",
	//        			dataType: "json",
					success: function(data, textStatus, jqXHR){
						var BI = $("#Branch option:selected").val();
						var ThisLink = $('#geolink').val();
						$('#branch_available_credits').val(data);
						$('#payment_campaign_budget').val($('#campaign_budget').val());
						var getTotal1 = $('#branch_available_credits').val();
						var getTotal = getTotal1.replace("R ", "");
						var Total = getTotal.replace(/,/g, "");
						var getCampBudget1 = $('#campaign_budget').val();
						var getCampBudget = getCampBudget1.replace("R ", "");
						var CampBudget = getCampBudget.replace(/,/g, "");
						var ReminingCredits = parseFloat(Total) - parseFloat(CampBudget);
						$('#payment_remaining_credits').val(accounting.formatMoney(ReminingCredits, "R ", 2, ",","."));
						//var postData = ThisLink+'&bi='+BI+'&min='+ReminingCredits;
						var PurchaseCredits = ReminingCredits;
						$('#payment_selector_next').text('Next');
						if(parseFloat(ReminingCredits)<0){
							//DisplayBuyCredits(postData);
							$('#payment_selector_next').text('Purchase Credits');
						}
					},
					error: function (jqXHR, textStatus, errorThrown){
						$('#branch_available_credits').val('ERROR');
					}
				});			
		}
		
		$.ajax({
				type: "POST",
				url: "../functions/leadgen_confirmOTP.php",
				data : formData,
				success: function(data, textStatus, jqXHR){
					if(data==1){
						$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Payment</font>');
						$("#confirm_OTP").hide("slide");
						$("#payment_selector").show("slide");
						var BI = $("#Branch option:selected").val();
						var ThisLink = $('#geolink').val();
						var postData = ThisLink+'&bi='+BI;
						GetBranchCredits(postData);
					}else{
						sweetAlert({
							title: "Oops...",
							text: "Wrong OTP entered, please try again",
							type: "error",
							showCancelButton: false,
							//confirmButtonColor: "#DD6B55",
							confirmButtonText: "Ok",
							closeOnConfirm: true 
						},
							function(){
								setTimeout("document.getElementById('OneTimePin').focus();",500);
								 //$("#OneTimePin").focus();
						});
						//$("#OneTimePin").focus();	
					}
				},
				error: function (jqXHR, textStatus, errorThrown){
						sweetAlert({
						title: "Oops...",
						text: "Something went wrong with your connection, please try again",
						type: "error",
						showCancelButton: false,
						//confirmButtonColor: "#DD6B55",
						confirmButtonText: "Ok",
						closeOnConfirm: true 
					},
						function(){
							setTimeout("document.getElementById('OneTimePin').focus();",500);
							 //$("#OneTimePin").focus();
					});
				}
			});
	});
	/* OTP  */
	
	/* Payment start */
	$("#payment_selector_back").click(function(e){
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Confirmation</font>');
		$("#payment_selector").hide("slide");
		$("#campaign_summary").show("slide");
		$('#otp_session').val('');
		$('#OneTimePin').val('');
	});
	
	$("#payment_selector_next").click(function(e){
		function UpdateCampaignPayment(postData){
			$.ajax({
				type: "POST",
				url: "../functions/leadgen_campaign_payent.php?",
				data : postData,
				//data: { },
				success: function(data, textStatus, jqXHR){
					//alert(data);
					//$('#geobudgetcounter').html(data);
				},
				error: function (jqXHR, textStatus, errorThrown){
					//$('#geobudgetcounter').html(textStatus);
				}
			});
		}
		var RefNo = $('#otp_session').val();
		var BI = $("#Branch option:selected").val();
		var ThisLink = $('#geolink').val();
		var getTotal1 = $('#branch_available_credits').val();
		var getTotal = getTotal1.replace("R ", "");
		var Total = getTotal.replace(/,/g, "");
		var getCampBudget1 = $('#campaign_budget').val();
		var getCampBudget = getCampBudget1.replace("R ", "");
		var CampBudget = getCampBudget.replace(/,/g, "");
		var ReminingCredits = parseFloat(Total) - parseFloat(CampBudget);

		/*create campaign*/
		var Provinces = '';
		var AreaCriteria = '';
		var AreaSelection = $("input[name='TargetedAreaSelection']:checked").val();
		if(AreaSelection==2){
			var Provinces = encodeURIComponent('"'+$("input[name=ProvinceSelector]:checked").map(function(){return this.value;}).get().join('","')+'"');
			AreaCriteria = '&selected_provinces='+Provinces;
		}else if(AreaSelection==3){
			AreaCriteria = '&map_radius='+$("#map_rad").val()+'&map_lat='+$("#map_latitude").val()+'&map_lng='+$("#map_longitude").val();
		}else if(AreaSelection==4){
			AreaCriteria = '&map_radius='+$("#radius").val()+'&map_lat='+$("#latitude").val()+'&map_lng='+$("#longitude").val();
		}else{
			var AreaCriteria = '';
		}
		var ExtraData = '&areatype='+AreaSelection+AreaCriteria+'&address='+encodeURIComponent($("#pac-input").val());
		var BranchID = '&branch_id='+BI;
		var CampaignRef = '&campaign_ref='+RefNo;
		var CampaignName = '&campaign_name='+$("#campaign_name").val();
		var CreativeID = '&creative_id='+$("#product").val();
		var StartDate = '&start_date='+$("#campaign_startdate").val();
		var EndDate = '&end_date='+$("#campaign_enddate").val();
		var SMSTotal = '&sms_total=';
		var SMSBudget = '&sms_budget='+$("#campaign_sms").val();
		var EmailTotal = '&email_total=';
		var EmailBudget = '&email_budget='+$("#campaign_email").val();
		var FBTotal = '&fb_total=';
		var FBBudget = '&fb_budget='+$("#campaign_fb").val();
		var TotalBudget = '&total_budget='+CampBudget;
		var CreateCampaign = ThisLink+BranchID+CampaignRef+CampaignName+CreativeID+StartDate+EndDate+SMSTotal+SMSBudget+EmailTotal+EmailBudget+FBTotal+FBBudget+TotalBudget+ExtraData;
		
		$.ajax({
			type: "POST",
			url: "../functions/leadgen_campaign_create.php?",
			data : CreateCampaign,
			success: function(data, textStatus, jqXHR){
				if(data>0){
					var getTotal1 = $('#branch_available_credits').val();
					var getTotal = getTotal1.replace("R ", "");
					var Total = getTotal.replace(/,/g, "");
					var getCampBudget1 = $('#campaign_budget').val();
					var getCampBudget = getCampBudget1.replace("R ", "");
					var CampBudget = getCampBudget.replace(/,/g, "");
					var ReminingCredits = parseFloat(Total) - parseFloat(CampBudget);
					if(parseFloat(ReminingCredits)>=0){
						$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Complete</font>');
						$("#payment_selector").hide("slide");
						$("#thankyou_selector").show("slide");
						$('#OneTimePin').val('');
						var ThisLink = $('#geolink').val();
						var RefNo = $('#otp_session').val();
						var PostData = ThisLink+'&campaign='+data+'&refno='+RefNo;
						UpdateCampaignPayment(PostData);
						setTimeout("parent.location.href='../home';",30000);
					}else{
						$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Purchase Credits</font>');
						$("#payment_selector").hide("slide");
						$("#purchase_selector").show("slide");
						$('#OneTimePin').val('');
						var ThisLink = $('#geolink').val();
						var RefNo = $('#otp_session').val();
						var BI = $("#Branch option:selected").val();
						var getTotal1 = $('#branch_available_credits').val();
						var getTotal = getTotal1.replace("R ", "");
						var Total = getTotal.replace(/,/g, "");
						var getCampBudget1 = $('#campaign_budget').val();
						var getCampBudget = getCampBudget1.replace("R ", "");
						var CampBudget = getCampBudget.replace(/,/g, "");
						var ReminingCredits = parseFloat(Total) - parseFloat(CampBudget);
						$('#payfast').html('<iframe id="pf_iframe" src="../functions/payfast_iframe.php?'+ThisLink+'&bi='+BI+'&money='+ReminingCredits+'&refno='+RefNo+'" frameBorder="0" width="100%" height="800"></iframe>');
						$('html, body').animate({
							scrollTop: $("#new").offset().top
						}, 2000);
					}
				}
			},
			error: function (jqXHR, textStatus, errorThrown){
				//$('#geobudgetcounter').html(textStatus);
			}
		});
	});
	/* Payment stendart */
	
	/* Payfast Start */
	$("#purchase_selector_back").click(function(e){
		$('#new_header').html('<strong>New:</strong> <font style="color:#A1C938;">Payment</font>');
		$("#purchase_selector").hide("slide");
		$("#payment_selector").show("slide");
	});
	/* Payfast End */
	
	/* Complete Start */
	$("#payfast_complete_next").click(function(e){
		e.preventDefault();
		window.location.href='../home';
	});
	
	$("#thankyou_selector_next").click(function(e){
		e.preventDefault();
		window.location.href='../home';
	});
	/* Complete End */
});