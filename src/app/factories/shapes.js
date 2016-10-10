(function () {
    'use strict';

    angular.module('3js0').factory('shapesFactory', ShapesFactoryFunction);

    /** @ngInject */
    function ShapesFactoryFunction($window, utilFactory) {
        var svc = this;

        var three = $window.THREE;
        var MIN = 0.01;
        var MAX = 0.05;

        svc.shapeObjs = [];

        var getDefaultMaterial = function () {
            return new three.MeshPhongMaterial({
                color: 0xffffff,
                specular: 0x555555,
                shininess: 30
            });
        };

        var getRandomVector = function () {
            return {
                x: utilFactory.getRandomDecimal(MIN, MAX),
                y: utilFactory.getRandomDecimal(MIN, MAX),
                z: utilFactory.getRandomDecimal(MIN, MAX)
            };
        };

        svc.getCube = function (material) {
            if (!material) {
                material = getDefaultMaterial();
            }
            var geometry = new three.BoxGeometry(1, 1, 1);
            return {
                shape: new three.Mesh(geometry, material),
                rotation: getRandomVector(),
                locationVelocity: getRandomVector()
            };
        };

        svc.getTorus = function (material) {
            if (!material) {
                material = getDefaultMaterial();
            }
            var geometry = new three.TorusGeometry(0.25, 0.1, 32, 24);
            return {
                shape: new three.Mesh(geometry, material),
                rotation: getRandomVector(),
                locationVelocity: getRandomVector()
            }
        };

        svc.getSphere = function (material) {
            if (!material) {
                material = getDefaultMaterial();
            }
            var geometry = new three.SphereGeometry(0.25, 32, 24);
            return {
                shape: new three.Mesh(geometry, material),
                rotation: getRandomVector(),
                locationVelocity: getRandomVector()
            }
        };

        svc.getCone = function (material) {
            if (!material) {
                material = getDefaultMaterial();
            }
            var geometry = new three.ConeGeometry(0.3, 0.5, 24);
            return {
                shape: new three.Mesh(geometry, material),
                rotation: getRandomVector(),
                locationVelocity: getRandomVector()
            }
        };

        svc.buildShapes = function () {
            for (var i = 0; i < 5; i++) {
                svc.shapeObjs.push(svc.getCube());
                svc.shapeObjs.push(svc.getTorus());
                svc.shapeObjs.push(svc.getSphere());
                svc.shapeObjs.push(svc.getCone());
            }
        };

        svc.updatePos = function () {
            angular.forEach(svc.shapeObjs, function (shapeObj) {
                if (shapeObj.shape.rotation) { // ensure it's a THREE shape

                    shapeObj.shape.rotation.x += shapeObj.rotation.x;
                    shapeObj.shape.rotation.y += shapeObj.rotation.y;
                    shapeObj.shape.rotation.z += shapeObj.rotation.z;

                    shapeObj.shape.position.x += shapeObj.locationVelocity.x;
                    shapeObj.shape.position.y += shapeObj.locationVelocity.y;
                    shapeObj.shape.position.z += shapeObj.locationVelocity.z;

                    utilFactory.resetLimits(shapeObj, 2.0, 2.0, 2.0);
                }
            });
        };

        return svc;
    }

})();