'use strict';

angular.module('pocketIkoma').service('modelService', function(_, logService, characterService) {

    var loadedLogModels = [];
    var currentModel = logService.createBaseModel();

    // TODO: This service should be pushing out the model updates.

    var loadCharacter = function(characterId) {
        return characterService.loadCharacter(characterId).then(function (logModels) {
            currentModel = logService.createBaseModel();
            Array.prototype.push.apply(loadedLogModels, logModels.data);

            return logService.processLogsIntoModel(currentModel, loadedLogModels);
        });
    };

    var getCurrentModel = function() {
        return currentModel;
    };

    var addLogToModel = function(logModel) {
        loadedLogModels.push(logModel);
        // TODO: persist the logModel
        return logService.processLogsIntoModel(currentModel, [logModel]);
    };

    var removeLogFromModel = function(logId) {
        var index = _.findIndex(loadedLogModels, {id: logId});
        if (index > -1) {
            loadedLogModels.splice(index, 1);
        }

        // TODO: persist the removal
        logService.createBaseModel(currentModel);
        return logService.processLogsIntoModel(currentModel, loadedLogModels);
    };

    var updateLogInModel = function(logModel) {
        // TODO: Persist the update.
    };

    var isMandatoryLogModel = function(logModel) {
        return logModel.type === 'CREATION' || logModel.type === 'CHARACTER_INFO' ;
    };

    return {
        loadCharacter: loadCharacter,
        getCurrentModel: getCurrentModel,
        addLogToModel: addLogToModel,
        removeLogFromModel: removeLogFromModel,
        updateLogInModel: updateLogInModel,
        isMandatoryLogModel: isMandatoryLogModel
    };
});