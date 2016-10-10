(function () {

    'use strict';

    angular.module('3js0').component('threeCanvas', {
        templateUrl: 'app/components/canvas/3D_canvas.html',
        controller: function ($window, $scope, $element, threeDApiFactory, shapesFactory) {
            var ctrl = this;
            var WIDTH_SCALE = 0.8;
            var HEIGHT_SCALE = 0.5;

            ctrl.handleResizeEvent = function () {
                ctrl.setCanvasDimensions();
                threeDApiFactory.handleResizeEvent(ctrl.width, ctrl.height);
                $scope.$apply();
            };

            var w = angular.element($window);
            w.bind('resize', ctrl.handleResizeEvent);

            ctrl.setCanvasDimensions = function () {
                ctrl.height = w[0].innerHeight * HEIGHT_SCALE;
                ctrl.width = w[0].innerWidth * WIDTH_SCALE;
            };

            ctrl.$onInit = function () {
                // setup
                ctrl.setCanvasDimensions();
                threeDApiFactory.initRenderer($element.children()[0], ctrl.width, ctrl.height);
                threeDApiFactory.setUpScene(ctrl.width, ctrl.height);

                // build shapes and add them to scene
                shapesFactory.buildShapes();
                threeDApiFactory.addShapes(shapesFactory.shapeObjs);
                
                // let the show begin!
                threeDApiFactory.render();
            };

        }
    });

})();