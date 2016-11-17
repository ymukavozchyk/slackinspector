(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SharedService', SharedService);

    function SharedService() {

        var step1Settings = {
            selectedChannel: null
        };

        var step2Settings = {
            selectedMode: null,
            dateFrom: null,
            dateTo: null
        };

        var service = {
            verifyStep1: verifyStep1,
            getStep1Settings: getStep1Settings,
            setStep1Settings: setStep1Settings,
            resetStep1: resetStep1,

            verifyStep2: verifyStep2,
            getStep2Settings: getStep2Settings,
            setStep2Settings: setStep2Settings,
            resetStep2: resetStep2
        };

        return service;

        function verifyStep1() {
            if (step1Settings.selectedChannel !== null) {
                return true;
            }
            return false;
        }

        function getStep1Settings() {
            return step1Settings;
        }

        function setStep1Settings(newChannel) {
            step1Settings.selectedChannel = newChannel;
        }

        function resetStep1() {
            step1Settings.selectedChannel = null;
        }

        function verifyStep2() {
            if (step2Settings.selectedMode !== null) {
                if (step2Settings.selectedMode === 'range') {
                    if (step2Settings.dateFrom !== null || step2Settings.dateTo !== null) {
                        return true;
                    }
                }
                else {
                    return true;
                }
            }
            return false;
        }

        function getStep2Settings() {
            return step2Settings;
        }

        function setStep2Settings(newSelectedMode, newDateFrom, newDateTo) {
            step2Settings.selectedMode = newSelectedMode;
            step2Settings.dateFrom = newDateFrom;
            step2Settings.dateTo = newDateTo;
        }

        function resetStep2() {
            step2Settings.selectedMode = null;
            step2Settings.dateFrom = null;
            step2Settings.dateTo = null;
        }
    }
})();