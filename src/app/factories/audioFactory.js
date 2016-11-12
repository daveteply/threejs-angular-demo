(function () {
    'use strict';

    angular.module('3js0').factory('audioFactory', AudioFactoryFunction);

    /** @ngInject */
    function AudioFactoryFunction($window, $log, utilFactory) {
        var svc = this;

        var three = $window.THREE;

        var audioTracks = {
            levelMusic: [{
                    src: 'assets/audio/FREE_R&B_0001_A.ogg'
                },
                {
                    src: 'assets/audio/FREE_HIP_0002_A.ogg'
                    },
                {
                    src: 'assets/audio/FREE_BRO_0001_A.ogg'
                    }],
            endLevelMusic: [{
                    src: 'assets/audio/303__6.ogg'
                },
                {
                    src: 'assets/audio/303__4.ogg'
                },
                {
                    src: 'assets/audio/303__2.ogg'
                }],
            hit: {
                src: 'assets/audio/TAKE_OFF.ogg'
            },
            miss: {
                src: 'assets/audio/A_SPIRIT.ogg'
            }
        };

        svc.playNextMusicTrack = function () {
            var track = audioTracks.levelMusic[utilFactory.getRandomInt(0, audioTracks.levelMusic.length)];
            console.log(222, track.audio);
        };

        svc.loadAudio = function (camera, scene) {
            var audioListener = new three.AudioListener();
            camera.add(audioListener);

            var loader = new three.AudioLoader();

            // load music
            angular.forEach(audioTracks.levelMusic, function (track, inx) {
                loader.load(track.src,
                    function (audioBuffer) {
                        track.audio = new three.Audio(audioListener);
                        scene.add(track.audio);
                        track.audio.setBuffer(audioBuffer);
                        track.audio.setLoop(true);
                    },
                    function (xhr) {
                        //$log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO Music', inx));
                    },
                    function (xhr) {
                        $log.error(utilFactory.reportXhrError(xhr, 'AUDIO Music', inx));
                    });
            });

            // load end level music
            angular.forEach(audioTracks.endLevelMusic, function (track, inx) {
                loader.load(track.src,
                    function (audioBuffer) {
                        track.audio = new three.Audio(audioListener);
                        scene.add(track.audio);
                        track.audio.setBuffer(audioBuffer);
                        track.audio.setLoop(true);
                    },
                    function (xhr) {
                        //$log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO End Level Music', inx));
                    },
                    function (xhr) {
                        $log.error(utilFactory.reportXhrError(xhr, 'AUDIO End Level Music', inx));
                    });
            });

            // hit
            loader.load(audioTracks.hit.src,
                function (audioBuffer) {
                    audioTracks.hit.audio = new three.Audio(audioListener);
                    scene.add(audioTracks.hit.audio);
                    audioTracks.hit.audio.setBuffer(audioBuffer);
                },
                function (xhr) {
                    //$log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO hit', 0));
                },
                function (xhr) {
                    $log.error(utilFactory.reportXhrError(xhr, 'AUDIO hit', 0));
                });

            // miss
            loader.load(audioTracks.miss.src,
                function (audioBuffer) {
                    audioTracks.miss.audio = new three.Audio(audioListener);
                    scene.add(audioTracks.miss.audio);
                    audioTracks.miss.audio.setBuffer(audioBuffer);
                },
                function (xhr) {
                    //$log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO miss', 0));
                },
                function (xhr) {
                    $log.error(utilFactory.reportXhrError(xhr, 'AUDIO miss', 0));
                });

            return loader;
        };



        return svc;
    }

})();