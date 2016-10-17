'use strict';

function checkForAuthCode() {
    var authCode = getParameterByName('code');
    if (authCode !== null) {
        $.post('/api/auth/login', {
            code: authCode
        })
            .done(function (data) {
                localStorage.setItem('encrypted_token', data.encrypted_token);
                window.location.replace('index');
            })
            .fail(function (data) {
                alert(data.responseJSON.error_type + ' - ' + data.responseJSON.error);
            });
    }
};

function loginLogic() {
    if (checkToken()) {
        window.location.replace('index');
        return;
    }

    checkForAuthCode();
};

$(document).ready(loginLogic);