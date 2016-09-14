'use strict';

angular.module('pocketIkoma').controller('DefaultController', function ($scope, $stateParams, logService) {
    $scope.model = {};
    $scope.log = [];

    // TODO: Show a selection screen instead?
    var characterId = $stateParams.characterId ? $stateParams.characterId : 1;

    logService.getLogs(characterId).then(function(response) {
        $scope.model = response.model;
        $scope.log = response.log;
    });
});
