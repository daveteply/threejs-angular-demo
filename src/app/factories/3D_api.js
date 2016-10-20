(function () {
    'use strict';

    angular.module('3js0').factory('threeDApiFactory', threeDApi);

    /** @ngInject */
    function threeDApi($window, $document, $log, shapesFactory) {
        var svc = this;

        if ($window.THREE) {

            var three = $window.THREE;

            svc.initRenderer = function (canvas, width, height) {
                svc.renderer = new three.WebGLRenderer({
                    canvas: canvas
                });
                //svc.renderer.setPixelRatio($window.devicePixelRatio);
                svc.renderer.setSize(width, height);
            };

            svc.handleResizeEvent = function (width, height) {
                svc.renderer.setSize(width, height);
                svc.camera.aspect = width / height;
                svc.camera.updateProjectionMatrix();
            };

            svc.detectObjectIntersection = function (xPos, yPos) {
                svc.raycaster.setFromCamera({
                    x: xPos,
                    y: yPos
                }, svc.camera);
                return svc.raycaster.intersectObjects(svc.scene.children);
            };

            svc.setUpScene = function (width, height) {

                // scene
                svc.scene = new three.Scene();

                // lights
                var dirLight = new three.DirectionalLight(0xffffff, 1);
                dirLight.position.set(100, 100, 50).normalize();
                svc.scene.add(dirLight);

                var ambLight = new three.AmbientLight(0x404040);
                svc.scene.add(ambLight);

                // camera
                svc.camera = new three.PerspectiveCamera(45, width / height, 1, 10000);
                svc.camera.position.z = 3;

                // raycaster
                svc.raycaster = new three.Raycaster();
            };

            svc.addShapes = function (shapeObjs) {
                angular.forEach(shapeObjs, function (shapeObj) {
                    svc.scene.add(shapeObj.shape);
                });
            };

            svc.loadTextures = function () {
                svc.textures = [];
                var images = [
                    'assets/images/wood_crate.jpg',
                    'assets/images/wood_crate2.jpg',
                    'assets/images/steel_crate.jpg',
                    'assets/images/steel_crate2.jpg'
                ];
                var loader = new three.TextureLoader();
                angular.forEach(images, function (image) {
                    loader.load(image, function (texture) {
                        var material = new three.MeshBasicMaterial({
                            map: texture
                        });
                        svc.textures.push(material);
                    }, function (xhr) {
                        $log.log((xhr.loaded / xhr.total * 100) + '% loaded');
                    }, function (xhr) {
                        $log.error('texture laod failed: ' + xhr);
                    });
                });
                return loader;
            }

            svc.render = function () {
                requestAnimationFrame(svc.render);
                shapesFactory.updatePos();
                svc.renderer.render(svc.scene, svc.camera);
            };
        }

        return svc;
    }

})();