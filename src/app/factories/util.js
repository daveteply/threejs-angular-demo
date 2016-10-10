(function () {
    'use strict';

    angular.module('3js0').factory('utilFactory', UtilityFactoryFunction);

    /** @ngInject */
    function UtilityFactoryFunction() {
        var svc = this;

        svc.getRandomDecimal = function (min, max) {
            return (Math.random() * (min - max) + max);
        };

        svc.resetLimits = function (shapeObj, xLimit, yLimit, zLimit) {
            if (shapeObj.shape.position.x >= xLimit || shapeObj.shape.position.x <= (-1 * xLimit)) {
                shapeObj.locationVelocity.x *= -1;
            }
            if (shapeObj.shape.position.y >= yLimit || shapeObj.shape.position.y <= (-1 * yLimit)) {
                shapeObj.locationVelocity.y *= -1;
            }
            if (shapeObj.shape.position.z >= zLimit || shapeObj.shape.position.z <= (-1 * zLimit)) {
                shapeObj.locationVelocity.z *= -1;
            }
        };

        return svc;
    }

})();