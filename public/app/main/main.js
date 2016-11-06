(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    MainController.$inject = ['$mdDialog', '$state', 'CredentialService', 'ApiService'];
    function MainController($mdDialog, $state, CredentialService, ApiService) {
        var vm = this;

        vm.showLogOut = false;

        activate();

        function activate() {
            if (CredentialService.isTokenPresent()) {
                vm.showLogOut = true;
            }
        }

        vm.logOut = function (event) {
            $mdDialog
                .show(
                $mdDialog.confirm()
                    .title('Log out from Slack')
                    .textContent('Do you really want to log out from Slack?')
                    .ariaLabel('Log out from Slack')
                    .targetEvent(event)
                    .ok('Yes')
                    .cancel('No')
                )
                .then(function () {
                    //todo loader
                    ApiService.logout(CredentialService.getToken())
                        .then(function () {
                            CredentialService.resetToken();
                            $state.go('login');
                        },
                        function (e) {
                            alert(e.data.error_type + ' : ' + e.data.error);
                        });
                });
        };
    }
})();