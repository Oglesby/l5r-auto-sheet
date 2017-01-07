'use strict';


class LogComponentController {
    constructor(_, modelService) {
        /* @ngInject */

        this.resetChanges();
        this.modelService = modelService;

        let self = this;
        this.cancelChangingLog = function() {
            self.resetChanges();
        };
    }


    resetChanges() {
        this.deletingLogView = null;
        this.editingLogView = null;
    }

    startEditLog(logView) {
        this.editingLogView = logView;
    };

    finishEditingLog() {
        this.resetChanges();
    };

    startDeleteLog(logView) {
        this.deletingLogView = logView;
    };

    finishDeletingLog() {
        this.modelService.removeLogFromModel(this.deletingLogView.logModel.id);
        this.resetChanges();
    };

    markHouseruled(logView) {
        logView.invalidReasons = [];
        logView.isHouseruled = true;
    };

    logViewIsInvalid(logView) {
        return logView.invalidReasons && logView.invalidReasons.length > 0;
    };

    isMandatoryEntry(logView) {
        return this.modelService.isMandatoryLogModel(logView);
    }
}

let LogComponent = {
    bindings: {
        model: '='
    },
    controller: LogComponentController,
    templateUrl: 'log/log.html'
};

export default LogComponent;
