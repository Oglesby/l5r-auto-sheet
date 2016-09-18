'use strict';

angular.module('pocketIkoma').directive('piSpells', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'spells/spells.html'
    };
});