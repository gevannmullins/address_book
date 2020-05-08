$(document).ready(function() {
	$('#home').unbind('click').bind('click', function(e) {
		e.preventDefault();
		window.location.href='../home';
	});
});

function CheckCampaignStartDate(){
	function nonZeroMin() { // input can be as many parameters as you want
		var args = Array.prototype.slice.call(arguments);
		for(var i = args.length-1; i>=0; i--) {
			if(args[i] == 0) args.splice(i, 1);
		}

		return Math.min.apply(null,args);
	}
	
	DateErrorCount = 0;
	var SelectedStartDate1 = $("#date_start").val();
	//console.log(SelectedStartDate1);
	//console.log('CheckDateValidWorkingDay: '+CheckDateValidWorkingDay(SelectedStartDate1));
	//var SuggestedEndDate = $("#date_end").val();
	if(CheckDateValidWorkingDay(SelectedStartDate1)>0){
		SelectedStartDate1 = new Date(SelectedStartDate1);
		SelectedStartDate1.setDate(SelectedStartDate1.getDate() + CheckDateValidWorkingDay(SelectedStartDate1));
		var SelectedStartDate1 = new Date(SelectedStartDate1.getFullYear(), SelectedStartDate1.getMonth(), SelectedStartDate1.getDate(), 0, 0, 0, 0);
		//console.log('added days: '+SelectedStartDate1);
		SelectedStartDate = new Date(SelectedStartDate1);
	}else{
		var SelectedStartDate = $("#date_start").val();
	}
	//console.log('new date: '+SelectedStartDate);
	
	$("#date_start").val(getFormattedDate(new Date(SelectedStartDate)));
	$("#date_start").datepicker({startDate:new Date()}).datepicker('update', new Date());
	//console.log('new formated date: '+$("#date_start").val());
	
	var get_sms_est1 = $("#est_sms").html();
	var get_sms_est2 = get_sms_est1.replace(/,/g, "");
	var get_sms_est = parseFloat(get_sms_est2);
	var sms_est = Math.round(get_sms_est);
	
	var get_email_est1 = $("#est_email").html();
	var get_email_est2 = get_email_est1.replace(/,/g, "");
	var get_email_est = parseFloat(get_email_est2);
	var email_est = Math.round(get_email_est);
	
	var get_fb_est1 = $("#est_social").html();
	var get_fb_est2 = get_fb_est1.replace(/,/g, "");
	var get_fb_est = parseFloat(get_fb_est2);
	var fb_est = Math.round(get_fb_est);
	
	var get_gls_est1 = $("#est_googlesearch").html();
	var get_gls_est2 = get_gls_est1.replace(/,/g, "");
	var get_gls_est = parseFloat(get_gls_est2);
	var gls_est = Math.round(get_gls_est);
	
	if(sms_est>0){
		var smsMaxDays = Math.floor(sms_est/1000);
	}else{
		var smsMaxDays = 0;
	}
	if(email_est>0){
		var emailMaxDays = Math.floor(email_est/1000);
	}else{
		var emailMaxDays = 0;
	}
	if(fb_est>0){
		var fbMaxDays = Math.floor(fb_est/1000);
	}else{
		var fbMaxDays = 0;
	}
	if(gls_est>0){
		var glsMaxDays = Math.floor(gls_est/1000);
	}else{
		var glsMaxDays = 0;
	}
	
	var MinDiffDays = nonZeroMin(smsMaxDays, emailMaxDays, fbMaxDays, glsMaxDays);
	
	if(MinDiffDays==1){
		var SuggestedEndDate = SelectedStartDate;
	}else{
		var SuggestedEndDate = addDays(SelectedStartDate, MinDiffDays - 1);
	}
	
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
	
	//var SuggestedEndDate = addDays($("#date_end").val(), InclDayDif);
	
	if(CheckDateValidWorkingDay(SuggestedEndDate)>0){
		SuggestedEndDate = new Date(SuggestedEndDate);
		SuggestedEndDate.setDate(SuggestedEndDate.getDate() + CheckDateValidWorkingDay(SuggestedEndDate));
		var SuggestedEndDate = new Date(SuggestedEndDate.getFullYear(), SuggestedEndDate.getMonth(), SuggestedEndDate.getDate(), 0, 0, 0, 0);
		//console.log('added days: '+SelectedStartDate1);
		SuggestedEndDate = new Date(SuggestedEndDate);
	}

	var diff1 = workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate));
	console.log('working days: '+workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate)));
	if(MinDiffDays>diff1){
		SuggestedEndDate.setDate(SuggestedEndDate.getDate() + (MinDiffDays-diff1));
		if(CheckDateValidWorkingDay(SuggestedEndDate)>0){
			SuggestedEndDate = new Date(SuggestedEndDate);
			SuggestedEndDate.setDate(SuggestedEndDate.getDate() + CheckDateValidWorkingDay(SuggestedEndDate));
			var SuggestedEndDate = new Date(SuggestedEndDate.getFullYear(), SuggestedEndDate.getMonth(), SuggestedEndDate.getDate(), 0, 0, 0, 0);
			//console.log('added days: '+SelectedStartDate1);
			SuggestedEndDate = new Date(SuggestedEndDate);
		}
		var diff1 = workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate));
	}
	if(diff1==0){diff1 = 1;}
	console.log('campaign days: '+diff1);

	var diff = diffDays(Date.parse(SelectedStartDate),Date.parse(SuggestedEndDate));
	if(diff==0){diff = 1;}
	
	if(sms_est>0){
		$("#daily_est_sms").html(Math.floor(sms_est/diff1)+' est sms daily reach');
	}else{
		$("#daily_est_sms").html('');
	}
	if(email_est>0){
		$("#daily_est_email").html(Math.floor(email_est/diff1)+' est email daily reach');
	}else{
		$("#daily_est_email").html('');
	}
	if(fb_est>0){
		$("#daily_est_social").html(Math.floor(fb_est/diff1)+' est social daily reach');
	}else{
		$("#daily_est_social").html('');
	}
	
	if(DateErrorCount==0){
		//alert(SuggestedEndDate);
		//alert(getFormattedDate(SuggestedEndDate));
		$("#date_end").val(getFormattedDate(new Date(SuggestedEndDate)));
		$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
		
		$("#date_selector_next").removeAttr('disabled');
		
		$("#daily_est_days").html('Over '+diff1+' day/s');
	}else{
		$("#date_selector_next").attr("disabled", true);
	}	
}

function CheckCampaignEndDate(){
//console.log($("#date_start").val());
//console.log(CheckDateValidWorkingDay($("#date_start").val()));
//console.log($("#date_end").val());
	
function nonZeroMin() { // input can be as many parameters as you want
    var args = Array.prototype.slice.call(arguments);
    for(var i = args.length-1; i>=0; i--) {
        if(args[i] == 0) args.splice(i, 1);
    }

    return Math.min.apply(null,args);
}

	DateErrorCount = 0;
	var SelectedStartDate = $("#date_start").val();	
	var SuggestedEndDate = $("#date_end").val();

	//console.log('working days: '+workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate)));

	var get_sms_est1 = $("#est_sms").html();
	var get_sms_est2 = get_sms_est1.replace(/,/g, "");
	var get_sms_est = parseFloat(get_sms_est2);
	var sms_est = Math.round(get_sms_est);
	
	var get_email_est1 = $("#est_email").html();
	var get_email_est2 = get_email_est1.replace(/,/g, "");
	var get_email_est = parseFloat(get_email_est2);
	var email_est = Math.round(get_email_est);
	
	var get_fb_est1 = $("#est_social").html();
	var get_fb_est2 = get_fb_est1.replace(/,/g, "");
	var get_fb_est = parseFloat(get_fb_est2);
	var fb_est = Math.round(get_fb_est);
	
	var get_gls_est1 = $("#est_googlesearch").html();
	var get_gls_est2 = get_gls_est1.replace(/,/g, "");
	var get_gls_est = parseFloat(get_gls_est2);
	var gls_est = Math.round(get_gls_est);
		
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
	
	if(CheckDateValidWorkingDay($("#date_end").val())>0){
		SuggestedEndDate = new Date(SuggestedEndDate);
		SuggestedEndDate.setDate(SuggestedEndDate.getDate() + CheckDateValidWorkingDay(SuggestedEndDate));
		var SuggestedEndDate = new Date(SuggestedEndDate.getFullYear(), SuggestedEndDate.getMonth(), SuggestedEndDate.getDate(), 0, 0, 0, 0);
		//console.log('added days 1: '+SuggestedEndDate);
		SuggestedEndDate = getFormattedDate(SuggestedEndDate);
		//console.log('added days 2: '+SuggestedEndDate);
		$("#date_end").val(SuggestedEndDate);
		$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
	}
	
	if(sms_est>0){
		var smsMaxDays = Math.floor(sms_est/1000);
	}else{
		var smsMaxDays = 0;
	}
	if(email_est>0){
		var emailMaxDays = Math.floor(email_est/1000);
	}else{
		var emailMaxDays = 0;
	}
	if(fb_est>0){
		var fbMaxDays = Math.floor(fb_est/1000);
	}else{
		var fbMaxDays = 0;
	}
	if(gls_est>0){
		var glsMaxDays = Math.floor(gls_est/1000);
	}else{
		var glsMaxDays = 0;
	}
	
	

	var diff1 = workingDaysBetweenDates(new Date(SelectedStartDate), new Date(SuggestedEndDate));
	if(diff1==0){diff1 = 1;}

	var diff = diffDays(Date.parse(SelectedStartDate),Date.parse(SuggestedEndDate));
	if(diff==0){diff = 1;}
	//console.log('nonZeroMin:'+nonZeroMin(smsMaxDays, emailMaxDays, fbMaxDays));
	var MinDiffDays = nonZeroMin(smsMaxDays, emailMaxDays, fbMaxDays, glsMaxDays);
	var MaxDiffDays = Math.max(smsMaxDays, emailMaxDays, fbMaxDays, glsMaxDays);
//	console.log('channels:'+smsMaxDays+', '+emailMaxDays+', '+fbMaxDays);
//	console.log('MinDiffDays:'+MinDiffDays);
//	console.log('MaxDiffDays:'+MaxDiffDays);
//	console.log('diff1:'+diff1);
//	console.log('diff:'+diff);
	
	if(Date.parse(SuggestedEndDate) < Date.parse(SelectedStartDate)){DateErrorCount = 2;}
	if(Date.parse(SuggestedEndDate) > Date.parse(maxDate)){DateErrorCount = 1;}
	//if(diff>MinDiffDays || diff1>MinDiffDays){DateErrorCount = 5;}
	if(diff1>MinDiffDays){DateErrorCount = 5;}
	
	if(DateErrorCount==5){
		sweetAlert({
				title: "Oops...",
				text: "The campaign cannot exceed "+MinDiffDays+" working days",
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
//					if(MinDiffDays==1){
//						$("#date_end").val(getFormattedDate(new Date(SelectedStartDate)));
//					}else{
//						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
//					}
//					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
				CheckCampaignStartDate();
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==2){
		sweetAlert({
				title: "Oops...",
				text: "The end date cannot be prior to "+getFormattedDate(new Date(SelectedStartDate)),
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
//					if(MinDiffDays==1){
//						$("#date_end").val(getFormattedDate(new Date(SelectedStartDate)));
//					}else{
//						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
//					}
//					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
				CheckCampaignStartDate();
			});
		DateErrorCount = 0;
	}
	
	if(DateErrorCount==1){
		sweetAlert({
				title: "Oops...",
				text: "The start date cannot exceed "+getFormattedDate(new Date(maxDate)),
				type: "error",
				showCancelButton: false,
				confirmButtonText: "Ok",
				closeOnConfirm: true 
			},
				function(e){
//					if(MinDiffDays==1){
//						$("#date_end").val(getFormattedDate(SelectedStartDate));
//					}else{
//						$("#date_end").val(getFormattedDate(addDays(SelectedStartDate, MinDiffDays - 1)));
//					}
//					$("#date_end").datepicker({startDate:new Date()}).datepicker('update', new Date());
				CheckCampaignStartDate();
			});
		DateErrorCount = 0;
	}
	
	
	
	if(DateErrorCount==0){		
		if(sms_est>0){
			$("#daily_est_sms").html(Math.floor(sms_est/diff1)+' est sms daily reach');
		}else{
			$("#daily_est_sms").html('');
		}
		if(email_est>0){
			$("#daily_est_email").html(Math.floor(email_est/diff1)+' est email daily reach');
		}else{
			$("#daily_est_email").html('');
		}
		if(fb_est>0){
			$("#daily_est_social").html(Math.floor(fb_est/diff1)+' est social daily reach');
		}else{
			$("#daily_est_social").html('');
		}
		
		$("#daily_est_days").html('Over '+diff1+' day/s');
		
		$("#date_selector_next").removeAttr('disabled');
	}else{
		$("#date_selector_next").attr("disabled", true);
	}
}