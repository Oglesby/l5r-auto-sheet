'use strict';

angular.module('pocketIkoma').directive('piSecondaryStats', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'secondaryStats/secondary.stats.html'
    };
});
