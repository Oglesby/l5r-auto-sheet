'use strict';

angular.module('pocketIkoma').directive('piSpells', function () {
    return {
        restrict: 'E',
        scope: {
            model: '='
        },
        templateUrl: 'spells/spells.html',
        link: function(scope, element) {
            scope.$watch('model', function(newValue) {
                if (newValue && newValue.spells && newValue.spells.length > 0) {
                    element.addClass('sixteen wide column');
                } else {
                    element.removeClass('sixteen wide column');
                }
            });
        }
    };
});