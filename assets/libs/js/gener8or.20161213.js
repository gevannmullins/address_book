$(document).ready(function() {
	$('#home').unbind('click').bind('click', function(e) {
		e.preventDefault();
		window.location.href='../home';
	});
});

function CheckCampaignStartDate(){
	DateErrorCount = 0;
	var SelectedStartDate = $("#date_start").val();
	if(MinDiffDays==1){
		SuggestedEndDate = SelectedStartDate;
	}else{
		var SuggestedEndDate = addDays(SelectedStartDate, MinDiffDays - 1);
	}

	var get_sms_est1 = $("#est_sms").html();
	var get_sms_est = parseFloat(get_sms_est1);
	var sms_est = Math.round(get_sms_est);
	
	var get_email_est1 = $("#est_email").html();
	var get_email_est = parseFloat(get_email_est1);
	var email_est = Math.round(get_email_est);
	
	var get_fb_est1 = $("#est_social").html();
	var get_fb_est = parseFloat(get_fb_est1);
	var fb_est = Math.round(get_fb_est);
		
	if((sms_est>0) && (email_est==0) && (fb_est==0)){
		var EndDate1 = new Date(SuggestedEndDate);
		var EndDateStartDay = EndDate1.getDay();
		var StartDate1 = new Date(SelectedStartDate);
		var StartDateStartDay = StartDate1.getDay();
		if (EndDateStartDay == 0){
			var EndDate1 = addDays(EndDate1, 1);
		}
		if (EndDateStartDay == 6){
			var EndDate1 = addDays(EndDate1, 2);
		}
		if (StartDateStartDay == 0){
			var StartDate1 = addDays(StartDate1, 1);
		}
		if (StartDateStartDay == 6){
			var StartDate1 = addDays(StartDate1, 2);
		}
		var SelectedStartDate = StartDate1;
		var SuggestedEndDate = EndDate1;

		$("#date_start").val(getFormattedDate(new Date(SelectedStartDate)));
		$("#date_start").datepicker({startDate:new Date()}).datepicker('update', new Date());
	}

	var diff1 = workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate));
	if(diff1==0){diff1 = 1;}

	var diff = diffDays(Date.parse(SelectedStartDate),Date.parse(SuggestedEndDate));
	if(diff==0){diff = 1;}
	
	if(sms_est>0){
		$("#daily_est_sms").html(Math.floor(sms_est/diff1)+' estimated sms daily reach');
	}else{
		$("#daily_est_sms").html('0 estimated sms daily reach');
	}
	if(email_est>0){
		$("#daily_est_email").html(Math.floor(email_est/diff)+' estimated email daily reach');
	}else{
		$("#daily_est_email").html('0 estimated email daily reach');
	}
	if(fb_est>0){
		$("#daily_est_social").html(Math.floor(fb_est/diff)+' estimated social daily reach');
	}else{
		$("#daily_est_social").html('0 estimated social daily reach');
	}
	
	if(Date.parse(SelectedStartDate) < Date.parse(MinStartDate)){DateErrorCount = 4;}
	if(Date.parse(SelectedStartDate) > Date.parse(MaxStartDate)){DateErrorCount = 3;}
	
	if(DateErrorCount==4){
		sweetAlert({
				title: "Oops...",
				text: "The start date cannot be prior to "+MinStartDate,
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
					$("#date_start").val(MinStartDate);
					$("#date_start").datepicker({startDate:new Date()}).datepicker('update', new Date());
					if(MinDiffDays==1){
						$("#date_end").val(MinStartDate);
					}else{
						$("#date_end").val(getFormattedDate(addDays(MinStartDate, MinDiffDays - 1)));
					}
					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==3){
		sweetAlert({
				title: "Oops...",
				text: "The start date cannot exceed "+getFormattedDate(MaxStartDate),
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
					$("#date_start").val(MinStartDate);
					$("#date_start").datepicker({startDate:new Date()}).datepicker('update', new Date());
					if(MinDiffDays==1){
						$("#date_end").val(MinStartDate);
					}else{
						$("#date_end").val(getFormattedDate(addDays(MinStartDate, MinDiffDays - 1)));
					}
					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==0){
		//alert(SuggestedEndDate);
		//alert(getFormattedDate(SuggestedEndDate));
		$("#date_end").val(getFormattedDate(new Date(SuggestedEndDate)));
		$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
		
		$("#date_selector_next").removeAttr('disabled');
	}else{
		$("#date_selector_next").attr("disabled", true);
	}	
}

function CheckCampaignEndDate(){
	DateErrorCount = 0;
	var SelectedStartDate = $("#date_start").val();	
	var SuggestedEndDate = $("#date_end").val();

	var get_sms_est1 = $("#est_sms").html();
	var get_sms_est = parseFloat(get_sms_est1);
	var sms_est = Math.round(get_sms_est);
	
	var get_email_est1 = $("#est_email").html();
	var get_email_est = parseFloat(get_email_est1);
	var email_est = Math.round(get_email_est);
	
	var get_fb_est1 = $("#est_social").html();
	var get_fb_est = parseFloat(get_fb_est1);
	var fb_est = Math.round(get_fb_est);
		
	if((sms_est>0) && (email_est==0) && (fb_est==0)){
		var EndDate1 = new Date(SuggestedEndDate);
		var EndDateStartDay = EndDate1.getDay();
		var StartDate1 = new Date(SelectedStartDate);
		var StartDateStartDay = StartDate1.getDay();
		if (EndDateStartDay == 0){
			var EndDate1 = addDays(EndDate1, 1);
		}
		if (EndDateStartDay == 6){
			var EndDate1 = addDays(EndDate1, 2);
		}
		if (StartDateStartDay == 0){
			var StartDate1 = addDays(StartDate1, 1);
		}
		if (StartDateStartDay == 6){
			var StartDate1 = addDays(StartDate1, 2);
		}
		var SelectedStartDate = StartDate1;
		var SuggestedEndDate = EndDate1;

		$("#date_end").val(getFormattedDate(new Date(SuggestedEndDate)));
		$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
	}

	var diff1 = workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate));
	if(diff1==0){diff1 = 1;}

	var diff = diffDays(Date.parse(SelectedStartDate),Date.parse(SuggestedEndDate));
	if(diff==0){diff = 1;}
	
	if(Date.parse(SuggestedEndDate) < Date.parse(SelectedStartDate)){DateErrorCount = 2;}
	if(Date.parse(SuggestedEndDate) > Date.parse(MaxStartDate)){DateErrorCount = 1;}
	if(diff>MinDiffDays || diff1>MinDiffDays){DateErrorCount = 5;}
	
	if(DateErrorCount==5){
		sweetAlert({
				title: "Oops...",
				text: "The campaign cannot exceed "+MinDiffDays+" days",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
					if(MinDiffDays==1){
						$("#date_end").val(getFormattedDate(SelectedStartDate));
					}else{
						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
					}
					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
			});
		DateErrorCount = 0;
		
		var diff1 = workingDaysBetweenDates(new Date($("#date_start").val()), new Date($("#date_end").val()));
		if(diff1==0){diff1 = 1;}
	
		var diff = diffDays(Date.parse($("#date_start").val()),Date.parse($("#date_end").val()));
		if(diff==0){diff = 1;}
	}
	
	if(DateErrorCount==2){
		sweetAlert({
				title: "Oops...",
				text: "The end date cannot be prior to "+getFormattedDate(SelectedStartDate),
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
					if(MinDiffDays==1){
						$("#date_end").val(getFormattedDate(SelectedStartDate));
					}else{
						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
					}
					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==1){
		sweetAlert({
				title: "Oops...",
				text: "The start date cannot exceed "+getFormattedDate(MaxStartDate),
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
					if(MinDiffDays==1){
						$("#date_end").val(getFormattedDate(SelectedStartDate));
					}else{
						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
					}
					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==0){		
		if(sms_est>0){
			$("#daily_est_sms").html(Math.floor(sms_est/diff1)+' estimated sms daily reach');
		}else{
			$("#daily_est_sms").html('0 estimated sms daily reach');
		}
		if(email_est>0){
			$("#daily_est_email").html(Math.floor(email_est/diff)+' estimated email daily reach');
		}else{
			$("#daily_est_email").html('0 estimated email daily reach');
		}
		if(fb_est>0){
			$("#daily_est_social").html(Math.floor(fb_est/diff)+' estimated social daily reach');
		}else{
			$("#daily_est_social").html('0 estimated social daily reach');
		}
		$("#date_end").val(getFormattedDate(new Date(SuggestedEndDate)));
		$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
		
		$("#date_selector_next").removeAttr('disabled');
	}else{
		$("#date_selector_next").attr("disabled", true);
	}
}