'use strict';

function CharacterController($scope, characterService) {
    characterService.getCharacters().then(function(characters) {
        $scope.characters = characters;
    });
}

angular.module('pocketIkoma').directive('piCharacters', function() {
    return {
        restrict: 'E',
        templateUrl: 'characters/characters.html',
        controller: CharacterController
    };
});

