'use strict';

var mask = ['.', ';', '!', '?'];

module.exports = {
    getSuffix: function(message){
        if(message !== ''){
            if(mask.includes(message.slice(-1))){
                return '';
            }
            return '.';
        }
        return '';
    }
};