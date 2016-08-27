'use strict';

angular.module('pocketIkoma').controller('DefaultController', function ($scope, $stateParams, logService) {
    $scope.model = {};
    $scope.log = [];

    logService.getLogs($stateParams.characterId, $scope.model, $scope.log).then(function(response) {
        $scope.model = response.model;
        $scope.log = response.log;
        console.log($scope.model);
    });
});
