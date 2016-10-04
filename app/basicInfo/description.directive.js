'use strict';

angular.module('pocketIkoma').directive('piDescription', function() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'basicInfo/description.html'
    };
});

