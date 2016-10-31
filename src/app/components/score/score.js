(function () {

    'use strict';

    angular.module('3js0').component('score', {
        templateUrl: 'app/components/score/score.html',
        controller: function ($scope, gameFactory) {
            var ctrl = this;
            
            ctrl.textRollConfig = {
                filter: 'number'
            };

            ctrl.score = 0;

            gameFactory.scoreChangeCallback = function () {
                ctrl.score = gameFactory.score;
                $scope.$apply();
            };
        }
    });

})();