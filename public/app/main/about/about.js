(function () {
    'use strict';

    angular
        .module('app.main.about')
        .controller('AboutController', AboutController);

    function AboutController() {
        var vm = this;

        vm.data = 'Hello';
    }
})();