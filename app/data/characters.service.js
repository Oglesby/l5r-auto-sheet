'use strict';

angular.module('pocketIkoma').service('characterService', function($http) {

    var getLogs = function(id) {
        return $http.get('data/' + id + '_logs.json');
    };

    var getCharacters = function() {
        return $http.get('data/characters.json').then(function(data) {
            return data.data.characters;
        });
    };

    return {
        getLogs: getLogs,
        getCharacters: getCharacters
    };
});