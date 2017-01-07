'use strict';

class ViewCharacterDetailsComponentController {

    constructor(modelService) {
        this.model = modelService.getCurrentModel();
    }
}

let ViewCharacterDetailsComponent = {
    controller: ViewCharacterDetailsComponentController,
    templateUrl: 'log/entryViews/viewCharacterDetails.html'
};

export default ViewCharacterDetailsComponent;