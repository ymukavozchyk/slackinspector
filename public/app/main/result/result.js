(function () {
    'use strict';

    angular
        .module('app.main.result')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$mdDialog', '$state', 'ApiService', 'SharedService', 'CredentialService'];
    function ResultController($mdDialog, $state, ApiService, SharedService, CredentialService) {
        var vm = this;

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        activate();

        function activate() {
            if (!SharedService.verifyStep1()) {
                $state.go('main.step1');
            }
            else if (!SharedService.verifyStep2()) {
                $state.go('main.step2');
            }
            else {
                performAnalysis();
            }
        }

        function performAnalysis() {
            var step1Settings = SharedService.getStep1Settings();
            var step2Settings = SharedService.getStep2Settings();

            var params = {
                encrypted_token: CredentialService.getToken(),
                save_usage_data: step2Settings.shareData.toString(),
                channel: step1Settings.selectedChannelId
            };

            if (step2Settings.dateFrom !== null) {
                params.from_ts = step2Settings.dateFrom;
            }

            if (step2Settings.dateTo !== null) {
                params.to_ts = step2Settings.dateTo;
            }

            ApiService.performAnalysis(params)
                .then(function (res) {
                    vm.hideLoader = true;
                    console.log(res.data);
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
            $state.go('main.step2');
        };
    }
})();