(function () {
    'use strict';

    angular
        .module('app.about')
        .controller('AboutController', AboutController);

    function AboutController() {
        var vm = this;

        vm.data = 'Hello';
    }
})();