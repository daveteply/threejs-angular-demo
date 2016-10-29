(function () {
    'use strict';

    angular.module('3js0').factory('shapesFactory', ShapesFactoryFunction);

    /** @ngInject */
    function ShapesFactoryFunction($window, utilFactory) {
        var svc = this;

        var three = $window.THREE;

        svc.shapeObjs = [];

        svc.getShape = function (shapeName, textureMaterial) {
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

            default:
                geometry = new three.BoxGeometry(1, 1, 1);
            }

            var targetShape = new three.Mesh(geometry, textureMaterial);
            var startPosition = utilFactory.getRandomVector(-1.0, 1.0);
            if (startPosition.z < 0) {
                startPosition.z = 0;
            }
            targetShape.position.x = startPosition.x;
            targetShape.position.y = startPosition.y;
            targetShape.position.z = startPosition.z;
            targetShape.castShadow = true;

            return {
                shape: targetShape,
                rotation: utilFactory.getRandomVector(0.01, 0.025),
                locationVelocity: utilFactory.getRandomVector(-0.025, 0.025)
            };
        };

        svc.buildShapes = function (textures) {
            for (var i = 0; i < 1; i++) {
                //var rndTextureIndex = utilFactory.getRandomInt(0, textures.length);
                svc.shapeObjs.push(svc.getShape('cube', textures[0]));
                svc.shapeObjs.push(svc.getShape('torus'));
                svc.shapeObjs.push(svc.getShape('sphere', textures[1]));
                svc.shapeObjs.push(svc.getShape('cone'));
            }
        };

        svc.updatePos = function () {
            angular.forEach(svc.shapeObjs, function (shapeObj) {
                shapeObj.shape.rotation.x += shapeObj.rotation.x;
                shapeObj.shape.rotation.y += shapeObj.rotation.y;
                shapeObj.shape.rotation.z += shapeObj.rotation.z;
                shapeObj.shape.position.x += shapeObj.locationVelocity.x;
                shapeObj.shape.position.y += shapeObj.locationVelocity.y;
                shapeObj.shape.position.z += shapeObj.locationVelocity.z;
                utilFactory.resetLimits(shapeObj, 1.5, 1.5);
            });
        };

        svc.updateShapeProps = function (intersects) {
            if (intersects.length > 0) {
                intersects[0].object.material.wireframe
                    = !intersects[0].object.material.wireframe;
            }
        };

        return svc;
    }

})();