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

function getListOfChannels() {
    if (checkToken()) {
        $.post('/api/core/channels', {
            encrypted_token: localStorage.getItem('encrypted_token')
        })
            .done(function (data) {
                var htmlToAppend = '';
                var checked = 'checked';
                data.channels.forEach(function (channel) {
                    htmlToAppend += '<p><input type="radio" name="channel" displayName="'
                        + channel.name + '" value="' + channel.id + '" ' + checked + '> #' + channel.name + '</p>';
                    checked = '';
                });

                $('#channelList').html(htmlToAppend);
                $('#nextStepButton').show();
            })
            .fail(function (data) {
                alert(data.responseJSON.error);
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