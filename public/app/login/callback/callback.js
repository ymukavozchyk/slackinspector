(function() {
    'use strict';

    angular
        .module('app.login.callback')
        .controller('CallbackController', CallbackController);

    CallbackController.$inject = ['$state', '$stateParams', '$interval', 'CredentialService', 'ApiService'];
    function CallbackController($state, $stateParams, $interval, CredentialService, ApiService) {
        var vm = this;

        var redirectDelayInSeconds = 10;
        var redirectDelay = redirectDelayInSeconds * 1000;
        var interval;

        vm.hideLoader = false;
        vm.errorMessage = '';
        vm.counter = redirectDelayInSeconds;

        activate();

        function activate() {
            ApiService.login($stateParams.code)
                .then(function(res) {
                    CredentialService.setToken(res.data.encrypted_token);
                    CredentialService.resetState();
                    $state.go('main.step1');
                },
                function(e) {
                    vm.errorMessage = e.data.error_type + ' : ' + e.data.error;
                    vm.hideLoader = true;

                    interval = $interval(countInterval, 1000);
                });
        }

        function countInterval(){
            if(vm.counter > 1){
                vm.counter--;
            }
            else{
                $interval.cancel(interval);
                interval = undefined;
                $state.go('login');
            }
        }
    }
})();