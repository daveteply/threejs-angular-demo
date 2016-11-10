(function () {

    'use strict';

    angular.module('3js0').component('gameContainer', {
        templateUrl: 'app/components/gameContainer/gameContainer.html',
        controller: function ($window, $document, $element, $timeout, $scope, gameFactory) {

            var ctrl = this;
            var _w = angular.element($window);

            ctrl.size = {};

            ctrl.gameFactory = gameFactory; // for template binding

            var updateClientRect = function () {
                var rect = $element[0].getBoundingClientRect();
                var isFullScreen = ($window.screenfull && $window.screenfull.isFullscreen);
                var height_scale = isFullScreen ? 0.85 : 0.5;
                var width = isFullScreen ? _w[0].innerWidth : rect.width;
                ctrl.size = {
                    width: width,
                    height: _w[0].innerHeight * height_scale
                };

                // resize event occurs outside of Angular
                $scope.$digest();
            };

            ctrl.$onInit = function () {
                // resize event
                _w.bind('resize', updateClientRect);

                // initial size
                ctrl.timer = $timeout(function () {
                    updateClientRect();
                });
            };

            ctrl.$onDestroy = function () {
                ctrl.timer();
            };

            ctrl.startLevel = function () {
                gameFactory.startLevel();
            };

        }
    });

})();