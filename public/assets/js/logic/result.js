'use strict';

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

function createChart(categoryId, categoryName, tones) {

    var options = {
        scales: {
            xAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        },
        legend: {
            display: false
        },
        title: {
            display: true,
            text: categoryName,
            fontSize: 18
        }
    };

    var dataLabels = [];
    var dataValues = [];

    tones.forEach(function (tone) {
        dataLabels.push(tone.tone_name);
        dataValues.push(Round2(tone.score));
    });

    var data = {
        labels: dataLabels,
        datasets: [
            {
                label: categoryName,
                data: dataValues,
                backgroundColor: 'rgba(8, 109, 178, 0.7)',
                borderColor: 'rgba(8, 109, 178, 1)'
            }
        ]
    };

    $('#results').append('<div><canvas id="' + categoryId + '" width="300" height="300"></canvas></div>');

    var ctx = $('#'+categoryId);
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: options
    });

};

function formAnalysisDateRangeTitle() {
    var title = 'All messages';
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
        title = 'Messages from ' + fromValue;
    }

    if (toValue !== undefined) {
        if (fromValue !== undefined) {
            title += ' to ' + toValue;
        }
        else {
            title = 'Messages before ' + toValue;
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
            $('#loaderSection').hide();
            $('#resultContent').show();

            data.tone.document_tone.tone_categories.forEach(function (toneCategory) {
                createChart(toneCategory.category_id, toneCategory.category_name, toneCategory.tones);
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