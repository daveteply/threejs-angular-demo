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

        svc.getShape = function (shapeName, material) {
            if (!material) {
                material = getPhongMaterial(utilFactory.getRandomRBG());
            }
            var geometry;
            switch (shapeName) {

            case 'cube':
                geometry = new three.BoxGeometry(1, 1, 1);
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

            return {
                shape: new three.Mesh(geometry, material),
                rotation: utilFactory.getRandomVector(MIN, MAX, true),
                locationVelocity: utilFactory.getRandomVector(MIN, MAX, true)
            };
        };

        svc.buildShapes = function () {
            for (var i = 0; i < 15; i++) {
                svc.shapeObjs.push(svc.getShape('cube'));
                svc.shapeObjs.push(svc.getShape('torus'));
                svc.shapeObjs.push(svc.getShape('sphere'));
                svc.shapeObjs.push(svc.getShape('cone'));
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