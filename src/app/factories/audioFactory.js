(function () {
    'use strict';

    angular.module('3js0').factory('audioFactory', AudioFactoryFunction);

    /** @ngInject */
    function AudioFactoryFunction($window, $log, $q, utilFactory) {
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
            if (svc.endLevelTrack) {
                svc.endLevelTrack.audio.stop();
            }
            angular.forEach(audioTracks.levelMusic, function (track) {
                if (track.audio.isPlaying) {
                    track.audio.stop();
                }
            });
            svc.musicTrack = audioTracks.levelMusic[utilFactory.getRandomInt(0, audioTracks.levelMusic.length)];
            svc.musicTrack.audio.play();
        };

        svc.playNextEndLevelMusic = function () {
            svc.musicTrack.audio.stop();
            angular.forEach(audioTracks.endLevelMusic, function (track) {
                if (track.audio.isPlaying) {
                    track.audio.stop();
                }
            });
            svc.endLevelTrack = audioTracks.endLevelMusic[utilFactory.getRandomInt(0, audioTracks.endLevelMusic.length)];
            svc.endLevelTrack.audio.play();
        };

        svc.loadAudio = function (camera, scene) {
            var audioListener = new three.AudioListener();
            camera.add(audioListener);

            var loader = new three.AudioLoader();

            // load music
            var levelMusicPromise = $q(function (resolve) {
                angular.forEach(audioTracks.levelMusic, function (track, inx) {
                    loader.load(track.src,
                        function (audioBuffer) {
                            track.audio = new three.Audio(audioListener);
                            scene.add(track.audio);
                            track.audio.setBuffer(audioBuffer);
                            track.audio.setLoop(true);

                            if ((inx + 1) == audioTracks.levelMusic.length) {
                                resolve();
                            }
                        },
                        function (xhr) {
                            $log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO Music', inx));
                        },
                        function (xhr) {
                            $log.error(utilFactory.reportXhrError(xhr, 'AUDIO Music', inx));
                        });
                });
            });

            // load end level music
            var endLevelMusicPromise = $q(function (resolve) {
                angular.forEach(audioTracks.endLevelMusic, function (track, inx) {
                    loader.load(track.src,
                        function (audioBuffer) {
                            track.audio = new three.Audio(audioListener);
                            scene.add(track.audio);
                            track.audio.setBuffer(audioBuffer);
                            track.audio.setLoop(true);

                            if ((inx + 1) == audioTracks.endLevelMusic.length) {
                                resolve();
                            }
                        },
                        function (xhr) {
                            $log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO End Level Music', inx));
                        },
                        function (xhr) {
                            $log.error(utilFactory.reportXhrError(xhr, 'AUDIO End Level Music', inx));
                        });
                });
            });

            // hit
            var hitPromise = $q(function (resolve) {
                loader.load(audioTracks.hit.src,
                    function (audioBuffer) {
                        audioTracks.hit.audio = new three.Audio(audioListener);
                        scene.add(audioTracks.hit.audio);
                        audioTracks.hit.audio.setBuffer(audioBuffer);
                        resolve();
                    },
                    function (xhr) {
                        $log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO hit', 0));
                    },
                    function (xhr) {
                        $log.error(utilFactory.reportXhrError(xhr, 'AUDIO hit', 0));
                    });
            });

            // miss
            var missPromise = $q(function (resolve) {
                loader.load(audioTracks.miss.src,
                    function (audioBuffer) {
                        audioTracks.miss.audio = new three.Audio(audioListener);
                        scene.add(audioTracks.miss.audio);
                        audioTracks.miss.audio.setBuffer(audioBuffer);
                        resolve();
                    },
                    function (xhr) {
                        $log.log(utilFactory.reportXhrProgress(xhr, 'AUDIO miss', 0));
                    },
                    function (xhr) {
                        $log.error(utilFactory.reportXhrError(xhr, 'AUDIO miss', 0));
                    });
            });

            return $q.all([levelMusicPromise, endLevelMusicPromise, hitPromise, missPromise]);
        };



        return svc;
    }

})();