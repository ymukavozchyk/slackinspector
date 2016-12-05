(function () {
    'use strict';

    angular
        .module('app.main')
        .controller('MainController', MainController);

    MainController.$inject = ['$scope', '$state', '$mdDialog', '$mdSidenav', 'CredentialService'];
    function MainController($scope, $state, $mdDialog, $mdSidenav, CredentialService) {
        var vm = this;

        vm.showLogOut = false;

        activate();

        function activate() {
            if (CredentialService.isTokenPresent()) {
                vm.showLogOut = true;
            }
        }

        function showErrorDialog(type, message) {
            var errorTitle = type + ' error';
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

        $scope.$on('show-log-out', function (event, args) {
            vm.showLogOut = args.value;
        });

        vm.openMenu = function () {
            $mdSidenav('left').toggle();
        };

        vm.closeMenu = function () {
            $mdSidenav('left').close();
        };

        vm.changeStateFromMenu = function (stateName){
            $mdSidenav('left').close();
            $state.go(stateName);
        };
    }
})();