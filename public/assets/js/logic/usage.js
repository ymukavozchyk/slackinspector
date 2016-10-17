'use strict';

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
        dataValues.push(Round2(tone.average_value));
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

    $('#usageStatistics').append('<div><canvas id="' + categoryId + '" width="300" height="300"></canvas></div>');

    var ctx = $('#'+categoryId);
    var chart = new Chart(ctx, {
        type: 'horizontalBar',
        data: data,
        options: options
    });
};

function getUsageData() {
    $.get('/api/core/usage/tone')
        .done(function (data) {
            $('#loaderSection').hide();
            $('#usageResults').show();

            data.result.forEach(function (resultElement) {
                createChart(resultElement._id.category_id, resultElement._id.category_name, resultElement.tones)
            });
        })
        .fail(function (data) {
            alert(data.responseJSON.error_type + ' - ' + data.responseJSON.error);
        });
};

function usageLogic() {
    if (checkToken()) {
        $('#logOutButton').click(logOut);
        $('#logOutButton').removeClass('hidden');
    }

    getUsageData();
};

$(document).ready(usageLogic);