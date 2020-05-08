fieldValidations();

var campaignID = $('#CampaignID').val();
//CampaignClientID

var campaignClientID = $("#CampaignClientID").val()
var campaign_goal = $('#campaign_goal').val();

var temp = [];

$('.backToSettings').on('click', function() {
    $('.dataTableClass').DataTable().page.len(10).draw();
    
    $(".CampaignSettingsContent").show("slow");

    if ($('#default_content_adset').hasClass('active show') == true) {
        $('#default_content_adset').removeClass('active show');
    }
    if ($('#backToSettings').hasClass('hide') == false) {
        $('#backToSettings').addClass('hide');
    }
    $('.creativeDivContent').hide();
});

 // save campaign
$('#CampaignChannels').on('change' , function(){
    var channels = $('#CampaignChannels').val();

    if (channels.length > 0) {
        $('.addsetDivLabel').removeClass('hide');
        $('.clientDetailsLine').removeClass('hide');
        $('#selAdSet').trigger('click');

        $('#CampaignChannels ul.select2-selection__rendered').css('border', 'rgb(169, 169, 169)');
    } else {
        $('#CampaignChannels ul.select2-selection__rendered').css('border', '2px solid red');
        $('#CampaignChannels ul.select2-selection__rendered').focus();
    }
});
$('#CampaignsModal').on('click', '#save_campaign_details', function(e){
    
    var valid = validation_bf("save_campaign_details","CampaignSettingsContent")
    

    if(valid){
        e.preventDefault();
        e.stopPropagation();

        swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
        });

        if ($('#backToSettings').hasClass('hide') == true) {
            $('#backToSettings').removeClass('hide');
        }

        if ($('#default_content_adset').hasClass('active show') == false) {
            $('#default_content_adset').addClass('active show');
        }

        $(".CampaignSettingsContent").hide("slow");
        $('.creativeDivContent').show();


//        $('#CampaignsModal').modal('hide');
//
//        $('#CampaignsModalSettings').hide('fast');
//        $('#CampaignsModalCreatives').show('fast');

        $('.dataTableClass').DataTable().page.len(-1).draw();

        var FormData = '';
        var FormData = FormData + $('#CampaignSettingsForm').serialize();
        var excl_campaign_account_ids = $('.excl_campaign_account_ids:checkbox:not(:checked)').map(function() {
            return this.value;
        }).get();
        var excl_campaign_account_ids = '&excl_campaign_account_ids='+excl_campaign_account_ids.join(",");
        var FormData = FormData + excl_campaign_account_ids + '&brief=2';
        //    console.log(FormData);
        /* DO CAMPAIGN SETTINGS UPDATE*/
        $.ajax({
            type: "POST",
            url: '../campaigns/save.single.campaigns.php',
            data : FormData,
            complete: function(data, textStatus, jqXHR){
              console.log(data.responseText);
        //            console.log(data.responseText);
        var CampaignID = data.responseText;

            if(CampaignID>0){    
                swal.close();

                $('#CampaignID').val(CampaignID);

                var channels = $('#CampaignChannels').val();

                if (channels.length > 0) {
                    $('.addsetDivLabel').removeClass('hide');
                    $('.clientDetailsLine').removeClass('hide');
                    $('#selAdSet').trigger('click');

                    $('#CampaignChannels ul.select2-selection__rendered').css('border', 'rgb(169, 169, 169)');
                } else {
                    $('#CampaignChannels ul.select2-selection__rendered').css('border', '2px solid red');
                    $('#CampaignChannels ul.select2-selection__rendered').focus();
                }

                return false;
            }else{
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "We have experienced a small problem. Please try again later."
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            swal({
                title: "Problem!",
                type: "warning",
                showCancelButton: false,    
                showConfirmButton: true,
                closeOnConfirm: false,
                text: "Error: "+errorThrown
            });
        }
        });
    }
});

//var checkedArray=[];
//$('#campaign_client_accounts').on('change','.excl_campaign_account_ids',function(){
//    if( $(this).is(':checked') == false)
//    {
//        //if checked add to array
//        checkedArray[checkedArray.length]=$(this).val();
//    }else{
//        //If unchecked remove the value from the array
//        var index=checkedArray.indexOf($(this).val());
//        if (index > -1) {
//            checkedArray.splice(index, 1);
//        }
//    }
//});

$('#BriefModal').on('click', '#save_brief_details', function(e){
    
    
    
    var valid = validation_bf("save_brief_details","CampaignSettingsContent")
    

    if(valid){

    e.preventDefault();
    e.stopPropagation();
    
    swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
    });

    if ($('#backToSettings').hasClass('hide') == true) {
        $('#backToSettings').removeClass('hide');
    }
    
    if ($('#default_content_adset').hasClass('active show') == false) {
        $('#default_content_adset').addClass('active show');
    }

    $(".CampaignSettingsContent").hide("slow");
    $('.creativeDivContent').show();
    
    
//        $('#CampaignsModal').modal('hide');
//
//        $('#CampaignsModalSettings').hide('fast');
//        $('#CampaignsModalCreatives').show('fast');

    $('.dataTableClass').DataTable().page.len(-1).draw();

    var FormData = '';
    var FormData = FormData + $('#CampaignSettingsForm').serialize();
    var excl_campaign_account_ids = $('.excl_campaign_account_ids:checkbox:not(:checked)').map(function() {
            return this.value;
    }).get();
    var excl_campaign_account_ids = '&excl_campaign_account_ids='+excl_campaign_account_ids.join(",");
//    console.log(excl_campaign_account_ids);
    var FormData = FormData + excl_campaign_account_ids + '&brief=1';
//    console.log(FormData);
    /* DO CAMPAIGN SETTINGS UPDATE*/
    $.ajax({
        type: "POST",
        url: '../campaigns/save.single.campaigns.php?brief=1',
        data : FormData,
        complete: function(data, textStatus, jqXHR){
              console.log(data.responseText);
//            console.log(data.responseText);
            var CampaignID = data.responseText;
                
            if(CampaignID>0){    
                swal.close();
                
                $('#CampaignID').val(CampaignID);
                
                var channels = $('#CampaignChannels').val();

                if (channels.length > 0) {
                    $('.addsetDivLabel').removeClass('hide');
                    $('.clientDetailsLine').removeClass('hide');
                    $('#selAdSet').trigger('click');

                    $('#CampaignChannels ul.select2-selection__rendered').css('border', 'rgb(169, 169, 169)');
                } else {
                    $('#CampaignChannels ul.select2-selection__rendered').css('border', '2px solid red');
                    $('#CampaignChannels ul.select2-selection__rendered').focus();
                }
                
                return false;
            }else{
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "We have experienced a small problem. Please try again later."
                });
            }
        },
        error: function (jqXHR, textStatus, errorThrown){
            swal({
                title: "Problem!",
                type: "warning",
                showCancelButton: false,    
                showConfirmButton: true,
                closeOnConfirm: false,
                text: "Error: "+errorThrown
            });
        }
    });

}
});




$(".creativeEdit").hide();

$('#selAdSet').click(function(e){
    e.preventDefault();
    e.stopPropagation();
        $(".adSetEdit").slideDown("slow")


        $(".creativeEdit").hide();      

})

$('.selCreative').on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    
        var creativeId = $(this).attr('id');
        var str = '';

        switch (creativeId) {
                case "sms_selCreative":
                        str = "sms";
                        break;
                case "email_selCreative":
                        str = "email";
                        break;
                case "facebook_selCreative":
                        str = "facebook";

                        swal({
                            title: "Loading!",
                            showCancelButton: false,    
                            showConfirmButton: false,
                            text: "",
                            imageUrl: "../img/ajax-loader1.gif"
                        });

                        if ($('.facebookContent').children().is('.previewCreator') == false) {
                            var start_get_campaign_account_ids = $('.fb_excl_campaign_account_ids:checkbox:checked').map(function() {
                                    return this.value;
                            }).get();

                            // console.log(start_get_campaign_account_ids);

                            $accountIDS = JSON.stringify(start_get_campaign_account_ids);

                            $('.facebookContent').html("");
                            $('.facebookContent').load('../previewCreation/index.php?accountIDs='+$accountIDS+'&campaignID='+campaignID,function(responseTxt,statusTxt,xhr){    
                                if(statusTxt=="error"){
                                        swal({
                                                title: "Problem!",
                                                type: "warning",
                                                showCancelButton: false,    
                                                showConfirmButton: true,
                                                closeOnConfirm: false,
                                                text: "Error: "+xhr.status+": "+xhr.statusText
                                        });
                                }else{
                                        swal.close();
                                        return false;
                                }
                            });
                        } else {
                            swal.close();
                        }

                        break;
                case "google_selCreative":
                        str = "google";
                        break;          
                default:
                        str = '';
                break;
        }

    var valid = validation_bf(str+"_creativeEdit",str+"_adSetEdit")
    
    if(valid){


        $("#"+str+"_creativeEdit").show("slow");
    }

})
        
$("#selAdSet").on('click', function(e){
    e.preventDefault();
    e.stopPropagation();
    
    var channelValues = $("#CampaignChannels").val()
    $(".channelPlacement").html('');
    
//    console.log(channelValues);
    if (channelValues.length > 0) {
        

        $.each(channelValues, function(key, value) {
            switch(value){
                case "2": //  SMS
                        if (key == 0) {
                                $(".channelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#sms_content_adset">SMS</a></li>')
                                $('#sms_content_adset').addClass('active show');
                        } else {
                                $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#sms_content_adset">SMS</a></li>')
                                $('#sms_content_adset').removeClass('active show');
                        }                               
                break;
                case "3": // email
                        if (key == 0) {
                                $(".channelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#email_content_adset">Email</a></li>')
                                $('#email_content_adset').addClass('active show');
                        } else {    
                                $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#email_content_adset">Email</a></li>')
                                $('#email_content_adset').removeClass('active show');
                        }
                break;
                case "5": // Facebook
                        if (key == 0) {
                                $(".channelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#facebook_content_adset">Facebook</a></li>')
                                $('#facebook_content_adset').addClass('active show');
                        } else {
                                $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#facebook_content_adset">Facebook</a></li>')
                                $('#facebook_content_adset').removeClass('active show');
                        }
                break;
                case "6": //Google
                        if (key == 0) {
                                $(".channelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#google_content_adset">Google</a></li>')
                                $('#google_content_adset').addClass('active show');
                        } else {
                                $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#google_content_adset">Google</a></li>')
                                $('#google_content_adset').removeClass('active show');
                        }   
                break;
                default:
                        $(".channelPlacement").append('<li class="nav-item active"><a class="nav-link" data-toggle="tab" href="#sms_content_adset">SMS</a></li>')
                        $('#sms_content_adset').addClass('active show');
                        $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#email_content_adset">Email</a></li>')
                        $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#facebook_content_adset">Facebook</a></li>')
                        $(".channelPlacement").append('<li class="nav-item"><a class="nav-link" data-toggle="tab" href="#google_content_adset">Google</a></li>')
            }
        });
        
        if ($.inArray("2", channelValues) == -1) {
            if ($('#sms_content_adset').hasClass('active show')) {
                $('#sms_content_adset').removeClass('active show');
            }
        } 
        if ($.inArray("3", channelValues) == -1) {
            if ($('#email_content_adset').hasClass('active show')) {
                $('#email_content_adset').removeClass('active show');
            }
        } 
        if ($.inArray("5", channelValues) == -1) {
            if ($('#facebook_content_adset').hasClass('active show')) {
                $('#facebook_content_adset').removeClass('active show');
            }
        } 
        if ($.inArray("6", channelValues) == -1) {
            if ($('#google_content_adset').hasClass('active show')) {
                $('#google_content_adset').removeClass('active show');
            }
        }
    } else if (channelValues.length == 0) {
        $('.content_adset').each(function() {
            if ($(this).hasClass('active show')) {
                $(this).removeClass('active show');
            }
        });
        
        if ($('.addsetDivLabel').hasClass('hide') == false) {
            $('.addsetDivLabel').addClass('hide');
        }
    }  
 });
 
 $('.sendForApproval').on('click', function() {

    swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
    });
    
    var campaignid = $('#CampaignID').val();
    
    $.ajax({
        type: "POST",
        url: '../approval_system/approval.single.campaigns.php?campaignid='+campaignid+"&type=3",
        complete: function(data, textStatus, xhr){
            var result = data.responseText;
            console.log(result);
            
            if (result == 'success') {
                $('#CampaignsModal').modal('hide');
                window.location.href = '../campaigns/?menu=LGcampaigns';
            } else {
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "Error: "+xhr.status+": "+xhr.statusText
                });
            }

        }
    });
});

$('.sendForBriefApproval').on('click', function() {
     swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
    });
    
    var campaignid = $('#CampaignID').val();
    
    $.ajax({
        type: "POST",
        url: '../approval_system/approval.single.campaigns.php?campaignid='+campaignid+"&type=3",
        complete: function(data, textStatus, xhr){
            var result = data.responseText;
            console.log(result);
            
            if (result == 'success') {
                $('#CampaignsModal').modal('hide');
                window.location.href = '../brief/?menu=brief';
            } else {
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "Error: "+xhr.status+": "+xhr.statusText
                });
            }
        }
    });
});
 
$("#goSelChannel").click(function(e){
    e.stopPropagation();
    e.preventDefault();
    
	var googleType = $(".goSelect").val()
	
    $(".googleTypechannelPlacement").html('');
				
	$.each(googleType, function(key1, value1) {
					

					switch (value1){ 
						case "1": 
							
							if (key1 == 0) {
								$(".googleTypechannelPlacement").append('<li class="nav-item active"><a class="nav-link active" data-toggle="tab" href="#googleSearchCreative">Search</a></li>')
								$("#googleSearchCreative").addClass('active show');
							} else {
								$(".googleTypechannelPlacement").append('<li class="nav-item "><a class="nav-link" data-toggle="tab" href="#googleSearchCreative">Search</a></li>')
								$("#googleSearchCreative").removeClass('active show');
							}
						
                        break;
						case "2":
						
						    if (key1 == 0) {
								$(".googleTypechannelPlacement").append('<li class="nav-item active"><a class="nav-link active " data-toggle="tab" href="#googleDisplayCreative">Display</a></li>')
								$("#googleDisplayCreative").addClass('active show');
							} else {
								$(".googleTypechannelPlacement").append('<li class="nav-item "><a class="nav-link " data-toggle="tab" href="#googleDisplayCreative">Display</a></li>')
								$("#googleDisplayCreative").removeClass('active show');
							}
                        break;
						// case "3":
						// 	$("#googleYoutubeCreative").show()
						// 	$(".googleTypechannelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#googleYoutubeCreative">Youtube</a></li>')
						// 	$("#googleYoutubeCreative").addClass('active show');
						// break;
						// case"4": //googleKeywordCreative
						// 	$("#googleKeywordCreative").show()
						// 	$(".googleTypechannelPlacement").append('<li class="nav-item active"><a class="nav-link active show" data-toggle="tab" href="#googleKeywordCreative">Keywords</a></li>')
						// 	$("#googleKeywordCreative").addClass('active show');
						// break;	

						default:
							console.log("0")
						break;	


					}

		})

})





$('#approvedForApproval').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
    });
    
    var campaignid = $('#CampaignID').val();
    
    $.ajax({
        type: "POST",
        url: '../approval_system/approval.single.campaigns.php?campaignid='+campaignid+'&type=1',
        complete: function(data, textStatus, jqXHR){
            var result = data.responseText;
            console.log(result);
            if (result == 'success') {
                swal({
                    title: "Approved!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: false,
                    closeOnConfirm: false,
                    text: "Brief/Campaign Approved!"
                });
                setTimeout(function() {
                    $('#CampaignsModal').modal('hide');
                    window.location.href = '../approval_system/?menu=pending';
                }, 2000);
            } else {
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "Error: "+xhr.status+": "+xhr.statusText
                });    
            }
        }
    });
});

$('#declinedForApproval').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
        
    if ($('.declinedForApprovalDiv').hasClass('hide') == false) {
        $('.declinedForApprovalDiv').addClass('hide');
    }
    
    if ($('.declinedMessage').hasClass('hide') == true) {
        $('.declinedMessage').removeClass('hide').addClass('show');
    }
});

$('#declinedConfirm').on('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
    });

    var campaignid = $('#CampaignID').val();
    var message = $('#declinedMessage').val();
    
    var formData = new FormData();
    formData.append('message', message);
    
    $.ajax({
        type: "POST",
        url: '../approval_system/approval.single.campaigns.php?campaignid='+campaignid+'&type=2',
        data: formData,
        contentType: false,
        processData: false,
        complete: function(data, textStatus, jqXHR){
            var result = data.responseText;
            
            console.log(result);
            if (result == 'success') {
                swal.close();
                $('#CampaignsModal').modal('hide');
                window.location.href = '../approval_system/?menu=pending';
            } else {
                swal({
                    title: "Problem!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: false,
                    text: "Error: "+xhr.status+": "+xhr.statusText
                });
            }
        }
    });
});

function validation_bf(idToVal,mainDivClass){

var valid = false;
var countRequired = 0;    
var countRequiredValid = 0;
// var countRequiredNum = 0;    
// var countRequiredValidNum = 0;
// var textCountNum = 0;
var textCount = 0;
var flag = false;
//console.log(mainDivClass)
        $("."+mainDivClass+" .bf-validate-required ").each(function(){
            
//            console.log($(this).val())

            countRequired++;

                if($(this).val() == "" || $(this).val() == null || $(this).val() == -1 ){

                    $(this).css("border","1px red solid")
                    $(this).parent().children().each(function() {
                        console.log($(this).attr('class'));
                        if ($(this).hasClass('bf-error') == true) {
                            flag = true;
                        }
                    });

                    if (flag == false) {
                        $(this).parent().append("<div class='bf-error' style='font-size:12px;color:red;'>Please enter details</div>") 
                    }
                
                   
                
                } else if($(this).val() != ""|| $(this).val() != null ){
                    
                   $(this).css("border","")
                   $(this).parent().append("")
                   countRequiredValid++;
                
                } 

        })    

//console.log(countRequiredValid)
//console.log(countRequired)


 if(countRequiredValid == countRequired )  {   
    valid = true;
}

return valid;

}
