'use strict';

class ViewCreationComponentController {

    constructor(modelService) {
        this.model = modelService.getCurrentModel();
    }

    isDifferentSchool() {
        return this.model.advantages && this.model.advantages.length > 0;
    };
}

let ViewCreationComponent = {
    controller: ViewCreationComponentController,
    templateUrl: 'log/entryViews/viewCreation.html'
};

export default ViewCreationComponent;