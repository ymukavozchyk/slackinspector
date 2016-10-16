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

function checkStep2Options() {
    if (!sessionStorage.getItem('selected_channel_id')
        || !sessionStorage.getItem('selected_channel_name')
        || !sessionStorage.getItem('option_data_usage')) {
        return false;
    }
    return true;
};

function startOver() {
    sessionStorage.removeItem('selected_channel_id');
    sessionStorage.removeItem('selected_channel_name');
    sessionStorage.removeItem('option_from');
    sessionStorage.removeItem('option_to');
    sessionStorage.removeItem('option_data_usage');

    window.location.href = 'index';
};

function formResultTable(caption, tones) {
    var table = '<table class="watson-results-element"><caption>' + caption + '</caption>';

    tones.forEach(function (tone) {
        table += '<tr><td>' + tone.tone_name + '</td><td>' + Round2(tone.score) + '</td></tr>';
    });

    table += '</table>';

    return table;
};

function formAnalysisDateRangeTitle() {
    var title = 'Messages';
    var fromValue = undefined;
    var toValue = undefined;

    if (sessionStorage.getItem('option_from')) {
        var date = new Date(0);
        date.setUTCSeconds(sessionStorage.getItem('option_from'));
        fromValue = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    if (sessionStorage.getItem('option_to')) {
        var date = new Date(0);
        date.setUTCSeconds(sessionStorage.getItem('option_to'));
        toValue = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    if (fromValue !== undefined) {
        title += ' from ' + fromValue;
    }

    if (toValue !== undefined) {
        if (fromValue !== undefined) {
            title += ' to ' + toValue;
        }
        else {
            title += ' before ' + toValue;
        }
    }

    return title;
};

function fillAnalysisTitles(messagesCount) {
    $('#channel_title').text('#' + sessionStorage.getItem('selected_channel_name'));
    $('#range_title').text(formAnalysisDateRangeTitle());
    $('#count_title').text(messagesCount + ' message(s)');
};

function performAnalysis() {

    var params = {
        encrypted_token: localStorage.getItem('encrypted_token'),
        save_usage_data: sessionStorage.getItem('option_data_usage'),
        channel: sessionStorage.getItem('selected_channel_id')
    };

    if (sessionStorage.getItem('option_from')) {
        params.from_ts = sessionStorage.getItem('option_from');
    }

    if (sessionStorage.getItem('option_to')) {
        params.to_ts = sessionStorage.getItem('option_to');
    }

    $.post('/api/core/analysis', params)
        .done(function (data) {
            fillAnalysisTitles(data.message_count);
            data.tone.document_tone.tone_categories.forEach(function (toneCategory) {
                $('#results').append(formResultTable(toneCategory.category_name, toneCategory.tones));
            });
        })
        .fail(function (data) {
            alert(data.responseJSON.error_type + ' - ' + data.responseJSON.error);
        });
};

function resultLogic() {
    if (!checkToken()) {
        window.location.replace('login');
        return;
    }

    if (!checkStep2Options()) {
        window.location.replace('options');
        return;
    }

    $('#logOutButton').click(logOut);
    $('#startOverButton').click(startOver);

    performAnalysis();
};

$(document).ready(resultLogic);