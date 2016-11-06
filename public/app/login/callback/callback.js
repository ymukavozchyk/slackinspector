(function () {
    'use strict';

    angular
        .module('app.login.callback')
        .controller('CallbackController', CallbackController);

    CallbackController.$inject = ['$state', '$stateParams', 'CredentialService', 'ApiService'];
    function CallbackController($state, $stateParams, CredentialService, ApiService) {
        var vm = this;

        activate();

        function activate() {
            ApiService.login($stateParams.code)
                .then(function (res) {
                    CredentialService.setToken(res.data.encrypted_token);
                    CredentialService.resetState();
                    $state.go('main.step1');
                },
                function (e) {
                    alert(e.data.error_type + ' : ' + e.data.error);
                });
        }
    }
})();