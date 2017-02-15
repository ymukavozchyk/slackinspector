(function () {
    'use strict';

    angular
        .module('app')
        .controller('ApplicationController', ApplicationController);

    ApplicationController.$inject = ['$state', '$rootScope', 'CredentialService'];
    function ApplicationController($state, $rootScope, CredentialService) {
        var vm = this;

        activate();

        function activate() {
            console.info('app - activate - token present:' + CredentialService.isTokenPresent());
            if (!CredentialService.isTokenPresent()) {
                $state.go('main.login');
            }
            else {
                $state.go('main.step1');
            }
        }

        function preventAndGo(stateName, event) {
            event.preventDefault();
            $state.go(stateName);
        }

        function checkProtectedRoutes(toState, event) {
            if (toState.data.protected) {
                console.info('app - protected route - token present:' + CredentialService.isTokenPresent());
                if (!CredentialService.isTokenPresent()) {
                    preventAndGo('main.login', event);
                }
            }
        }

        function checkSpecificRoutes(toState, event) {
            if (toState.name === 'main.login' && CredentialService.isTokenPresent()) {
                preventAndGo('main.step1', event);
            }

            if (toState.name === 'main') {
                preventAndGo('main.step1', event);
            }
        }

        function checkCallbackRoute(toState, toParams, event) {
            if (toState.name === 'main.callback') {
                var redirectFlag = false;

                if (CredentialService.isTokenPresent()) {
                    console.info('callback route check - istokenpresent fired');
                    redirectFlag = true;
                }
                else if (toParams.code === undefined || toParams.state === undefined) {
                    console.info('callback route check - code:' + toParams.code + ' state:' + toParams.state);
                    redirectFlag = true;
                }
                else if (!CredentialService.isStatePresent()) {
                    console.info('callback route check - state is not present');
                    redirectFlag = true;
                }
                else if (toParams.state !== CredentialService.getState()) {
                    console.info('callback route check - state does not match');
                    redirectFlag = true;
                }

                if (redirectFlag) {
                    preventAndGo('main.step1', event);
                }
            }
        }

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
            checkProtectedRoutes(toState, event);
            checkSpecificRoutes(toState, event);
            checkCallbackRoute(toState, toParams, event);
        });

        $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
            $rootScope.pageTitle = toState.data.title;
        });
    }
})();