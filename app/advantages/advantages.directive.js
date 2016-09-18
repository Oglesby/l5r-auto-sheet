'use strict';

angular.module('pocketIkoma').directive('piAdvantages', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'advantages/advantages.html'
    };
});