(function () {
    'use strict';

    angular.module('3js0').factory('threeDApiFactory', threeDApi);

    /** @ngInject */
    function threeDApi($window, $document, $log, shapesFactory, audioFactory, utilFactory) {
        var svc = this;

        if ($window.THREE) {

            var three = $window.THREE;
            var _near = 1;
            var _far = 500;

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
                dirLight.position.set(10, 10, 50).normalize();
                svc.scene.add(dirLight);

                var ambLight = new three.AmbientLight(0x404040);
                svc.scene.add(ambLight);

                // camera
                svc.camera = new three.PerspectiveCamera(45, width / height, _near, _far);
                svc.camera.position.z = 3;

                // raycaster
                svc.raycaster = new three.Raycaster();
                svc.raycaster.near = _near;
                svc.raycaster.far = _far;
            };

            svc.addShapes = function (shapeObjs) {
                angular.forEach(shapeObjs, function (shapeObj) {
                    svc.scene.add(shapeObj.shape);
                });
            };

            svc.removeAllShapes = function (shapeObjs) {
                angular.forEach(shapeObjs, function (shapeObj) {
                    svc.scene.remove(shapeObj.shape);
                });
            };

            // register callback for event from main shapes class
            shapesFactory.removeShapeCallback = function (shape) {
                svc.scene.remove(shape);
            };

            svc.loadAndBuildTextures = function () {
                svc.textures = [];
                var images = [
                        'assets/images/wood_crate.jpg',
                        'assets/images/wood_crate2.jpg',
                        'assets/images/steel_crate.jpg',
                        'assets/images/steel_crate2.jpg',
                        'assets/images/bark.jpg',
                        'assets/images/stone.jpg',
                        'assets/images/grass.jpg',
                        'assets/images/lava.jpg',
                        'assets/images/moon.jpg'];
                var loader = new three.TextureLoader();
                angular.forEach(images, function (image, inx) {
                    loader.load(image,
                        function (texture) {
                            $log.log('TEXTURE' + inx + ' download complete');
                            var material = new three.MeshPhongMaterial({
                                map: texture,
                                transparent: true,
                                opacity: 0.0
                            });
                            svc.textures.push(material);
                        },
                        function (/*xhr*/) {
                            //$log.log(utilFactory.reportXhrProgress(xhr, 'TEXTURE', inx));
                        },
                        function (xhr) {
                            $log.error(utilFactory.reportXhrError(xhr, 'TEXTURE', inx));
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