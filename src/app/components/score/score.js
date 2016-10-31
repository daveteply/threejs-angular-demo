(function () {

    'use strict';

    angular.module('3js0').component('score', {
        templateUrl: 'app/components/score/score.html',
        controller: function ($scope, gameFactory) {
            var ctrl = this;

            ctrl.score = 10;

            gameFactory.scoreChangeCallback = function () {
                ctrl.score = gameFactory.score;
                $scope.$apply();
            };
        }
    });

})();