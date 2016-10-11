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

function checkStep1Options() {
    if (!sessionStorage.getItem('selected_channel_id') || !sessionStorage.getItem('selected_channel_name')) {
        return false;
    }
    return true;
};

function goBack() {
    sessionStorage.removeItem('selected_channel_id');
    sessionStorage.removeItem('selected_channel_name');
    window.location.href = 'index';
};

function setDateTimeParameter(dateElementId, timeElementId, parameterName) {
    var dateValue = $('#' + dateElementId).val();
    if (dateValue !== '') {
        var timeValue = $('#' + timeElementId).val();
        if (timeValue !== '') {
            sessionStorage.setItem(parameterName, Date.parse(dateValue + ' ' + timeValue));
            return undefined;
        }
        else {
            return 'time';
        }
    }
    else {
        return 'date';
    }
};

function setAnalysisOptions() {
    sessionStorage.removeItem('option_from');
    sessionStorage.removeItem('option_to');
    sessionStorage.removeItem('option_data_usage');

    var selectedMode = $('input[name=mode]:checked').val();

    if (selectedMode == 2) {
        if ($('#fromCheck').is(":checked")) {
            var setParameterResult = setDateTimeParameter('fromDate', 'fromTime', 'option_from');
            if (typeof (setParameterResult) === 'string') {
                alert('please set from ' + setParameterResult);
                return;
            }
        } else if ($('#toCheck').is(":checked")) {
            var setParameterResult = setDateTimeParameter('toDate', 'toTime', 'option_to');
            if (typeof (setParameterResult) === 'string') {
                alert('please set to ' + setParameterResult);
                return;
            }
        }
        else{
            alert('please select at least one date & time parameter');
            return;
        }
    }

    if ($('#dataUsageCheck').is(":checked")) {
        sessionStorage.setItem('option_data_usage', true);
    }
    else {
        sessionStorage.setItem('option_data_usage', false);
    }

    window.location.href = 'result';
};

function optionsLogic() {
    if (!checkToken()) {
        window.location.replace('login');
    }

    if (!checkStep1Options()) {
        window.location.replace('index');
    }

    $('#logOutButton').click(logOut);
    $('#backButton').click(goBack);
    $('#performAnalysisButton').click(setAnalysisOptions);

    $('#selectedChannelName').text('#' + sessionStorage.getItem('selected_channel_name'));
};

$(document).ready(optionsLogic);