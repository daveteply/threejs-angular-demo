(function () {
    'use strict';

    angular.module('3js0').factory('shapesFactory', ShapesFactoryFunction);

    /** @ngInject */
    function ShapesFactoryFunction($window, utilFactory, gameFactory) {
        var svc = this;

        var three = $window.THREE;

        svc.shapeObjs = [];
        svc.removeShapeCallback;

        svc.getShape = function (shapeName, id, textureMaterial) {
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
            //targetShape.castShadow = true;

            return {
                shape: targetShape,
                rotation: utilFactory.getRandomVector(0.01, 0.025),
                locationVelocity: utilFactory.getRandomVector(-0.025, 0.025)
            };
        };

        svc.buildShapes = function (textures) {
            for (var i = 0; i < 16; i++) {
                var rndTextureIndex = utilFactory.getRandomInt(0, textures.length);
                var material = textures[rndTextureIndex].clone();
                switch (utilFactory.getRandomInt(0, 4)) {
                case 0:
                    svc.shapeObjs.push(svc.getShape('cube', i, material));
                    break;
                case 1:
                    svc.shapeObjs.push(svc.getShape('sphere', i, material));
                    break;
                case 2:
                    svc.shapeObjs.push(svc.getShape('torus', i, material));
                    break;
                case 3:
                    svc.shapeObjs.push(svc.getShape('cone', i, material));
                    break;
                }
            }
        };

        svc.updatePos = function () {
            angular.forEach(svc.shapeObjs, function (shapeObj) {
                if (!shapeObj.done) {
                    if (!shapeObj.hit) {
                        shapeObj.shape.material.color = new three.Color(0xffffff);
                        shapeObj.shape.rotation.x += shapeObj.rotation.x;
                        shapeObj.shape.rotation.y += shapeObj.rotation.y;
                        shapeObj.shape.rotation.z += shapeObj.rotation.z;
                        shapeObj.shape.position.x += shapeObj.locationVelocity.x;
                        shapeObj.shape.position.y += shapeObj.locationVelocity.y;
                        shapeObj.shape.position.z += shapeObj.locationVelocity.z;
                        utilFactory.resetLimits(shapeObj, 1.5, 1.5);
                    } else {
                        shapeObj.shape.scale.x += 0.02;
                        shapeObj.shape.scale.y += 0.02;
                        shapeObj.shape.scale.z += 0.02;
                        shapeObj.shape.material.color.r -= 0.02;
                        shapeObj.shape.material.color.g -= 0.02;
                        shapeObj.shape.material.color.b -= 0.02;
                        if (shapeObj.shape.material.color.r < 0.0) {
                            // registered in threeDApiFactory
                            if (svc.removeShapeCallback) {
                                // remove from scene
                                svc.removeShapeCallback(shapeObj.shape);
                                // remove from updating
                                shapeObj.done = true;
                                // score
                                gameFactory.updateScore();
                            }
                        }
                    }
                }
            });
        };

        svc.updateShapeProps = function (intersects) {
            if (intersects.length > 0) {
                var targetShape = svc.shapeObjs.find(function (shape) {
                    return shape.shape.geometry.name == intersects[0].object.geometry.name;
                });
                if (targetShape) {
                    targetShape.hit = !targetShape.hit;
                }
            }
        };

        return svc;
    }

})();