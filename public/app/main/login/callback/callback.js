(function () {
    'use strict';

    angular
        .module('app.main.login.callback')
        .controller('CallbackController', CallbackController);

    CallbackController.$inject = ['$rootScope', '$state', '$stateParams',
        '$mdDialog', 'CredentialService', 'ApiService'];
    function CallbackController($rootScope, $state, $stateParams, $mdDialog, CredentialService, ApiService) {
        var vm = this;

        vm.hideLoader = false;

        activate();

        function activate() {
            ApiService.login($stateParams.code)
                .then(function (res) {
                    CredentialService.setToken(res.data.encrypted_token);
                    CredentialService.resetState();
                    $rootScope.$broadcast('show-log-out', {
                        value: true
                    });
                    $state.go('main.step1');
                },
                function (e) {
                    vm.hideLoader = true;
                    showErrorDialog(e.data.error_type, e.data.error);
                });
        }

        function showErrorDialog(errorType, errorMessage) {
            var errorTitle = errorType + ' error';
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .escapeToClose(false)
                    .title(errorTitle)
                    .textContent(errorMessage)
                    .ariaLabel(errorTitle)
                    .ok('Ok')
            )
                .finally(function () {
                    $state.go('main.login');
                });
        }
    }
})();