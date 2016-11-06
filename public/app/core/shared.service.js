(function () {
    'use strict';

    angular
        .module('app.core')
        .service('SharedService', SharedService);

    function SharedService() {

        var selectedChannel = null;

        var service = {
            verifyStep1: verifyStep1,
            getSelectedChannel: getSelectedChannel,
            setSelectedChannel: setSelectedChannel,
            resetStep1: resetStep1
        };

        return service;

        function verifyStep1() {
            if (selectedChannel !== null) {
                return true;
            }
            return false;
        }

        function getSelectedChannel() {
            return selectedChannel;
        }

        function setSelectedChannel(newChannel) {
            selectedChannel = newChannel;
        }

        function resetStep1() {
            selectedChannel = null;
        }
    }
})();