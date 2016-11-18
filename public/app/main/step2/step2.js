(function () {
    'use strict';

    angular
        .module('app.main.step2')
        .controller('Step2Controller', Step2Controller);

    Step2Controller.$inject = ['$scope', '$state', '$mdMedia', 'SharedService'];
    function Step2Controller($scope, $state, $mdMedia, SharedService) {
        var vm = this;

        $scope.$mdMedia = $mdMedia;

        vm.today = new Date();

        vm.mode = 'all';

        vm.fromCheck = false;
        vm.fromDate = vm.today;

        vm.toCheck = false;
        vm.toDate = vm.today;

        vm.minDate = undefined;

        vm.shareDataFlag = true;

        activate();

        function activate() {
            if (!SharedService.verifyStep1()) {
                $state.go('main.step1');
            }
            SharedService.resetStep2();
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
            var tempFromDate = Math.round(vm.fromDate / 1000.0);
            var tempToDate = Math.round(vm.toDate / 1000.0);

            if(vm.fromCheck !== true){
                tempFromDate = null;
            }
            if(vm.toCheck !== true){
                tempToDate = null;
            }
            SharedService.setStep2Settings(tempFromDate, tempToDate, vm.shareDataFlag);
            $state.go('main.result');
        };
    }
})();