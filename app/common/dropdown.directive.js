'use strict';

angular.module('pocketIkoma').directive('piDropdown', function ($, $timeout) {
    return {
        restrict: 'C',
        link: function (scope, element, attr) {
            $timeout(function () {
                $(element).dropdown({
                    forceSelection: false
                });

                $(element).dropdown('set selected', scope[attr.ngModel]);

                $(element).dropdown('setting', {
                    onChange: function (value) {
                        scope[attr.ngModel] = value;
                        scope[attr.ngChange](scope[attr.ngModel]);
                        scope.$apply();
                    }
                });
            }, 0);
        }
    };
});
