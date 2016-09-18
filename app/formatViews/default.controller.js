'use strict';

angular.module('pocketIkoma').controller('DefaultController', function ($scope, $stateParams, modelService) {
    // TODO: Show a selection screen instead?
    var characterId = $stateParams.characterId ? $stateParams.characterId : 1;

    modelService.loadCharacter(characterId).then(function() {
       $scope.model = modelService.getCurrentModel();
    });
});
