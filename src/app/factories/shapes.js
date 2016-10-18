(function () {
    'use strict';

    angular.module('3js0').factory('shapesFactory', ShapesFactoryFunction);

    /** @ngInject */
    function ShapesFactoryFunction($window, utilFactory) {
        var svc = this;

        var three = $window.THREE;
        var MIN = 0.01;
        var MAX = 0.025;

        svc.shapeObjs = [];

        var getPhongMaterial = function (color) {
            return new three.MeshPhongMaterial({
                color: color ? color : 0xffffff,
                specular: 0x555555,
                shininess: 30
            });
        };

        svc.getShape = function (shapeName, startPosition) {
            var material = getPhongMaterial(utilFactory.getRandomRBG());
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

            var targetShape = new three.Mesh(geometry, material);
            targetShape.position.x = startPosition.x;
            targetShape.position.y = startPosition.y;
            targetShape.position.z = startPosition.z;
            targetShape.castShadow = true;

            return {
                shape: targetShape,
                rotation: utilFactory.getRandomVector(MIN, MAX, true),
                locationVelocity: utilFactory.getRandomVector(MIN, MAX, true)
            };
        };

        svc.buildShapes = function () {
            for (var i = 0; i < 10; i++) {
                svc.shapeObjs.push(svc.getShape('cube', utilFactory.getRandomVector(-2.0, 2.0, true)));
                svc.shapeObjs.push(svc.getShape('torus', utilFactory.getRandomVector(-2.0, 2.0, true)));
                svc.shapeObjs.push(svc.getShape('sphere', utilFactory.getRandomVector(-2.0, 2.0, true)));
                svc.shapeObjs.push(svc.getShape('cone', utilFactory.getRandomVector(-2.0, 2.0, true)));
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
                utilFactory.resetLimits(shapeObj, 2.0, 2.0, 1.0);
            });
        };

        svc.updateShapeProps = function (intersects) {
            angular.forEach(intersects, function (intersect) {
                intersect.object.material.wireframe = true;
                intersect.object.material.emissive.setHex(0xff0000);
            });
        };

        return svc;
    }

})();