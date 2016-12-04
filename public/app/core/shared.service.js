(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SharedService', SharedService);

    function SharedService() {

        var step1Settings = {
            selectedChannelName: undefined,
            selectedChannelId: undefined
        };

        var step2Settings = {
            dateFrom: undefined,
            dateTo: undefined,
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
            if (step1Settings.selectedChannelId !== undefined
                && step1Settings.selectedChannelName !== undefined) {
                return true;
            }
            return false;
        }

        function getStep1Settings() {
            return step1Settings;
        }

        function setStep1Settings(newChannelId, newChannelName) {
            step1Settings.selectedChannelId = newChannelId;
            step1Settings.selectedChannelName = newChannelName;
        }

        function resetStep1() {
            step1Settings.selectedChannelId = undefined;
            step1Settings.selectedChannelName = undefined;
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
            step2Settings.dateFrom = undefined;
            step2Settings.dateTo = undefined;
            step2Settings.shareData = false;
            step2VerificationFlag = false;
        }
    }
})();