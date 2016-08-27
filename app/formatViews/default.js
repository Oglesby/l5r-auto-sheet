'use strict';

angular.module('pocketIkoma').controller('DefaultController', function ($scope, logService) {
    $scope.model = logService.getBaseModel();
    $scope.log = [];

    logService.getLogs($scope.model, $scope.log).then(function() {
        console.log($scope.model);
    });
});
