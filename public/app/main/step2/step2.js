(function () {
    'use strict';

    angular
        .module('app.main.step2')
        .controller('Step2Controller', Step2Controller);

    Step2Controller.$inject = ['$scope', '$mdDialog', '$state', 'SharedService'];
    function Step2Controller($scope, $mdDialog, $state, SharedService) {
        var vm = this;

        vm.today = new Date();

        vm.mode = 'all';

        vm.fromCheck = false;
        vm.fromDate = vm.today;

        vm.toCheck = false;
        vm.toDate = vm.today;

        vm.minDate = undefined;

        activate();

        function activate() {
            if (!SharedService.verifyStep1()) {
                $state.go('main.step1');
            }
            SharedService.resetStep2();
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

        $scope.$watch('vm.fromDate', function (newValue, oldValue) {
            vm.minDate = vm.fromDate;
            if (vm.toDate < vm.minDate) {
                vm.toDate = vm.minDate;
            }
        });

        $scope.$watch('vm.fromCheck', function (newValue, oldValue) {
            if (newValue) {
                vm.minDate = vm.fromDate;
                if (vm.toDate < vm.minDate) {
                    vm.toDate = vm.minDate;
                }
            }
            else {
                vm.minDate = undefined;
            }
        });

        vm.goToStep1 = function(){
            $state.go('main.step1');
        };

        vm.goToAnalysis = function () {
            var tempFromDate = vm.fromDate;
            var tempToDate = vm.toDate;

            if(vm.fromCheck !== true){
                tempFromDate = null;
            }
            if(vm.toCheck !== true){
                tempToDate = null;
            }
            SharedService.setStep2Settings(vm.mode, tempFromDate, tempToDate);
            //todo goto result
        };
    }
})();