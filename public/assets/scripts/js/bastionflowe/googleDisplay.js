function toDataUrl(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result);
        }
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.responseType = 'blob';
    xhr.send();
}

var check = "";

    
function uploadImage(){
        try {
            var input = $('.photoFile')[0];
            var file = input.files[0];

            if(file != undefined){
                var formData= new FormData();
                if(!!file.type.match(/image.*/)){
                    formData.append("image", file);

                    $.ajax({
                        xhr: function() {
                            var xhr = new window.XMLHttpRequest();

                            xhr.upload.addEventListener("progress", function(evt) {
                                if (evt.lengthComputable) {
                                    var percentComplete = evt.loaded / evt.total;
                                    percentComplete = parseInt(percentComplete * 100);

                                    $('#google-display-progress').removeClass('hide').addClass('show');
                                    $('#google-display-bar').attr('aria-valuenow', percentComplete);
                                    $('#google-display-bar').css('width', percentComplete+'%');
                                    $('#google-display-bar').text(percentComplete+'%');

                                    if (percentComplete === 100) {}
                                }
                            }, false);

                            return xhr;
                        },
                        // /var/www/html/leadgenv3.2/
                        url: "../../campaigns/google/upload.php",
                        type: "POST",
                        data: formData,
                        processData: false,
                        contentType: false,
                        success: function(data){
                            try {
                                setTimeout(function() {
                                    $('#google-display-progress').removeClass('show').addClass('hide');
                                }, 1000);
                                
                                var ratio = (parseInt(JSON.parse(data)[2].height)/parseInt(JSON.parse(data)[1].width))*100;
//                                    $('.squares').css('background-image','url('+JSON.parse(data)[0].url+')');
//                                    $('.squares').css('width','100%');
//                                    $('.squares').css('height',''+ratio*6+'px');

                                console.log(ratio);

                                $('#google-display-img').html('');
                                $('#google-display-img').append('<p class="cropperingHeader">Click image to start cropping</p>');
                                $('#google-display-img').append('<img class="img-responsive" id="google-display-preview-single-image" src="'+JSON.parse(data)[0].url+'">');
                                // check = $("#google-display-preview-single-image").attr("src").
                               
                                if ($('#google-display-img').hasClass('hide')) {
                                    $('#google-display-img').removeClass('hide').addClass('show');
                                }
                                
                                $('.google-preview-body-image').html('');
                                $('.google-preview-body-image').append('<img class="img-responsive" id="google-display-preview-image" src="'+JSON.parse(data)[0].url+'">');
                                
                                $('#fileUrl').val(JSON.parse(data)[0].url);
                                
                                $('#google-display-img-upload-file').css('border-width', '2px');
                                $('#google-display-img-upload-file').css('border-style', 'outset');
                                $('#google-display-img-upload-file').css('border-color', 'buttonface');
                                $('#google-display-img-upload-file').css('border-image', 'initial');
                            } catch (e) {
                                if (e instanceof SyntaxError) {
                                    swal({
                                        title: "Catch error",
                                        type: "error",
                                        showCancelButton: false,    
                                        showConfirmButton: true,
                                        closeOnConfirm: true,
                                        text: e.message
                                    });
                                } else {
                                    swal({
                                        title: "Catch error",
                                        type: "error",
                                        showCancelButton: false,    
                                        showConfirmButton: true,
                                        closeOnConfirm: true,
                                        text: e.message
                                    });
                                }
                            }
                        },
                        complete: function(data) {
                            var retunObj = JSON.parse(data.responseText);
                            
                            toDataUrl(retunObj[0].url, function(myBase64) {
                                $('#google-display-preview-image').attr('src', myBase64);
                            });
                        }
                    });
                }else{
                    swal({
                        title: "Not a valid image!",
                        type: "warning",
                        showCancelButton: false,    
                        showConfirmButton: true,
                        closeOnConfirm: true
                    });
                }
            }else{
                swal({
                    title: "Input something!",
                    type: "warning",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: true
                });
            }
        } catch (e) {
            if (e instanceof SyntaxError) {
                swal({
                    title: "Catch error",
                    type: "error",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: true,
                    text: e.message
                });
            } else {
                swal({
                    title: "Catch error",
                    type: "error",
                    showCancelButton: false,    
                    showConfirmButton: true,
                    closeOnConfirm: true,
                    text: e.message
                });
            }
        }    
}    
    

$('#google-display-file').on('change', function(e) {
    e.preventDefault();
//        $('#upload').trigger('click');
uploadImage();
});

$('#google-display-img-upload-file').on('click', function(e) {
    // console.log("Click herer 89787")
    e.preventDefault();

    $('#google-display-file').val("");

    $('#google-display-file').trigger('click');
});    





$("#display-headline-1").keyup(function(){
    var str = $("#display-headline-1").val()

    $(".headline-replace").html(str)    

})
//display-long-headline

$("#display-long-headline").keyup(function(){
    var str = $("#display-long-headline").val()

    $(".lheadline-replace").html(str)   

})

//business-name

$("#business-name").keyup(function(){
    var str = $("#business-name").val()

    $(".business-name-replace").html(str)   

})

//display-description
$("#display-description").keyup(function(){
    var str = $("#display-description").val()

    $(".description-replace").html(str) 

})

$('#googledisplay-save').unbind('click').bind('click', function(e) {

var valid = validation_bf("googledisplay-save","google_display_save")
    
        if(valid){

        var  imageSrc = $("#google-display-preview-single-image").attr('src');
        var googleDisplay_Kpi = [];
        $('#googleDisplay-KPI option').each(function(key, value) {
            googleDisplay_Kpi.push($(this).text());
        });
        var googleDisplay_Kpi = googleDisplay_Kpi.toString();
        var googledisplayselectedkeywords = $('.googlesearchselectedkeywords:checkbox:checked').map(function() {
            return this.value;
        }).get();

        var channels = $('#CampaignChannels').val();

        googledisplayselectedkeywords = googledisplayselectedkeywords.toString()
        var FormData = $('form').serialize();
        var googleDisplaySaveData = FormData
                                    +"&googleDisplay_Kpi="
                                    +googleDisplay_Kpi
                                    +"&googledisplayselectedkeywords="
                                    +googledisplayselectedkeywords
                                    +"&googledisplay_image_url="
                                    +imageSrc
                                    +'&CampaignChannels='
                                    +channels.toString();                                                               
        swal({
            title: "Loading!",
            showCancelButton: false,    
            showConfirmButton: false,
            text: "",
            imageUrl: "../img/ajax-loader1.gif"
        });

        $.ajax({
            url: '../admin/save.single.campaigns.creatives.googledisplay.php',
            type: "POST",
            data : googleDisplaySaveData,
            success: function(data, textStatus, jqXHR){
                if(data>0){
                    swal({
                        title: "Successfully Saved",
                        type: "success",
                        showCancelButton: false,    
                        showConfirmButton: true,
                        closeOnConfirm: false,
                        text: "Successfully Saved"
                    });
                    if ($('.sendForApprovalDiv').hasClass('hide') == true) {
                        $('.sendForApprovalDiv').removeClass('hide');
                    }
                }else{
                    swal({
                        title: "Problem!",
                        type: "warning",
                        showCancelButton: false,    
                        showConfirmButton: true,
                        closeOnConfirm: false,
                        text: "We have experienced a small problem. Please try again later."+data
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
            },
        });
     }                           

    });