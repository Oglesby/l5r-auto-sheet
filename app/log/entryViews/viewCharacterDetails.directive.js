'use strict';

angular.module('pocketIkoma').directive('piViewCharacterDetails', function () {

    var ViewCharacterDetailsController = function (_, $scope, modelService) {
        $scope.model = modelService.getCurrentModel();
    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/viewCharacterDetails.html',
        scope: {
        },
        controller: ViewCharacterDetailsController
    };
});