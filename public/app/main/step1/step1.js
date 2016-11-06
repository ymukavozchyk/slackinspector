(function () {
    'use strict';

    angular
        .module('app.main.step1')
        .controller('Step1Controller', Step1Controller);

    Step1Controller.$inject = ['$mdDialog', 'ApiService', 'CredentialService'];
    function Step1Controller($mdDialog, ApiService, CredentialService) {
        var vm = this;

        vm.channels = [];
        vm.selectedChannel = '';

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        activate();

        function activate() {
            ApiService.getChannels(CredentialService.getToken())
                .then(function (res) {
                    vm.channels = res.data.channels;
                    vm.selectedChannel = vm.channels[0].id;
                    vm.hideLoader = true;
                },
                function (e) {
                    vm.errorType = e.data.error_type;
                    vm.errorMessage = e.data.error;
                    vm.hideLoader = true;
                    vm.showError = true;
                    vm.showErrorDialog();
                });
        }

        vm.showErrorDialog = function () {
            var errorTitle = 'Error from ' + vm.errorType;
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .escapeToClose(false)
                    .title(errorTitle)
                    .textContent(vm.errorMessage)
                    .ariaLabel(errorTitle)
                    .ok('Ok')
            );
        };
    }
})();