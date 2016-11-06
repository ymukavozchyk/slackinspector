(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    MainController.$inject = ['$mdDialog', '$mdToast', 'CredentialService'];
    function MainController($mdDialog, $mdToast, CredentialService) {
        var vm = this;

        vm.showLogOut = false;

        activate();

        function activate() {
            if (CredentialService.isTokenPresent()) {
                vm.showLogOut = true;
            }
        }

        function showToast(text, type) {
            $mdToast.show(
                $mdToast.simple()
                    .textContent(text)
                    .position('top right')
                    .hideDelay(6000)
                    .toastClass(type)
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
                .then(function (error) {
                    showToast(error, 'error');
                });
        };
    }
})();