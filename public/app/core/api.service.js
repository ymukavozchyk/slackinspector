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
            getChannels: getChannels,
            performAnalysis: performAnalysis,
            getUsageStatistics: getUsageStatistics
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

        function performAnalysis(params){
            return $http.post('/api/core/analysis', params);
        }

        function getUsageStatistics(){
            return $http.get('/api/core/usage/tone');
        }
    }
})();