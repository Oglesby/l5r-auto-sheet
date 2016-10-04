'use strict';

angular.module('pocketIkoma').directive('piDescription', function() {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'basicInfo/description.html',
        link: function(scope, element) {
            scope.$watch('model', function(newValue) {
                if (newValue && newValue.characterInfo.description) {
                    element.addClass('sixteen wide column');
                } else {
                    element.removeClass('sixteen wide column');
                }
            });
        }
    };
});

