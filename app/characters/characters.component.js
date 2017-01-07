'use strict';

class CharacterComponentController {

    constructor(characterService) {
        characterService.getCharacters().then((characters) => {
            this.characters = characters;
        });
    }
}

let CharacterComponent = {
    templateUrl: 'characters/characters.html',
    controller: CharacterComponentController
};

export default CharacterComponent;