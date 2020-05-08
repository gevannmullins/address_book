<?php


?>
<link rel="stylesheet" href="/assets/speech/styles.css">

<style>
    #lucy_container {
        /*position: absolute;*/
        bottom: 0;
        /*width: 100%;*/
        padding-bottom: 2px;
    }
    .lucy_header {
        padding-top: 8px;
        padding-bottom: 10px;
        color: #ffffff;
        font-size: 16px;
        font-weight: 800;
    }
    #lucy_listening_box {
        width: 100%;
        column-width: max-content;
        height: 100px;
    }

    .app {
        display: none;
    }

</style>

<div class="row" id="lucy_container">
    <div class="col-md-12">

        <div class="row">
            <div class="col-md-12 text-center lucy_header">
                Lucy - Listening
            </div>
        </div>
        <div class="row">
<!--            <div class="col-md-12">-->
                <textarea id="lucy_listening_box"></textarea>

                <h3 class="no-browser-support">Sorry, Your Browser Doesn't Support the Web Speech API. Try Opening This Demo In Google Chrome.</h3>

                <div class="app">
                    <h3>Add New Note</h3>
                    <div class="input-single">
                        <textarea id="note-textarea" placeholder="Create a new note by typing or using voice recognition." rows="6"></textarea>
                    </div>
                    <button id="start-record-btn" title="Start Recording">Start Recognition</button>
                    <button id="pause-record-btn" title="Pause Recording">Pause Recognition</button>
                    <button id="save-note-btn" title="Save Note">Save Note</button>
                    <p id="recording-instructions">Press the <strong>Start Recognition</strong> button and allow access.</p>

                    <h3>My Notes</h3>
                    <ul id="notes">
                        <li>
                            <p class="no-notes">You don't have any notes.</p>
                        </li>
                    </ul>

                </div>
<!--            </div>-->
        </div>

    </div>
</div>


<script src="/assets/speech/script.js"></script>
