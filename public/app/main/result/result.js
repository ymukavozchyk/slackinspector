(function () {
    'use strict';

    angular
        .module('app.main.result')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$mdDialog', '$state', 'ApiService', 'SharedService', 'CredentialService'];
    function ResultController($mdDialog, $state, ApiService, SharedService, CredentialService) {
        var vm = this;

        var step1Settings;
        var step2Settings;

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        vm.selectedChannel = '';
        vm.analysisOptions = 'All messages';
        vm.messageCount = 0;

        vm.languageTones = [];
        vm.emotionTones = [];
        vm.socialTones = [];

        activate();

        function activate() {
            if (!SharedService.verifyStep1()) {
                $state.go('main.step1');
            }
            else if (!SharedService.verifyStep2()) {
                $state.go('main.step2');
            }
            else {
                step1Settings = SharedService.getStep1Settings();
                step2Settings = SharedService.getStep2Settings();

                vm.selectedChannel = step1Settings.selectedChannelName;

                var dateFormatter = new Date(0);

                if (step2Settings.dateFrom !== null && step2Settings.dateTo !== null) {
                    dateFormatter.setUTCSeconds(step2Settings.dateFrom);
                    var dateFromFormatted = dateFormatter.toLocaleDateString();

                    dateFormatter = new Date(0);
                    dateFormatter.setUTCSeconds(step2Settings.dateTo);
                    var dateToFormatted = dateFormatter.toLocaleDateString();

                    vm.analysisOptions = 'Messages from ' + dateFromFormatted + ' to ' + dateToFormatted;
                }
                else if (step2Settings.dateFrom !== null && step2Settings.dateTo === null) {
                    dateFormatter.setUTCSeconds(step2Settings.dateFrom);
                    var dateFromFormatted = dateFormatter.toLocaleDateString();
                    vm.analysisOptions = 'Messages from ' + dateFromFormatted;
                }
                else if(step2Settings.dateFrom === null && step2Settings.dateTo !== null) {
                    dateFormatter = new Date(0);
                    dateFormatter.setUTCSeconds(step2Settings.dateTo);
                    var dateToFormatted = dateFormatter.toLocaleDateString();
                    vm.analysisOptions = 'Messages up to ' + dateToFormatted;
                }

                performAnalysis();
            }
        }

        function performAnalysis() {
            var params = {
                encrypted_token: CredentialService.getToken(),
                save_usage_data: step2Settings.shareData.toString(),
                channel: step1Settings.selectedChannelId
            };

            if (step2Settings.dateFrom !== null) {
                params.from_ts = step2Settings.dateFrom;
            }

            if (step2Settings.dateTo !== null) {
                params.to_ts = step2Settings.dateTo;
            }

            ApiService.performAnalysis(params)
                .then(function (res) {
                    vm.messageCount = res.data.message_count;
                    var processingErrorFlag = false;

                    res.data.tone.document_tone.tone_categories.forEach(function (toneSection) {
                        toneSection.tones.forEach(function (tone) {
                            var score = tone.score;
                            if (score > 1) {
                                score = 1;
                            }
                            score = score.toFixed(2);

                            var toneObj = {
                                name: tone.tone_name,
                                score: score,
                                style: { width: (score * 100) + '%' }
                            };

                            switch (toneSection.category_id) {
                                case 'language_tone':
                                    vm.languageTones.push(toneObj);
                                    break;
                                case 'emotion_tone':
                                    vm.emotionTones.push(toneObj);
                                    break;
                                case 'social_tone':
                                    vm.socialTones.push(toneObj);
                                    break;
                                default:
                                    processingErrorFlag = true;
                            }
                        });
                    });

                    if (processingErrorFlag === true) {
                        formErrorMessage('client', 'Was not able to parse tone analysis data');
                    }
                    else {
                        vm.hideLoader = true;
                    }
                },
                function (e) {
                    formErrorMessage(e.data.error_type, e.data.error);
                });
        }

        function formErrorMessage(errorType, errorMessage) {
            vm.errorType = errorType;
            vm.errorMessage = errorMessage;
            vm.hideLoader = true;
            vm.showError = true;
            vm.showErrorDialog();
        }

        vm.showErrorDialog = function () {
            var errorTitle = vm.errorType + ' error';
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

        vm.goToStep2 = function () {
            $state.go('main.step2');
        };
    }
})();