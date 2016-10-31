(function () {
    'use strict';

    angular.module('3js0').factory('gameFactory', GameFactoryFunction);

    /** @ngInject */
    function GameFactoryFunction() {
        var svc = this;
        
        svc.scoreChangeCallback;

        svc.score = 0;

        svc.updateScore = function () {
            svc.score += 10;
            if (svc.scoreChangeCallback) {
                svc.scoreChangeCallback();
            }
        };
        return svc;
    }

})();