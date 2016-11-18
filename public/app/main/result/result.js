(function () {
    'use strict';

    angular
        .module('app.main.result')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$state', 'ApiService', 'SharedService', 'CredentialService'];
    function ResultController($state, ApiService, SharedService, CredentialService) {
        var vm = this;

        activate();

        function activate() {
            if (!SharedService.verifyStep2()) {
                $state.go('main.step2');
            }

            performAnalysis();
        }

        function performAnalysis() {
            var step1Settings = SharedService.getStep1Settings();
            var step2Settings = SharedService.getStep2Settings();

            var params = {
                encrypted_token: CredentialService.getToken(),
                save_usage_data: step2Settings.shareData.toString(),
                channel: step1Settings.selectedChannelId
            }

            if (step2Settings.dateFrom !== null) {
                params.from_ts = step2Settings.dateFrom;
            }

            if (step2Settings.dateTo !== null) {
                params.to_ts = step2Settings.dateTo;
            }

            ApiService.performAnalysis(params)
                .then(function (res) {
                    console.log(res.data);
                },
                function (e) {
                    console.log(e.data);
                });
        }
    }
})();