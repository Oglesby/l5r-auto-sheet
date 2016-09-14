'use strict';

angular.module('pocketIkoma').service('characterService', function($http) {

    var currentCharacterId = null;

    var loadCharacter = function(id) {
        currentCharacterId = id;
        return $http.get('data/' + id + '_logs.json');
    };

    var getCurrentCharacterId = function() {
        return currentCharacterId;
    };

    var getCharacters = function() {
        return $http.get('data/characters.json').then(function(data) {
            return data.data.characters;
        });
    };

    return {
        loadCharacter: loadCharacter,
        getCurrentCharacterId: getCurrentCharacterId,
        getCharacters: getCharacters
    };
});