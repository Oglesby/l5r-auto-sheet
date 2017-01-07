'use strict';

class NewComponentController {

    constructor($state, modelService, characterService) {
        this.model = modelService.resetCurrentModel();
        this.step = 'creation';
        this.$state = $state;
        this.characterService = characterService;

        const $ctrl = this;
        this.onSaveCreation = () => {
            $ctrl.step = 'details';
        };

        this.onSaveDetails = () => {
            $ctrl.step = 'confirm';
        };

        this.onCancel = () => {
            $ctrl.$state.go('default');
        };

        this.onFinish = () => {
            // TODO: Persist to server
            let id = $ctrl.characterService.addCharacter($ctrl.model);
            $ctrl.$state.go('default', {characterId: id});
        };
    }

    inCreation() {
        return this.step === 'creation';
    };

    inDetails() {
        return this.step === 'details';
    };

    inConfirm() {
        return this.step === 'confirm';
    };
}

let NewComponent = {
    templateUrl: 'formatViews/new.html',
    controller: NewComponentController
};

export default NewComponent;
