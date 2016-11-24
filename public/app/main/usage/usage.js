(function() {
    'use strict';

    angular
        .module('app.main.usage')
        .controller('UsageController', UsageController);

    UsageController.$inject = ['$mdDialog', 'ApiService'];
    function UsageController($mdDialog, ApiService) {
        var vm = this;

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        getUsageStatistics();

        function getUsageStatistics() {
            ApiService.getUsageStatistics()
                .then(function(res) {
                    vm.hideLoader = true;
                    console.log(res.data);
                },
                function(e) {
                    vm.errorType = e.data.error_type;
                    vm.errorMessage = e.data.error;
                    vm.hideLoader = true;
                    vm.showError = true;
                    vm.showErrorDialog();
                });
        }

        vm.showErrorDialog = function() {
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

        vm.tryAgain = function() {
            vm.hideLoader = false;
            vm.showError = false;
            vm.errorType = '';
            vm.errorMessage = '';

            getUsageStatistics();
        };
    }
})();