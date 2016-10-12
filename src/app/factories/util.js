(function () {
    'use strict';

    angular.module('3js0').factory('utilFactory', UtilityFactoryFunction);

    /** @ngInject */
    function UtilityFactoryFunction($window) {
        var svc = this;

        svc.getRandomRBG = function () {
            if ($window.RColor) {
                var color = new $window.RColor;
                return color.get(true);
            }
        };

        svc.getRandomDecimal = function (min, max, includeNegative) {
            var randDecimal = (Math.random() * (min - max) + max);
            var midPoint = max - min;
            if (includeNegative && randDecimal < midPoint) {
                randDecimal *= -1;
            }
            return randDecimal;
        };

        svc.getRandomVector = function (min, max, includeNegative) {
            return {
                x: svc.getRandomDecimal(min, max, includeNegative),
                y: svc.getRandomDecimal(min, max, includeNegative),
                z: svc.getRandomDecimal(min, max, includeNegative)
            };
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