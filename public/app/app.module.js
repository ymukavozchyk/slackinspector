(function () {
    'use strict';

    angular
        .module('app',
        [
            'app.core',
            'app.login',
            'app.login.callback',
            'app.main',
            'app.main.step1',
            'app.about'
        ]);
})();