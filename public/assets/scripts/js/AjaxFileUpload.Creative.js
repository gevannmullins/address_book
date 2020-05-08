$(function(){

	$("#drop-box").click(function(){
		$("#upl").click();
	});

	// To prevent Browsers from opening the file when its dragged and dropped on to the page
	$(document).on('drop dragover', function (e) {
        e.preventDefault();
    }); 

	// Add events
	$('input[type=file]').on('change', fileUpload);

	// File uploader function

	function fileUpload(event){  
		$("#drop-box").html("<p>"+event.target.value+" uploading...</p>");
		files = event.target.files;
		var data = new FormData();
		var error = 0;
		for (var i = 0; i < files.length; i++) {
  			var file = files[i];
			//console.log('file: '+file.name+' size: '+file.size);
  			//console.log(file.type);
			if(!file.type.match('image.*')) {
		   		$("#drop-box").html("<p> Images only. Select another file</p>");
		   		error = 1;
		  	}else if(file.size > 1048576){
		  		$("#drop-box").html("<p> Too large Payload. Select another file</p>");
		   		error = 1;
		  	}else{
		  		data.append('image', file, file.name);
		  	}
	 	}
	 	if(!error){
			var channel = $('#creative_channel option:selected').text();
		 	var xhr = new XMLHttpRequest();
		 	xhr.open('POST', 'upload.creative.image.php?channel='+channel, true);
		 	xhr.send(data);
		 	xhr.onload = function () {
				//console.log(xhr);
				//console.log(xhr.responseText);
				if (xhr.status === 200) {
					$("#drop-box").html("<p> File Uploaded. Select another?</p>");
					//$("#displayimg").html('<img src="upload_files/'+xhr.responseText+'" alt=""/> ');
					$("#creative_image").attr("src","../media.Creatives/"+xhr.responseText);
					//$("#user_avatar_display").html('<img src="../media.tmp/'+xhr.responseText+'" class="img-circle" alt="User Image" height="200px" width="200px" />');
					$("#creative_image_path").val('media.Creatives/'+xhr.responseText);
				} else {
					$("#drop-box").html("<p> Error in upload, try again.</p>");
				}
			};
		}
	}

});