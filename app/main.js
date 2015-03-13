"use strict";

angular.module("l5rAutoSheetApp")
    .constant("_", window._)
    .controller("L5rCharacterData", function ($scope, logService) {
        $scope.model = logService.getBaseModel();
        $scope.log = [];

        logService.getLogs($scope.model, $scope.log).then(function() {
            console.log($scope.model);
        });
    });
