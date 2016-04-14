"use strict";

$(document).ready(function () {

    function handleError(message) {
        $("#errorMessage").text(message);
    }

    function sendAjax(action, data) {
        $.ajax({
            cache: false,
            type: "POST",
            url: action,
            data: data,
            dataType: "json",
            success: function (result, status, xhr) {
                window.location = result.redirect;
            },
            error: function (xhr, status, error) {
                var messageObj = JSON.parse(xhr.responseText);

                handleError(messageObj.error);
            }
        });
    }

    $("#addScoreSubmit").on("click", function (e) {
        e.preventDefault();

        if ($("#score").val() == '') {
            handleError("All fields required");
            return false;
        }

        sendAjax($("#scoreForm").attr("action"), $("#scoreForm").serialize());

        return false;
    });

});