(function () {
    'use strict';

    angular
        .module('app.main.average')
        .controller('AverageController', AverageController);

    AverageController.$inject = ['$mdDialog', 'ApiService'];
    function AverageController($mdDialog, ApiService) {
        var vm = this;

        vm.hideLoader = false;
        vm.showError = false;
        vm.errorType = '';
        vm.errorMessage = '';

        vm.languageTones = [];
        vm.emotionTones = [];
        vm.socialTones = [];

        getUsageStatistics();

        function getUsageStatistics() {
            ApiService.getUsageStatistics()
                .then(function (res) {
                    var processingErrorFlag = false;

                    res.data.result.forEach(function (toneSection) {
                        toneSection.tones.forEach(function (tone) {
                            var score = tone.average_value;
                            if (score > 1) {
                                score = 1;
                            }
                            score = score.toFixed(2);

                            var toneObj = {
                                name: tone.tone_name,
                                score: score,
                                style: { width: (score * 100) + '%' }
                            };

                            switch (toneSection._id.category_id) {
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
                        formErrorMessage('Client', 'Was not able to parse usage statistics');
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
            var errorTitle = 'Error from ' + vm.errorType;
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

        vm.tryAgain = function () {
            vm.hideLoader = false;
            vm.showError = false;
            vm.errorType = '';
            vm.errorMessage = '';

            getUsageStatistics();
        };
    }
})();