"use strict";

angular.module("pocketIkoma")
    .constant("_", window._)
    .controller("piCharacterData", function ($scope, logService) {
        $scope.model = logService.getBaseModel();
        $scope.log = [];

        logService.getLogs($scope.model, $scope.log).then(function() {
            console.log($scope.model);
        });
    });
