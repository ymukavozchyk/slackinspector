'use strict';

var mask = ['.', ';', '!', '?'];

module.exports = {
    getSuffix: function (message) {
        if (message !== '') {
            var lastCharacter = message.slice(-1);
            if (mask.indexOf(lastCharacter) >= 0) {
                return '';
            }
            return '.';
        }
        return '';
    }
};