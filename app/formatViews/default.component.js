'use strict';

class DefaultComponentController {
    constructor($stateParams, modelService) {
        // TODO: Show a selection screen instead?
        let characterId = $stateParams.characterId ? $stateParams.characterId : 1;

        modelService.loadCharacter(characterId).then(() => {
            this.model = modelService.getCurrentModel();
        });
    }
}

let DefaultComponent = {
    templateUrl: 'formatViews/default.html',
    controller: DefaultComponentController
};

export default DefaultComponent;