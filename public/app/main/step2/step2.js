(function () {
    'use strict';

    angular
        .module('app.main.step2')
        .controller('Step2Controller', Step2Controller);

    Step2Controller.$inject = ['$mdDialog', '$state', 'SharedService'];
    function Step2Controller($mdDialog, $state, SharedService) {
        var vm = this;

        activate();

        function activate() {
            if (!SharedService.verifyStep1()) {
                $state.go('main.step1');
            }
        }

        function showErrorDialog(type, message) {
            var errorTitle = 'Error from ' + type;
            $mdDialog.show(
                $mdDialog.alert()
                    .clickOutsideToClose(false)
                    .escapeToClose(false)
                    .title(errorTitle)
                    .textContent(message)
                    .ariaLabel(errorTitle)
                    .ok('Ok')
            );
        }
    }
})();