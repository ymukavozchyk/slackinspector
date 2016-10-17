'use strict';

function getListOfChannels() {
    if (checkToken()) {
        $.post('/api/core/channels', {
            encrypted_token: localStorage.getItem('encrypted_token')
        })
            .done(function (data) {
                var htmlToAppend = '';
                var checked = 'checked';
                data.channels.forEach(function (channel) {
                    htmlToAppend += '<p><label><input type="radio" name="channel" displayName="'
                        + channel.name + '" value="' + channel.id + '" ' + checked + '> #' + channel.name + '</label></p>';
                    checked = '';
                });

                $('#channelList').html(htmlToAppend);
                $('#loaderSection').hide();
                $('#channelSection').show();
                $('#nextStepButton').show();
            })
            .fail(function (data) {
                alert(data.responseJSON.error_type + ' - ' + data.responseJSON.error);
            });
    }
    else {
        alert('token is undefined');
    }
};

function goToNextStep() {
    var selectedRadio = $('input[name=channel]:checked');
    if (selectedRadio.val() === undefined) {
        alert('please select a channel to proceed');
    }
    else {
        sessionStorage.setItem('selected_channel_id', selectedRadio.val());
        sessionStorage.setItem('selected_channel_name', selectedRadio.attr('displayName'));
        window.location.replace('options');
    }
};

function indexLogic() {
    if (!checkToken()) {
        window.location.replace('login');
        return;
    }

    $('#logOutButton').click(logOut);
    $('#nextStepButton').click(goToNextStep);

    getListOfChannels();
};

$(document).ready(indexLogic);