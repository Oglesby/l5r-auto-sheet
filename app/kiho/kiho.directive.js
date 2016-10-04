'use strict';

angular.module('pocketIkoma').directive('piKiho', function () {
    return {
        restrict: 'E',
        templateUrl: 'kiho/kiho.html',
        link: function(scope, element) {
            scope.$watch('model', function(newValue) {
                if (newValue && newValue.kiho && newValue.kiho.length > 0) {
                    element.addClass('sixteen wide column');
                } else {
                    element.removeClass('sixteen wide column');
                }
            });
        }
    };
});