(function () {

    'use strict';

    angular.module('3js0').component('threeCanvas', {
        templateUrl: 'app/components/canvas/3D_canvas.html',
        controller: function ($window, $scope, $document, $element, threeDApiFactory, shapesFactory) {
            var ctrl = this;
            ctrl.fullscreen = false;

            var _w = angular.element($window);
            var _c = $element.find('canvas')[0];

            var HEIGHT_SCALE = 0.5;

            var setCanvasDimensions = function () {
                var windowWidth = _w[0].innerWidth;
                var widthScale = 0.8;
                if (windowWidth < 480) {
                    widthScale = 0.9;
                }
                if (windowWidth > 1224) {
                    widthScale = 0.5;
                }
                if (!ctrl.fullscreen) {
                    ctrl.width = windowWidth * widthScale;
                    ctrl.height = _w[0].innerHeight * HEIGHT_SCALE;
                } else {
                    ctrl.width = windowWidth;
                    ctrl.height = _w[0].innerHeight;
                }
            };

            var handleResizeEvent = function () {
                setCanvasDimensions();
                threeDApiFactory.handleResizeEvent(ctrl.width, ctrl.height);
                $scope.$apply();
            };

            var handleFullscreen = function () {
                ctrl.fullscreen = !ctrl.fullscreen;
            };

            var bindWindowEvents = function () {
                _w.bind('resize', handleResizeEvent);
                _w.bind('fullscreenchange', handleFullscreen);
                _w.bind('webkitfullscreenchange', handleFullscreen);
                _w.bind('mozfullscreenchange', handleFullscreen);
                _w.bind('MSFullscreenChange', handleFullscreen);
            };

            var handleTouchStart = function (event) {
                // calc position in normalized device y
                angular.forEach(event.targetTouches, function (touch) {
                    var x = (touch.pageX / _w[0].innerWidth) * 2 - 1;
                    var y = -(touch.pageY / _w[0].innerHeight) * 2 + 1;
                    var intersects = threeDApiFactory.detectObjectIntersection(x, y);
                    shapesFactory.updateShapeProps(intersects);
                });
            };

            var bindCanvasEvents = function () {
                $element.bind('touchstart', handleTouchStart);
            };

            var initFullscreen = function () {
                ctrl.fullScreenEnabled = (
                    $document[0].fullscreenEnabled ||
                    $document[0].webkitFullscreenEnabled ||
                    $document[0].mozFullScreenEnabled ||
                    $document[0].msFullscreenEnabled);
            };

            ctrl.$onInit = function () {
                bindCanvasEvents();
                bindWindowEvents();
                initFullscreen();

                // setup
                setCanvasDimensions();
                threeDApiFactory.initRenderer(_c, ctrl.width, ctrl.height);
                threeDApiFactory.setUpScene(ctrl.width, ctrl.height);
                var loader = threeDApiFactory.loadTextures();
                loader.manager.onLoad = function () {
                    // build shapes and add them to scene
                    shapesFactory.buildShapes(threeDApiFactory.textures);
                    threeDApiFactory.addShapes(shapesFactory.shapeObjs);

                    // let the show begin!
                    threeDApiFactory.render();
                };
            };

            ctrl.toggleFullscreen = function () {
                if (_c.requestFullscreen) {
                    _c.requestFullscreen();
                } else if (_c.webkitRequestFullscreen) {
                    _c.webkitRequestFullscreen();
                } else if (_c.mozRequestFullScreen) {
                    _c.mozRequestFullScreen();
                } else if (_c.msRequestFullscreen) {
                    _c.msRequestFullscreen();
                }
            };

        }
    });

})();