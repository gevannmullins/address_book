<?php



?>


<div class="row">

    <div class="col-md-12">
        This is the new projects section

        <form name="newproject" id="newproject" class="newproject" action="/admin/projects/create" method="post">

            <label for="projectname">Project Name</label>
            <input type="text" name="projectname" id="projectname" />

            <input type="submit" name="submitnewproject" value="Create Project" />

        </form>

    </div>

</div>

<script>
    $(document).ready(function(){

        $("#newproject").submit(function(e){
            e.preventDefault();

            let submitUrl = $(this).attr('action');
            let formValues = $(this).serialize();
            let formMethod = $(this).attr('method');

            $.ajax({
                url: submitUrl,
                type: formMethod,
                data: formValues,
                success: function(data){
                    $('.admin_content_container').html(data);
                }
            });

        });

    });
</script>
