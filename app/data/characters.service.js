'use strict';
import _ from 'lodash';

class CharacterService {
    constructor($q, $http) {
        this.$q = $q;
        this.$http = $http;
        this.currentCharacterId = null;
        this.nextCharacterId = 100;
        this.cachedCharacters = [];
    }

    loadCharacter(id) {
        this.currentCharacterId = id;
        let character = _.find(this.cachedCharacters, {id: id});
        if (character && character.logModels) {
            return this.$q.when({ data: character.logModels });
        } else {
            return this.$http.get('data/' + id + '_logs.json');
        }
    };

    addCharacter(model) {
        const id = this.nextCharacterId++;
        this.cachedCharacters.push({
            name: model.characterInfo.family.name + ' ' + model.characterInfo.name,
            id: id,
            logModels: _.map(model.logViews, function(logView) {
                return logView.logModel;
            })
        });

        return id;
    };

    getCurrentCharacterId() {
        return this.currentCharacterId;
    };

    getCharacters() {
        return this.$http.get('data/characters.json').then((data) => {
            return _.merge(this.cachedCharacters, data.data.characters);
        });
    };

    deleteCharacter(id) {
        _.remove(this.cachedCharacters, {id: id});
        // TODO: actually delete.
    };
}

export default CharacterService;
