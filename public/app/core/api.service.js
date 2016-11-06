(function () {
    'use strict';

    angular
        .module('app.core')
        .service('ApiService', ApiService);

    ApiService.$inject = ['$http'];
    function ApiService($http) {
        var service = {
            login: login,
            logout: logout,
            getChannels: getChannels
        };

        return service;

        function login(authCode) {
            return $http.post('/api/auth/login', {
                code: authCode
            });
        }

        function logout(token) {
            return $http.post('/api/auth/revoke', {
                encrypted_token: token
            });
        }

        function getChannels(token) {
            return $http.post('/api/core/channels', {
                encrypted_token: token
            });
        }
    }
})();