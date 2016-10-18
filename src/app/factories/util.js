(function () {
    'use strict';

    angular.module('3js0').factory('utilFactory', UtilityFactoryFunction);

    /** @ngInject */
    function UtilityFactoryFunction($window) {
        var svc = this;

        var three = $window.THREE;

        svc.getRandomDecimal = function (min, max) {
            return (Math.random() * (min - max) + max);
        };

        svc.getRandomVector = function (min, max) {
            return new three.Vector3(
                svc.getRandomDecimal(min, max),
                svc.getRandomDecimal(min, max),
                svc.getRandomDecimal(min, max)
            );
        };

        svc.resetLimits = function (shapeObj, xLimit, yLimit, zLimit) {
            if (shapeObj.shape.position.x >= xLimit || shapeObj.shape.position.x <= (-1 * xLimit)) {
                shapeObj.locationVelocity.x *= -1;
            }
            if (shapeObj.shape.position.y >= yLimit || shapeObj.shape.position.y <= (-1 * yLimit)) {
                shapeObj.locationVelocity.y *= -1;
            }
            if (shapeObj.shape.position.z >= -2.0 || shapeObj.shape.position.z <= (-4 * zLimit)) {
                shapeObj.locationVelocity.z *= -1;
            }
        };

        return svc;
    }

})();