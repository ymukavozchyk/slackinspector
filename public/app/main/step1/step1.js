(function () {
    'use strict';

    angular
        .module('app.main.step1')
        .controller('Step1Controller', Step1Controller);

    function Step1Controller() {
        var vm = this;

        console.log('step1');
    }
})();