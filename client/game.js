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
            handleError("All fields are required");
            return false;
        }

        sendAjax($("#scoreForm").attr("action"), $("#scoreForm").serialize());

        return false;
    });

    /*
    $(".deleteScore").on("click", function (e) {
        e.preventDefault();

        //console.log($(this).siblings(".scoreName")[0]);

        var json = {
            name: $(this).siblings(".scoreName").children("span").text(),
            age: $(this).siblings(".scoreAge").children("span").text(),
            bloodType: $(this).siblings(".scoreBloodType").children("span").text(),
            _csrf: $("#scoreForm input[name=_csrf]").attr("value")
        };

        //console.log($("#scoreForm").serialize());
        //console.log($.param(json));

        sendAjax($(this).attr("action"), $.param(json));

        return false;
    });
    */

});