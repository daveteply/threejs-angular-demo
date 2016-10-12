(function () {

    'use strict';

    angular.module('3js0').component('threeCanvas', {
        templateUrl: 'app/components/canvas/3D_canvas.html',
        controller: function ($window, $scope, $document, $element, threeDApiFactory, shapesFactory) {
            var ctrl = this;
            ctrl.fullscreen = false;

            var w = angular.element($window);            
            
            var HEIGHT_SCALE = 0.5;

            var setCanvasDimensions = function () {
                var windowWidth = w[0].innerWidth;
                var widthScale = 0.8;
                if (windowWidth < 480) {
                    widthScale = 0.9;
                }
                if (windowWidth > 1224) {
                    widthScale = 0.5;
                }
                if (!ctrl.fullscreen) {
                    ctrl.width = windowWidth * widthScale;
                    ctrl.height = w[0].innerHeight * HEIGHT_SCALE;
                } else {
                    ctrl.width = windowWidth;
                    ctrl.height = w[0].innerHeight;
                }
            };

            var handleResizeEvent = function () {
                setCanvasDimensions();
                threeDApiFactory.handleResizeEvent(ctrl.width, ctrl.height);
                $scope.$apply();
            };

            var handleFullscreen = function() {
                ctrl.fullscreen = !ctrl.fullscreen;
            };

            var bindWindowEvents = function() {
                w.bind('resize', handleResizeEvent);
                w.bind('fullscreenchange', handleFullscreen);
                w.bind('webkitfullscreenchange', handleFullscreen);
                w.bind('mozfullscreenchange', handleFullscreen);
                w.bind('MSFullscreenChange', handleFullscreen);
            };

            var initFullscreen = function() {
                ctrl.fullScreenEnabled = (
                    $document[0].fullscreenEnabled ||
                    $document[0].webkitFullscreenEnabled ||
                    $document[0].mozFullScreenEnabled ||
                    $document[0].msFullscreenEnabled);
            };            

            ctrl.$onInit = function () {
                bindWindowEvents();
                // setup
                setCanvasDimensions();
                var canvas = $element.find('canvas')[0];
                threeDApiFactory.initRenderer(canvas, ctrl.width, ctrl.height);
                threeDApiFactory.setUpScene(ctrl.width, ctrl.height);
                initFullscreen();

                // build shapes and add them to scene
                shapesFactory.buildShapes();
                threeDApiFactory.addShapes(shapesFactory.shapeObjs);
                
                // let the show begin!
                threeDApiFactory.render();
            };

            ctrl.toggleFullscreen = function() {
                var canvas = $element.find('canvas')[0];
                if (canvas.requestFullscreen) {
                    canvas.requestFullscreen();
                } else if (canvas.webkitRequestFullscreen) {
                    canvas.webkitRequestFullscreen();
                } else if (canvas.mozRequestFullScreen) {
                    canvas.mozRequestFullScreen();
                } else if (canvas.msRequestFullscreen) {
                    canvas.msRequestFullscreen();
                }
            };

        }
    });

})();