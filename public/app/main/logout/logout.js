(function () {
    'use strict';

    angular
        .module('app.main.logout')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$mdDialog', '$state', 'CredentialService', 'ApiService'];
    function LogoutController($mdDialog, $state, CredentialService, ApiService) {
        var vm = this;

        vm.hideProgressBar = true;
        vm.controlsDisabled = false;

        vm.closeDialog = function () {
            $mdDialog.cancel();
        };

        vm.logout = function () {
            vm.hideProgressBar = false;
            vm.controlsDisabled = true;

            ApiService.logout(CredentialService.getToken())
                .then(function () {
                    CredentialService.resetToken();
                    $mdDialog.cancel();
                    $state.go('login');
                },
                function (e) {
                    $mdDialog.hide({
                        type: e.data.error_type,
                        error: e.data.error
                    });
                });
        };
    }
})();