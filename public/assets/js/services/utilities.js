"use strict";

function checkToken() {
    if (localStorage.getItem('encrypted_token')) {
        return true;
    }
    return false;
};

function getParameterByName(name) {
    var url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function Round2(value) {
    return Math.round(value * 100) / 100;
};