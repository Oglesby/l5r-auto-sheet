'use strict';

angular.module('pocketIkoma').directive('piBasicInfo', function() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'basicInfo/basicInfo.html'
    };
});

