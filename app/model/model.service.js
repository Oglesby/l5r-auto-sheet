'use strict';

angular.module('pocketIkoma').service('modelService', function(_, logService, characterService, ringService) {

    // TODO: This service should be pushing out the model updates.

    /**
     * Creates a new model, optionally replacing all the properties in the given model with the base model.
     *
     * Also, wtf return type?
     * @param modelObj The model to replace values for (optional).
     * @returns {{rings: {earth, water, fire, air, void}, characterInfo: {glory: number, honor: number, status: number, taint: number, infamy: number, shadowRank: number}, secondaryStats: {bonusTN: number, bonusInitiative: number, bonusMovement: number, bonusWoundsPerRank: number, woundPenalties: *[]}, skills: Array, logViews: Array}}
     */
    function createBaseModel(modelObj) {
        var newModel = {
            rings: {
                earth: ringService.createEarthRing(),
                water: ringService.createWaterRing(),
                fire: ringService.createFireRing(),
                air: ringService.createAirRing(),
                void: ringService.createVoidRing()
            },
            characterInfo: {
                glory: 10,
                honor: 10,
                status: 10,
                taint: 0,
                infamy: 0,
                shadowRank: 0
            },
            secondaryStats: {
                bonusTN: 0,
                bonusInitiative: 0,
                bonusMovement: 0,
                bonusWoundsPerRank: 0,
                woundPenalties: [0, 3, 5, 10, 15, 20, 40, null]
            },
            skills: [],
            logViews: []
        };

        if (modelObj) {
            /* In order for the 2-way mapping to hold to all the directives that accept the model, we need to keep the
             same actual object. An alternative is switching to listeners. */
            for (var member in modelObj) {
                if (modelObj.hasOwnProperty(member)) {
                    delete modelObj[member];
                }
            }
            _.assign(modelObj, newModel);
        } else {
            return newModel;
        }
    }

    var loadedLogModels = [];
    var currentModel = createBaseModel();

    var loadCharacter = function(characterId) {
        return characterService.loadCharacter(characterId).then(function (logModels) {
            currentModel = createBaseModel();
            loadedLogModels = logModels.data;

            return logService.processLogsIntoModel(currentModel, loadedLogModels);
        });
    };

    var resetCurrentModel = function() {
        currentModel = createBaseModel();
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
        createBaseModel(currentModel);
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
        createBaseModel(currentModel);
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