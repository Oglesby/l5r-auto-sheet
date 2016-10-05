'use strict';

angular.module('pocketIkoma').service('characterService', function(_, $q, $http) {

    var currentCharacterId = null;
    var nextCharacterId = 100;
    var cachedCharacters = [];

    var loadCharacter = function(id) {
        currentCharacterId = id;
        var character = _.find(cachedCharacters, {id: id});
        if (character && character.logModels) {
            return $q.when({ data: character.logModels });
        } else {
            return $http.get('data/' + id + '_logs.json');
        }
    };

    var addCharacter = function(model) {
        var id = nextCharacterId++;
        cachedCharacters.push({
            name: model.characterInfo.family.name + ' ' + model.characterInfo.name,
            id: id,
            logModels: _.map(model.logViews, function(logView) {
                return logView.logModel;
            })
        });

        return id;
    };

    var getCurrentCharacterId = function() {
        return currentCharacterId;
    };

    var getCharacters = function() {
        return $http.get('data/characters.json').then(function(data) {
            return _.merge(cachedCharacters, data.data.characters);
        });
    };

    var deleteCharacter = function(id) {
        _.remove(cachedCharacters, {id: id});
        // TODO: actually delete.
    };

    return {
        loadCharacter: loadCharacter,
        addCharacter: addCharacter,
        getCurrentCharacterId: getCurrentCharacterId,
        deleteCharacter: deleteCharacter,
        getCharacters: getCharacters
    };
});