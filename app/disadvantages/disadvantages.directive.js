'use strict';

angular.module('pocketIkoma').directive('piDisadvantages', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'disadvantages/disadvantages.html'
    };
});