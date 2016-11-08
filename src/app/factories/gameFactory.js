(function () {
    'use strict';

    angular.module('3js0').factory('gameFactory', GameFactoryFunction);

    /** @ngInject */
    function GameFactoryFunction() {
        var svc = this;

        svc.scoreChangeCallback;

        svc.score = 0;
        svc.timemark = new Date();

        svc.updateScore = function () {
            var timeDiff = Math.abs(svc.timemark.getTime() - new Date().getTime());
            // more points for shorter time since previous score
            svc.score += Math.round((1 / timeDiff) * 1000000);
            if (svc.scoreChangeCallback) {
                svc.scoreChangeCallback();
            }
            svc.timemark = new Date();
        };
        return svc;
    }

})();