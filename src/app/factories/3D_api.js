(function () {
    'use strict';

    angular.module('3js0').factory('threeDApiFactory', threeDApi);

    /** @ngInject */
    function threeDApi($window, $document, shapesFactory) {
        var svc = this;

        if ($window.THREE) {

            var three = $window.THREE;

            svc.initRenderer = function (canvas, width, height) {
                svc.renderer = new three.WebGLRenderer({
                    canvas: canvas
                });
                svc.renderer.setSize(width, height);
            };

            svc.handleResizeEvent = function (width, height) {
                svc.renderer.setSize(width, height);
                svc.camera.aspect = width / height;
                svc.camera.updateProjectionMatrix();
            };

            svc.setUpScene = function (width, height) {

                // scene
                svc.scene = new three.Scene();

                // lights
                var dirLight = new three.DirectionalLight(0xffffff, 1);
                dirLight.position.set(100, 100, 50);
                svc.scene.add(dirLight);

                var ambLight = new three.AmbientLight(0x404040);
                svc.scene.add(ambLight);

                // camera
                svc.camera = new three.PerspectiveCamera(45, width / height, 0.1, 100);
                svc.camera.position.z = 3;
            };

            svc.addShapes = function (shapeObjs) {
                angular.forEach(shapeObjs, function (shapeObj) {
                    svc.scene.add(shapeObj.shape);
                });
            };

            svc.render = function () {
                requestAnimationFrame(svc.render);
                shapesFactory.updatePos();
                svc.renderer.render(svc.scene, svc.camera);
            };
        }

        return svc;
    }

})();