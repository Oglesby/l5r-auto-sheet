"use strict";

angular.module("l5rAutoSheetApp").directive("l5rRingBlock", function () {
    return {
        restrict: "E",
        scope: {
            // TODO These should really be nested objects, but angular vomits on binding that
            ringIcon: "@",
            ringName: "@",
            ringRank: "=",
            spiritualTraitName: "@",
            spiritualTraitRank: "=",
            physicalTraitName: "@",
            physicalTraitRank: "="
        },
        templateUrl: "rings/ring.block.html"
    };
});