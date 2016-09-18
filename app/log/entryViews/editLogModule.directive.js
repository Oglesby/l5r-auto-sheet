'use strict';

angular.module('pocketIkoma').directive('piEditLogModule', function () {

    var EditLogModuleController = function (_, $, $scope, $timeout, $location, $anchorScroll, $state, logService, modelService) {
        $scope.xp = 2;
        $scope.gloryChange = 0;
        $scope.honorChange = 0;
        $scope.statusChange = 0;
        $scope.infamyChange = 0;
        $scope.taintChange = 0;
        $scope.shadowChange = 0;
        $scope.moduleName = '';
        $scope.moduleNumber = '';
        // TODO: GM name?

        // TODO: Move into link function.
        $timeout(function() {
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

        $scope.favors = [];
        $scope.favorParams = [{
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
        $scope.favorPrototype = {
            type: 'ADVANTAGE',
            id: 'favor',
            cost: 0,
            options: {
                choosing: '',
                rank: 1
            }
        };
        $scope.favorValidation = {
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

        $scope.getFavorDisplayText = function(favor) {
            return favor.options.choosing + ' (Rank ' + favor.options.rank + ')';
        };

        $scope.allies = [];
        $scope.allyParams = [{
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
        $scope.allyPrototype = {
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
        $scope.allyValidation = {
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

        $scope.getAllyDisplayText = function(ally) {
            return ally.options.choosing + ' (Influence ' + ally.options.influence + ', Devotion ' + ally.options.devotion + ')';
        };

        $scope.enemies = [];
        $scope.enemyParams = [{
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
        $scope.enemyPrototype = {
            type: 'DISADVANTAGE',
            id: 'swornEnemy',
            cost: 0,
            options: {
                choosing: '',
                rank: 1
            }
        };
        $scope.enemyValidation = {
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

        $scope.getEnemyDisplayText = function(enemy) {
            return enemy.options.choosing + ' (Rank ' + enemy.options.rank + ')';
        };

        $scope.save = function() {
            // TODO: Move into link function.
            var form = $('.ui.module.form');
            form.form('validate form');

            if (!form.form('is valid')) {
                return;
            }

            // TODO: Add module number
            var logModuleEntry = logService.makeModuleCompletionLogModel($scope.moduleName, $scope.xp, $scope.honorChange,
                $scope.gloryChange, $scope.statusChange, $scope.infamyChange, $scope.taintChange, $scope.shadowChange);
            logModuleEntry.creationTimestamp = new Date().toISOString();
            Array.prototype.push.apply(logModuleEntry.gains, $scope.favors);
            Array.prototype.push.apply(logModuleEntry.gains, $scope.allies);
            Array.prototype.push.apply(logModuleEntry.gains, $scope.enemies);

            if ($scope.onSave) {
                $scope.onSave();
            } else {
                modelService.addLogToModel(logModuleEntry);
                $state.go('^');
            }
        };

        $scope.cancel = function() {
            if ($scope.onCancel) {
                $scope.onCancel();
            } else {
                $state.go('^');
            }
        };
    };

    return {
        restrict: 'E',
        templateUrl: 'log/entryViews/editLogModule.html',
        scope: {
            model: '=',
            onSave: '=',
            onCancel: '='
        },
        controller: EditLogModuleController
    };
});