(function () {
    'use strict';

    angular
        .module('app.main.step1')
        .controller('Step1Controller', Step1Controller);

    Step1Controller.$inject = ['$mdDialog', '$state', 'ApiService', 'CredentialService', 'SharedService'];
    function Step1Controller($mdDialog, $state, ApiService, CredentialService, SharedService) {
        var vm = this;

        vm.channels = [];
        vm.selectedChannelIndex = 0;

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        activate();

        function activate() {
            SharedService.resetStep1();

            ApiService.getChannels(CredentialService.getToken())
                .then(function (res) {
                    vm.channels = res.data.channels;
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

        vm.goToStep2 = function () {
            var selectedChannel = vm.channels[vm.selectedChannelIndex];
            SharedService.setStep1Settings(selectedChannel.id);
            $state.go('main.step2');
        };
    }
})();