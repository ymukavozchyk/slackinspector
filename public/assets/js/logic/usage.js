'use strict';

function logOut() {
    if (checkToken()) {
        $.post('/api/auth/revoke', {
            encrypted_token: localStorage.getItem('encrypted_token')
        })
            .done(function () {
                localStorage.removeItem('encrypted_token');
                window.location.replace('login');
            })
            .fail(function (data) {
                alert(data.responseJSON.error);
            });
    }
    else {
        alert('token is undefined');
    }
};

function formResultTable(caption, tones) {
    var table = '<table class="watson-results-element"><caption>' + caption + '</caption>';

    tones.forEach(function (tone) {
        table += '<tr><td>' + tone.tone_name + '</td><td>' + Round2(tone.average_value) + '</td></tr>';
    });

    table += '</table>';

    return table;
};

function getUsageData() {
    $.get('/api/core/usage/tone')
        .done(function (data) {
            data.result.forEach(function (resultElement) {
                $('#results').append(formResultTable(resultElement._id.category_name, resultElement.tones));
            });
        })
        .fail(function (data) {
            alert(data.responseJSON.error_type + ' - ' + data.responseJSON.error);
        });
};

function usageLogic() {
    if (checkToken()) {
        $('#logOutButton').click(logOut);
        $('#logOutButton').show();
    }

    getUsageData();
};

$(document).ready(usageLogic);