'use strict';

angular.module('pocketIkoma').directive('piKatas', function () {
    return {
        restrict: 'E',
        templateUrl: 'katas/katas.html',
        link: function(scope, element) {
            scope.$watch('model', function(newValue) {
                if (newValue && newValue.katas && newValue.katas.length > 0) {
                    element.addClass('sixteen wide column');
                } else {
                    element.removeClass('sixteen wide column');
                }
            });
        }
    };
});
