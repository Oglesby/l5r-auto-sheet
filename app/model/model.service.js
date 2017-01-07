'use strict';

import _ from 'lodash';

class ModelService {
    constructor(logService, characterService, ringService) {
        this.ringService = ringService;
        this.characterService = characterService;
        this.logService = logService;

        this.loadedLogModels = [];
        this.modelMode = 'viewing';
        this.currentModel = this.createBaseModel();
        this.currentSpendingLog = null;
    }

    /**
     * Creates a new model, optionally replacing all the properties in the given model with the base model.
     *
     * Also, wtf return type?
     * @param modelObj The model to replace values for (optional).
     * @returns {{rings: {earth, water, fire, air, void}, characterInfo: {glory: number, honor: number, status: number, taint: number, infamy: number, shadowRank: number}, secondaryStats: {bonusTN: number, bonusInitiative: number, bonusMovement: number, bonusWoundsPerRank: number, woundPenalties: *[]}, skills: Array, logViews: Array}}
     */
    createBaseModel(modelObj) {
        let newModel = {
            rings: {
                earth: this.ringService.createEarthRing(),
                water: this.ringService.createWaterRing(),
                fire: this.ringService.createFireRing(),
                air: this.ringService.createAirRing(),
                void: this.ringService.createVoidRing()
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
            for (let member in modelObj) {
                if (modelObj.hasOwnProperty(member)) {
                    delete modelObj[member];
                }
            }
            _.assign(modelObj, newModel);
        } else {
            return newModel;
        }
    }

    loadCharacter(characterId) {
        return this.characterService.loadCharacter(characterId).then((logModels) => {
            this.currentModel = this.createBaseModel();
            this.loadedLogModels = logModels.data;

            return this.logService.processLogsIntoModel(this.currentModel, this.loadedLogModels);
        });
    };

    resetCurrentModel() {
        this.currentModel = this.createBaseModel();
        return this.currentModel;
    };

    getCurrentModel() {
        return this.currentModel;
    };

    addLogToModel(logModel) {
        this.loadedLogModels.push(logModel);
        // TODO: persist the logModel
        return this.logService.processLogsIntoModel(this.currentModel, [logModel]);
    };

    updateLogInModel(logModel) {
        const index = _.findIndex(this.loadedLogModels, {id: logModel.id});
        if (index > -1) {
            this.loadedLogModels[index] = logModel;
        } else {
            // TODO: error in some way
        }

        // TODO: Persist the update.
        this.createBaseModel(this.currentModel);
        return this.logService.processLogsIntoModel(this.currentModel, this.loadedLogModels);
    };

    addOrUpdateLogInModel(logModel) {
        const index = _.findIndex(this.loadedLogModels, {id: logModel.id});
        if (index === -1) {
            return this.addLogToModel(logModel);
        } else {
            return this.updateLogInModel(logModel);
        }
    };

    removeLogFromModel(logId) {
        const index = _.findIndex(this.loadedLogModels, {id: logId});
        if (index > -1) {
            this.loadedLogModels.splice(index, 1);
        } else {
            // TODO: log a warning
        }

        // TODO: persist the removal
        this.createBaseModel(this.currentModel);
        return this.logService.processLogsIntoModel(this.currentModel, this.loadedLogModels);
    };

    isMandatoryLogModel(logModel) {
        return logModel.type === 'CREATION' || logModel.type === 'CHARACTER_INFO' ;
    };

    isInSpendingMode() {
        return this.modelMode === 'spending';
    };

    startSpendingMode(spendingLog) {
        this.modelMode = 'spending';
        if (spendingLog) {
            this.currentSpendingLog = spendingLog;
        } else {
            this.currentSpendingLog = this.logService.makeXpExpenditureLogModel();
        }
    };

    stopSpendingMode() {
        this.modelMode = 'viewing';
    };

    addSpendingResult(result) {
        this.currentSpendingLog.expenditures.push(result);
    };
}

export default ModelService;