'use strict';

import $ from 'jquery';

class AddEditLogModuleComponentController {

    constructor($timeout, $location, $anchorScroll, $state, logService, modelService) {
        this.$state = $state;
        this.logService = logService;
        this.modelService = modelService;

        // TODO: Move into link function.
        $timeout(() => {
            $location.hash('new-log');
            $anchorScroll();

            $('.ui.module.form').form({
                fields: {
                    xp: {
                        identifier: 'xp',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter your gained XP.'
                        }]
                    },
                    moduleName: {
                        identifier: 'module-name',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter the module name.'
                        }]
                    },
                    moduleNumber: {
                        identifier: 'module-number',
                        rules: [{
                            type: 'empty',
                            prompt: 'Please enter the module number.'
                        }]
                    }
                }
            });
        });
    }

    $onInit() {
        // TODO: GM name?
        if (!this.logModel) {
            this.xp = 2;
            this.gloryChange = 0;
            this.honorChange = 0;
            this.statusChange = 0;
            this.infamyChange = 0;
            this.taintChange = 0;
            this.shadowChange = 0;
            this.moduleName = '';
            this.moduleNumber = '';
        } else {
            this.xp = this.logModel.xpReward;
            this.gloryChange = (this.logModel.gloryReward ? this.logModel.gloryReward : 0) / 10;
            this.honorChange = (this.logModel.honorReward ? this.logModel.honorReward : 0) / 10;
            this.statusChange = (this.logModel.statusChange ? this.logModel.statusChange : 0) / 10;
            this.infamyChange = (this.logModel.infamyChange ? this.logModel.infamyChange : 0) / 10;
            this.taintChange = (this.logModel.taintChange ? this.logModel.taintChange : 0) / 10;
            this.shadowChange = (this.logModel.shadowChange ? this.logModel.shadowChange : 0) / 10;
            this.moduleName = this.logModel.name ? this.logModel.name : '';
            this.moduleNumber = this.logModel.number ? this.logModel.number : '';
        }

        this.favors = [];
        this.favorParams = [{
            id: 'favor-from',
            name: 'Favor From',
            type: 'text',
            modelPath: ['options', 'choosing']
        }, {
            id: 'rank',
            name: 'Rank',
            type: 'number',
            modelPath: ['options', 'rank'],
            min: 1,
            max: 3
        }];
        this.favorPrototype = {
            type: 'ADVANTAGE',
            id: 'favor',
            cost: 0,
            options: {
                choosing: '',
                rank: 1
            }
        };
        this.favorValidation = {
            fields: {
                from: {
                    identifier: 'favor-from',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter an origin for the favor.'
                    }]
                },
                rank: {
                    identifier: 'rank',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a rank.'
                    }]
                }
            }
        };

        this.allies = [];
        this.allyParams = [{
            id: 'ally-name',
            name: 'Ally Name',
            type: 'text',
            modelPath: ['options', 'choosing']
        }, {
            id: 'influence',
            name: 'Influence',
            type: 'number',
            modelPath: ['options', 'influence'],
            min: 0,
            max: 10
        }, {
            id: 'devotion',
            name: 'Devotion',
            type: 'number',
            modelPath: ['options', 'devotion'],
            min: 0,
            max: 10
        }];
        this.allyPrototype = {
            type: 'ADVANTAGE',
            id: 'ally',
            cost: 0,
            options: {
                choosing: '',
                influence: 0,
                devotion: 0,
                rank: 1
            }
        };
        this.allyValidation = {
            fields: {
                allyName: {
                    identifier: 'ally-name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a name for the ally.'
                    }]
                },
                influence: {
                    identifier: 'influence',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter an influence for the ally.'
                    }]
                },
                devotion: {
                    identifier: 'devotion',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a devotion for the ally.'
                    }]
                }
            }
        };

        this.enemies = [];
        this.enemyParams = [{
            id: 'enemy-name',
            name: 'Enemy Name',
            type: 'text',
            modelPath: ['options', 'choosing']
        }, {
            id: 'rank',
            name: 'Rank',
            type: 'number',
            modelPath: ['options', 'rank'],
            min: 1,
            max: 3
        }];
        this.enemyPrototype = {
            type: 'DISADVANTAGE',
            id: 'swornEnemy',
            cost: 0,
            options: {
                choosing: '',
                rank: 1
            }
        };
        this.enemyValidation = {
            fields: {
                enemyName: {
                    identifier: 'enemy-name',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a name for the enemy.'
                    }]
                },
                enemyRank: {
                    identifier: 'rank',
                    rules: [{
                        type: 'empty',
                        prompt: 'Please enter a rank for the enemy.'
                    }]
                }
            }
        };
    }



    getFavorDisplayText(favor) {
        return favor.options.choosing + ' (Rank ' + favor.options.rank + ')';
    }

    getAllyDisplayText(ally) {
        return ally.options.choosing + ' (Influence ' + ally.options.influence + ', Devotion ' + ally.options.devotion + ')';
    };

    getEnemyDisplayText(enemy) {
        return enemy.options.choosing + ' (Rank ' + enemy.options.rank + ')';
    };

    save() {
        // TODO: Move into link function.
        let form = $('.ui.module.form');
        form.form('validate form');

        if (!form.form('is valid')) {
            return;
        }

        // TODO: Add module number
        let logModuleLogModel= this.logService.makeModuleCompletionLogModel(this.moduleName, this.moduleNumber,
            this.xp, this.honorChange, this.gloryChange, this.statusChange, this.infamyChange,
            this.taintChange, this.shadowChange);
        Array.prototype.push.apply(logModuleLogModel.gains, this.favors);
        Array.prototype.push.apply(logModuleLogModel.gains, this.allies);
        Array.prototype.push.apply(logModuleLogModel.gains, this.enemies);

        if (this.logModel) {
            logModuleLogModel.creationTimestamp = this.logModel.creationTimestamp;
            logModuleLogModel.id = this.logModel.id;
        } else {
            logModuleLogModel.creationTimestamp = new Date().toISOString();
        }

        if (this.onSave) {
            this.onSave(logModuleLogModel);
        } else {
            this.modelService.addLogToModel(logModuleLogModel);
            this.$state.go('^');
        }
    };

    cancel() {
        if (this.onCancel) {
            this.onCancel();
        } else {
            this.$state.go('^');
        }
    };
}

let AddEditLogModuleComponent = {
    bindings: {
        logModel: '=',
        onSave: '=',
        onCancel: '='
    },
    controller: AddEditLogModuleComponentController,
    templateUrl: 'log/entryViews/addEditLogModule.html'
};

export default AddEditLogModuleComponent;
