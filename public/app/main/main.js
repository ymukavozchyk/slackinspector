(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    MainController.$inject = ['$mdDialog', 'CredentialService'];
    function MainController($mdDialog, CredentialService) {
        var vm = this;

        vm.showLogOut = false;

        activate();

        function activate() {
            if (CredentialService.isTokenPresent()) {
                vm.showLogOut = true;
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


        vm.logOut = function (event) {
            $mdDialog.show({
                templateUrl: 'app/main/logout/logout.html',
                targetEvent: event,
                controller: 'LogoutController as vm',
                clickOutsideToClose: false,
                escapeToClose: false
            })
                .then(function (e) {
                    showErrorDialog(e.type, e.error);
                });
        };
    }
})();