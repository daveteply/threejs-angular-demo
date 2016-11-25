(function () {
    'use strict';

    angular.module('3js0').factory('audioFactory', AudioFactoryFunction);

    /** @ngInject */
    function AudioFactoryFunction($window, $log, $q, utilFactory) {
        var svc = this;

        var three = $window.THREE;
        
        var audioTracks = {
            levelMusic: [
                {src: 'assets/audio/level/l1.mp3'},
                {src: 'assets/audio/level/l2.mp3'},
                {src: 'assets/audio/level/l3.mp3'},
                {src: 'assets/audio/level/l4.mp3'},
            ],
            endLevelMusic: [
                {src: 'assets/audio/end/el1.mp3'},
                {src: 'assets/audio/end/el2.mp3'},
                {src: 'assets/audio/end/el3.mp3'},
                {src: 'assets/audio/end/el4.mp3'}
            ],
            hit: [
                {src: 'assets/audio/hit/h1.mp3'},
                {src: 'assets/audio/hit/h2.mp3'},
                {src: 'assets/audio/hit/h3.mp3'}
            ],
            miss: [
                {src: 'assets/audio/miss/m1.mp3'},
                {src: 'assets/audio/miss/m2.mp3'},
                {src: 'assets/audio/miss/m3.mp3'},
                {src: 'assets/audio/miss/m4.mp3'},
                {src: 'assets/audio/miss/m5.mp3'},
                {src: 'assets/audio/miss/m6.mp3'}
            ]
        };

        svc.playRndTrack = function(group) {
            if (group === 'levelMusic' || group === 'endLevelMusic') {
                // ensure all background music is not playing
                var backgroundMusic = audioTracks.levelMusic;
                backgroundMusic = backgroundMusic.concat(audioTracks.endLevelMusic);
                angular.forEach(backgroundMusic, function(track) {
                    if (track.audio.isPlaying) {
                        track.audio.stop();
                    }
                });
            }
            var inx = utilFactory.getRandomInt(0, audioTracks[group].length)
            audioTracks[group][inx].audio.play();
        };
        
        var loadAudioFileGroup = function(audioListener, audioLoader, scene, tracks, setLoop, msg) {
            return $q(function(resolve) {
                angular.forEach(tracks, function (track, inx) {
                    audioLoader.load(track.src,
                        function (audioBuffer) {
                            $log.log(msg + inx + ' download complete');
                            track.audio = new three.Audio(audioListener);
                            scene.add(track.audio);
                            track.audio.setBuffer(audioBuffer);
                            if (setLoop) {
                                track.audio.setLoop(true);
                            }
                            if ((inx + 1) == tracks.length) {
                                resolve();
                            }
                        },
                        function (xhr) {
                            //$log.log(utilFactory.reportXhrProgress(xhr, msg, inx));
                        },
                        function (xhr) {
                            $log.error(utilFactory.reportXhrError(xhr, msg, inx));
                        });
                });
            });
        };

        svc.loadAudio = function (camera, scene) {
            var audioListener = new three.AudioListener();
            camera.add(audioListener);

            var loader = new three.AudioLoader();

            var levelMusicPromise = loadAudioFileGroup(
                audioListener, loader, scene, audioTracks.levelMusic, true, 'AUDIO Music');
            
            var endLevelMusicPromise = loadAudioFileGroup(
                audioListener, loader, scene, audioTracks.endLevelMusic, true, 'AUDIO End Level Music');

            var hitPromise = loadAudioFileGroup(
                audioListener, loader, scene, audioTracks.hit, false, 'AUDIO hit');
            
            var missPromise = loadAudioFileGroup(
                audioListener, loader, scene, audioTracks.miss, false, 'AUDIO miss');
                
            return $q.all([levelMusicPromise, endLevelMusicPromise, hitPromise, missPromise]);
        };

        return svc;
    }

})();