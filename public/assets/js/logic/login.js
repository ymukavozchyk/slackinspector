'use strict';

function checkForAuthCode() {
    var authCode = getParameterByName('code');
    if (authCode !== null) {
        $.post('/api/auth/login', {
            code: authCode
        }, function (data) {
            if (data.ok) {
                localStorage.setItem('encrypted_token', data.encrypted_token);
                window.location.replace('index');
            }
            else {
                alert(data.error);
            }
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