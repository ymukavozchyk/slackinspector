(function () {
    'use strict';

    angular
        .module('app',
        [
            'app.core',
            'app.login',
            'app.login.callback',
            'app.main',
            'app.main.logout',
            'app.main.step1',
            'app.main.step2',
            'app.main.result',
            'app.main.usage',
            'app.about'
        ]);
})();