(function () {
    'use strict';

    angular.module('3js0').factory('gameFactory', GameFactoryFunction);

    /** @ngInject */
    function GameFactoryFunction(audioFactory) {
        var svc = this;

        svc.scoreChangeCallback;

        svc.isScoring = false;
        svc.score = 0;
        svc.level = 0;
        svc.levelButtonText = "Start a new Game!";

        svc.timemark = {}; // new Date();

        svc.startLevel = function () {
            audioFactory.playNextMusicTrack();
            svc.startLevelTimemark = new Date();
            svc.timemark = new Date();
            svc.isScoring = true;
            svc.level++;
            svc.levelButtonText = "Start Next Level";
        };

        svc.updateScore = function () {
            audioFactory.playHit();
            var timeDiff = Math.abs(svc.timemark.getTime() - new Date().getTime());
            // more points for shorter time since previous score
            svc.score += Math.round((1 / timeDiff) * 1000000);
            if (svc.scoreChangeCallback) {
                svc.scoreChangeCallback();
            }
            svc.timemark = new Date();
        };

        svc.endLevel = function () {
            audioFactory.playNextEndLevelMusic();
            svc.isScoring = false;
            var totalSeconds = Math.abs(svc.startLevelTimemark.getTime() - new Date().getTime()) / 1000;
            var startCnt = Math.ceil((svc.level / totalSeconds) * 10);
            if (startCnt < 1) {
                startCnt = 1;
            }
            svc.starRating = [];
            for (var i = 0; i < startCnt; i++) {
                svc.starRating.push(0);
            }
        };

        svc.getNextShapeCount = function () {
            return Math.ceil(svc.level * 3.3);
        };

        return svc;
    }

})();