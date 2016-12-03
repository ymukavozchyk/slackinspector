(function () {
    'use strict';

    angular
        .module('app')
        .config(AppConfig);

    AppConfig.$inject = ['$mdIconProvider'];

    function AppConfig($mdIconProvider) {
        $mdIconProvider
            .icon('warning', './assets/images/svg/warning.svg', 24)
            .icon('menu', './assets/images/svg/menu.svg', 24)
            .icon('logout', './assets/images/svg/logout.svg', 24);
    }
})();