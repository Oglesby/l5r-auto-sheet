"use strict";

angular.module("pocketIkoma").directive("piRingBlock", function () {
    return {
        restrict: "E",
        scope: {
            ring: "="
        },
        templateUrl: "rings/ring.block.html"
    };
});