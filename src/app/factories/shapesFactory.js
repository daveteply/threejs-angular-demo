(function () {
    'use strict';

    angular.module('3js0').factory('shapesFactory', ShapesFactoryFunction);

    /** @ngInject */
    function ShapesFactoryFunction($window, utilFactory, gameFactory) {
        var svc = this;

        var three = $window.THREE;

        var shapeObjs = [];
        svc.removeShapeCallback;

        var getShape = function (shapeName, scale, id, textureMaterial) {
            var geometry;
            switch (shapeName) {

            case 'cube':
                geometry = new three.BoxGeometry(0.5, 0.5, 0.5);
                break;

            case 'sphere':
                geometry = new three.SphereGeometry(0.25, 32, 24);
                break;

            case 'torus':
                geometry = new three.TorusGeometry(0.25, 0.1, 32, 24);
                break;

            case 'cone':
                geometry = new three.ConeGeometry(0.3, 0.5, 24);
                break;
            }

            geometry.name = shapeName + id;

            var targetShape = new three.Mesh(geometry, textureMaterial);
            var startPosition = utilFactory.getRandomVector(-1.5, 1.5);
            if (startPosition.z < 0) {
                startPosition.z = 0;
            }
            targetShape.position.x = startPosition.x;
            targetShape.position.y = startPosition.y;
            targetShape.position.z = startPosition.z;
            targetShape.scale.multiplyScalar(scale);
            //targetShape.castShadow = true;

            return {
                shape: targetShape,
                rotation: utilFactory.getRandomVector(0.01, 0.025),
                locationVelocity: utilFactory.getRandomVector(-0.025, 0.025)
            };
        };

        svc.buildShapes = function (count, scale, textures) {
            shapeObjs = []; // clear existing shapes
            for (var i = 0; i < count; i++) {
                var rndTextureIndex = utilFactory.getRandomInt(0, textures.length);
                var material = textures[rndTextureIndex].clone();
                switch (utilFactory.getRandomInt(0, 4)) {
                case 0:
                    shapeObjs.push(getShape('cube', scale, i, material));
                    break;
                case 1:
                    shapeObjs.push(getShape('sphere', scale, i, material));
                    break;
                case 2:
                    shapeObjs.push(getShape('torus', scale, i, material));
                    break;
                case 3:
                    shapeObjs.push(getShape('cone', scale, i, material));
                    break;
                }
            }
            return shapeObjs;
        };

        svc.clearShapes = function () {
            shapeObjs = [];
        };

        svc.get = function () {
            return shapeObjs;
        };

        var removeShape = function (shape) {
            var inx = shapeObjs.indexOf(shape);
            if (inx != -1) {
                shapeObjs.splice(inx, 1);
            }
            if (shapeObjs.length == 0) {
                gameFactory.endLevel();
            }
        };

        svc.updatePos = function () {
            angular.forEach(shapeObjs, function (shapeObj) {
                if (!shapeObj.hit) {
                    if (shapeObj.shape.material.opacity < 1.0) {
                        shapeObj.shape.material.opacity += 0.03;
                    }
                    shapeObj.shape.rotation.x += shapeObj.rotation.x;
                    shapeObj.shape.rotation.y += shapeObj.rotation.y;
                    shapeObj.shape.rotation.z += shapeObj.rotation.z;
                    shapeObj.shape.position.x += shapeObj.locationVelocity.x;
                    shapeObj.shape.position.y += shapeObj.locationVelocity.y;
                    shapeObj.shape.position.z += shapeObj.locationVelocity.z;
                    utilFactory.resetLimits(shapeObj, 1.5, 1.5);
                } else {
                    shapeObj.shape.scale.multiplyScalar(1.09);
                    shapeObj.shape.material.opacity -= 0.02;
                    if (shapeObj.shape.material.opacity < 0.0) {
                        // registered in threeDApiFactory
                        if (svc.removeShapeCallback) {
                            // score
                            gameFactory.updateScore();
                            // remove from scene
                            svc.removeShapeCallback(shapeObj.shape);
                            // remove from list
                            removeShape(shapeObj);
                        }
                    }
                }
            });
        };

        svc.updateShapeProps = function (intersects) {
            if (intersects.length > 0) {
                var targetShape = shapeObjs.find(function (shape) {
                    return shape.shape.geometry.name == intersects[0].object.geometry.name;
                });
                if (targetShape) {
                    targetShape.hit = true;
                }
            }
        };

        return svc;
    }

})();