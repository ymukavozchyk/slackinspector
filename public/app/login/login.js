(function() {
    'use strict';

    angular
        .module('app.login')
        .controller('LoginController', LoginController);

    LoginController.$inject = ['CredentialService'];
    function LoginController(CredentialService) {
        var vm = this;

        vm.loginHref = 'https://slack.com/oauth/authorize'
            + '?scope=channels:read,channels:history'
            + '&client_id=74645913811.92497918727'
            + '&state=';

        activate();

        function activate() {
            vm.loginHref += CredentialService.getState();
        }
    }
})();