'use strict';

angular.module('pocketIkoma').directive('piViewCreation', function () {

    var ViewCreationController = function (_, $scope, modelService) {
        $scope.model = modelService.getCurrentModel();

        $scope.isDifferentSchool = function() {
            return $scope.model.advantages && $scope.model.advantages.length > 0;
        };
    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/viewCreation.html',
        scope: {
        },
        controller: ViewCreationController
    };
});