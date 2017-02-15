(function () {
    'use strict';

    angular
        .module('app.main.logout')
        .controller('LogoutController', LogoutController);

    LogoutController.$inject = ['$rootScope', '$mdDialog', '$state', 'CredentialService', 'ApiService'];
    function LogoutController($rootScope, $mdDialog, $state, CredentialService, ApiService) {
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
                .catch(function (e) {
                    $mdDialog.hide({
                        type: e.data.error_type,
                        error: e.data.error
                    });
                }).finally(function () {
                    CredentialService.resetToken();
                    $mdDialog.cancel();
                    $rootScope.$broadcast('show-log-out', {
                        value: false
                    });
                    $state.go('main.login');
                });
        };
    }
})();