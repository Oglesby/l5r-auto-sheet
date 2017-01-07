'use strict';

import $ from 'jquery';

class AddEditCharacterDetailsComponentController {

    constructor($, $timeout, logService, modelService) {
        /* @ngInject */
        this.logService = logService;
        this.modelService = modelService;

        if (!this.logModel) {
            this.name = null;
            this.description = null;
        } else {
            this.name = this.logModel.name;
            this.description = this.logModel.description;
        }

        $timeout(() => {
            // TODO: move into link function.
            $('.ui.details.form').form({
                fields: {
                    school: {
                        identifier: 'name',
                        rules: [{
                            type   : 'empty',
                            prompt : 'Please enter a character name.'
                        }]
                    }
                }
            });
        });
    }

    save() {
        // TODO: Move into link function.
        const form = $('.ui.details.form');
        form.form('validate form');

        if (!form.form('is valid')) {
            return;
        }

        this.characterDetailsLogModel = this.logService.makeCharacterDetailsLogModel(this.name, this.description);
        if (this.logModel) {
            this.characterDetailsLogModel.creationTimestamp = this.logModel.creationTimestamp;
            this.characterDetailsLogModel.id = this.logModel.id;
        } else {
            this.characterDetailsLogModel.creationTimestamp = new Date().toISOString();
        }

        this.modelService.addOrUpdateLogInModel(this.characterDetailsLogModel);
        this.onSave(this.characterDetailsLogModel);
    };

    cancel() {
        this.onCancel();
    };
}

let AddEditCharacterDetailsComponent = {
    bindings: {
        logModel: '=',
        onSave: '=',
        onCancel: '='
    },
    controller: AddEditCharacterDetailsComponentController,
    templateUrl: 'log/entryViews/addEditCharacterDetails.html'
};

export default AddEditCharacterDetailsComponent;
