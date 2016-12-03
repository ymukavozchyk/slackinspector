(function () {
    'use strict';

    angular
        .module('app',
        [
            'app.core',
            'app.main',
            'app.main.login',
            'app.main.login.callback',
            'app.main.logout',
            'app.main.step1',
            'app.main.step2',
            'app.main.result',
            'app.main.usage',
            'app.main.about'
        ]);
})();