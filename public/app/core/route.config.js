(function() {
    'use strict';

    angular
        .module('app.core')
        .config(RouteConfig);

    RouteConfig.$inject = ['$stateProvider'];

    function RouteConfig($stateProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'app/login/login.html',
                controller: 'LoginController',
                controllerAs: 'vm',
                data: {
                    title: 'Login',
                    protected: false
                }
            })
            .state('callback', {
                url: '/login/callback?code&state',
                templateUrl: 'app/login/callback/callback.html',
                controller: 'CallbackController',
                controllerAs: 'vm',
                data: {
                    title: 'Callback',
                    protected: false
                }
            })
            .state('main', {
                url: '/main',
                templateUrl: 'app/main//main.html',
                controller: 'MainController',
                controllerAs: 'vm',
                data: {
                    title: 'Main',
                    protected: true
                }
            })
            .state('main.step1', {
                url: '/step1',
                templateUrl: 'app/main/step1/step1.html',
                controller: 'Step1Controller',
                controllerAs: 'vm',
                data: {
                    title: 'Step 1',
                    protected: true
                }
            })
            .state('main.step2', {
                url: '/step2',
                templateUrl: 'app/main/step2/step2.html',
                controller: 'Step2Controller',
                controllerAs: 'vm',
                data: {
                    title: 'Step 2',
                    protected: true
                }
            })
            .state('main.result', {
                url: '/result',
                templateUrl: 'app/main/result/result.html',
                controller: 'ResultController',
                controllerAs: 'vm',
                data: {
                    title: 'Result',
                    protected: true
                }
            })
            .state('main.usage', {
                url: '/usage',
                templateUrl: 'app/main/usage/usage.html',
                controller: 'UsageController',
                controllerAs: 'vm',
                data: {
                    title: 'Usage Statistics',
                    protected: false
                }
            })
            .state('about', {
                url: '/about',
                templateUrl: 'app/about/about.html',
                controller: 'AboutController',
                controllerAs: 'vm',
                data: {
                    title: 'About',
                    protected: false
                }
            });
    }
})();