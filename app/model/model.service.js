'use strict';

angular.module('pocketIkoma').service('modelService', function(_, logService, characterService) {

    var loadedLogModels = [];
    var currentModel = logService.createBaseModel();

    // TODO: This service should be pushing out the model updates.

    var loadCharacter = function(characterId) {
        return characterService.loadCharacter(characterId).then(function (logModels) {
            currentModel = logService.createBaseModel();
            loadedLogModels = logModels.data;

            return logService.processLogsIntoModel(currentModel, loadedLogModels);
        });
    };

    var resetCurrentModel = function() {
        currentModel = logService.createBaseModel();
        return currentModel;
    };

    var getCurrentModel = function() {
        return currentModel;
    };

    var addLogToModel = function(logModel) {
        loadedLogModels.push(logModel);
        // TODO: persist the logModel
        return logService.processLogsIntoModel(currentModel, [logModel]);
    };

    var updateLogInModel = function(logModel) {
        var index = _.findIndex(loadedLogModels, {id: logModel.id});
        if (index > -1) {
            loadedLogModels[index] = logModel;
        } else {
            // TODO: error in some way
        }

        // TODO: Persist the update.
        logService.createBaseModel(currentModel);
        return logService.processLogsIntoModel(currentModel, loadedLogModels);
    };

    var addOrUpdateLogInModel = function(logModel) {
        var index = _.findIndex(loadedLogModels, {id: logModel.id});
        if (index === -1) {
            return addLogToModel(logModel);
        } else {
            return updateLogInModel(logModel);
        }
    };

    var removeLogFromModel = function(logId) {
        var index = _.findIndex(loadedLogModels, {id: logId});
        if (index > -1) {
            loadedLogModels.splice(index, 1);
        } else {
            // TODO: log a warning
        }

        // TODO: persist the removal
        logService.createBaseModel(currentModel);
        return logService.processLogsIntoModel(currentModel, loadedLogModels);
    };

    var isMandatoryLogModel = function(logModel) {
        return logModel.type === 'CREATION' || logModel.type === 'CHARACTER_INFO' ;
    };

    return {
        loadCharacter: loadCharacter,
        getCurrentModel: getCurrentModel,
        resetCurrentModel: resetCurrentModel,
        addLogToModel: addLogToModel,
        removeLogFromModel: removeLogFromModel,
        updateLogInModel: updateLogInModel,
        addOrUpdateLogInModel: addOrUpdateLogInModel,
        isMandatoryLogModel: isMandatoryLogModel
    };
});