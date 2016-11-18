(function () {
    'use strict';

    angular
        .module('app.main.result')
        .controller('ResultController', ResultController);

    ResultController.$inject = ['$state', 'SharedService'];
    function ResultController($state, SharedService) {
        var vm = this;

        activate();

        function activate() {
            console.log('test');
        }
    }
})();