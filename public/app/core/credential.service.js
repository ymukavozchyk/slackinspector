(function() {
    'use strict';

    angular
        .module('app.core')
        .service('CredentialService', CredentialService);

    function CredentialService() {
        var apiToken = null;
        var uniqueState = null;

        var service = {
            isTokenPresent: isTokenPresent,
            getToken: getToken,
            setToken: setToken,
            resetToken: resetToken,

            isStatePresent: isStatePresent,
            getState: getState,
            resetState: resetState
        };

        return service;

        function isTokenPresent() {
            if (apiToken !== null) {
                return true;
            }
            var storedToken = localStorage.getItem('auth.token');
            if (storedToken !== null) {
                apiToken = storedToken;
                return true;
            }
            return false;
        }

        function getToken() {
            return apiToken;
        }

        function setToken(newToken) {
            apiToken = newToken;
            localStorage.setItem('auth.token', newToken);
        }

        function resetToken() {
            apiToken = null;
            localStorage.removeItem('auth.token');
        }

        function isStatePresent() {
            if (uniqueState !== null) {
                return true;
            }
            var sessionState = sessionStorage.getItem('auth.state');
            if (sessionState !== null) {
                uniqueState = sessionState;
                return true;
            }
            return false;
        }

        function getState() {
            if (uniqueState === null) {
                uniqueState = (new Date()).getTime();
                sessionStorage.setItem('auth.state', uniqueState);
            }
            return uniqueState;
        }

        function resetState() {
            uniqueState = null;
            sessionStorage.removeItem('auth.state');
        }
    }
})();