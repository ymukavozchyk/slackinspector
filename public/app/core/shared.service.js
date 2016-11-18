(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SharedService', SharedService);

    function SharedService() {

        var step1Settings = {
            selectedChannelId: null
        };

        var step2Settings = {
            dateFrom: null,
            dateTo: null,
            shareData: false
        };

        var step2VerificationFlag = false;

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
            if (step1Settings.selectedChannelId !== null) {
                return true;
            }
            return false;
        }

        function getStep1Settings() {
            return step1Settings;
        }

        function setStep1Settings(newChannelId) {
            step1Settings.selectedChannelId = newChannelId;
        }

        function resetStep1() {
            step1Settings.selectedChannelId = null;
        }

        function verifyStep2() {
            if (step2VerificationFlag) {
                return true;
            }
            return false;
        }

        function getStep2Settings() {
            return step2Settings;
        }

        function setStep2Settings(newDateFrom, newDateTo, newShareDataFlag) {
            step2Settings.dateFrom = newDateFrom;
            step2Settings.dateTo = newDateTo;
            step2Settings.shareData = newShareDataFlag;
            step2VerificationFlag = true;
        }

        function resetStep2() {
            step2Settings.dateFrom = null;
            step2Settings.dateTo = null;
            step2Settings.shareData = false;
            step2VerificationFlag = false;
        }
    }
})();