(function () {

    'use strict';

    angular.module('3js0').component('links', {
        templateUrl: 'app/components/links/links.html',
        controller: function () {
            var ctrl = this;

            ctrl.linkData = [
                {
                    href: "https://threejs.org",
                    label: "three.js"
                },
                {
                    href: "https://angularjs.org",
                    label: "AngularJS"
                },
                {
                    href: "https://material.angularjs.org",
                    label: "Angular Material"
                },
                {
                    href: "https://github.com/hrajchert/angular-screenfull",
                    label: "Angular Screenfull"
                },
                {
                    href: "http://www.acoustica.com/mixcraft/free-stuff.htm",
                    label: "Audio"
                }
            ];

        }
    });

})();