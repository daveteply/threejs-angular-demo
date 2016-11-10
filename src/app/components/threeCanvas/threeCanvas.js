(function () {

    'use strict';

    angular.module('3js0').component('threeCanvas', {
        bindings: {
            parentSize: '<',
            gameLevel: '<'
        },
        templateUrl: 'app/components/threeCanvas/threeCanvas.html',
        controller: function ($window, $element, threeDApiFactory, shapesFactory, gameFactory) {
            var ctrl = this;

            var _c = $element.find('canvas')[0];

            var setCanvasDimensions = function () {
                ctrl.width = ctrl.parentSize.width;
                ctrl.height = ctrl.parentSize.height;
            };

            var handleResizeEvent = function () {
                setCanvasDimensions();
                threeDApiFactory.handleResizeEvent(ctrl.width, ctrl.height);
            };

            ctrl.handleClick = function (event) {
                if (gameFactory.isScoring) {
                    var rect = _c.getBoundingClientRect();
                    var x, y, actualX, actualY;
                    if (event.targetTouches && event.targetTouches.length > 0) {
                        actualX = event.targetTouches[0].clientX - rect.left;
                        actualY = event.targetTouches[0].clientY - rect.top;
                    } else {
                        actualX = event.clientX - rect.left;
                        actualY = event.clientY - rect.top;
                    }
                    x = (actualX / rect.width) * 2 - 1;
                    y = -(actualY / rect.height) * 2 + 1;
                    var intersects = threeDApiFactory.detectObjectIntersection(x, y);
                    shapesFactory.updateShapeProps(intersects);
                }
            };

            var startNewLevel = function () {
                // clear shapes (only for initial level)
                var shapes = shapesFactory.get();
                threeDApiFactory.removeAllShapes(shapes);
                
                // add shapes for new level
                var shapeCnt = Math.ceil(gameFactory.level * 3.3);
                var newShapes = shapesFactory.buildShapes(shapeCnt, threeDApiFactory.textures);
                threeDApiFactory.addShapes(newShapes);
            };

            ctrl.$onInit = function () {
                // setup
                setCanvasDimensions();
                threeDApiFactory.initRenderer(_c, ctrl.width, ctrl.height);
                threeDApiFactory.setUpScene(ctrl.width, ctrl.height);
                var loader = threeDApiFactory.loadTextures();
                loader.manager.onLoad = function () {
                    // textures are finished loading,
                    //  build shapes and add them to scene
                    var shapes = shapesFactory.buildShapes(8, threeDApiFactory.textures);
                    threeDApiFactory.addShapes(shapes);

                    // let the show begin!
                    threeDApiFactory.render();
                };
            };

            ctrl.$onChanges = function (changesObj) {
                if (changesObj.parentSize && !changesObj.parentSize.isFirstChange()) {
                    handleResizeEvent();
                }
                if (changesObj.gameLevel && !changesObj.gameLevel.isFirstChange()) {
                    startNewLevel();
                }
            };

        }
    });

})();