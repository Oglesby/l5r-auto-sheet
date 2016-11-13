'use strict';

angular.module('pocketIkoma').service('logService', function(_, advantageService, disadvantageService, ringService,
    familyService, clanService, spellService, schoolService, skillService, kataService, kihoService, insightService,
    secondaryStatsService) {

    function ensureLogModelHasId(logModel) {
        if (logModel.id) {
            return;
        }

        /*jslint bitwise: true */
        // TODO: Replace this with a better UUID generation than one ripped from SO.
        logModel.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random()*16 | 0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        /*jslint bitwise: false */
    }

    function createLogView(title, logModel, recordItems) {
        return {
            logModel: logModel,
            title: title,
            type: logModel.type,
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: recordItems,
            invalidReasons: []
        };
    }

    function makeCreationLogModel(initialXp, clanId, familyId, school, differentSchool) {
        var creationLogModel = {
            type: 'CREATION',
            initialXp: initialXp,
            clan: clanId ? clanId.toLowerCase() : 'none',
            family: familyId ? familyId.toLowerCase() : 'none',
            school: school,
            mandatoryExpenditures: [],
            creationTimestamp: null
        };

        if (differentSchool) {
            creationLogModel.mandatoryExpenditures.push({
                type: 'ADVANTAGE',
                id: 'differentSchool'
            });
        }

        ensureLogModelHasId(creationLogModel);
        return creationLogModel;
    }

    function makeCharacterDetailsLogModel(name, description) {
        var characterDetailLogModel = {
            type: 'CHARACTER_INFO',
            name: name,
            description: description,
            creationTimestamp: null
        };

        ensureLogModelHasId(characterDetailLogModel);
        return characterDetailLogModel;
    }

    function makeModuleCompletionLogModel(moduleName, moduleNumber, xp, honorChange, gloryChange, statusChange, infamyChange, taintChange, shadowChange) {
        var moduleCompletionLogModel = {
            type: 'MODULE_COMPLETION',
            name: moduleName,
            number: moduleNumber,
            xpReward: xp,
            gloryReward: gloryChange * 10,
            honorReward: honorChange * 10,
            statusChange: statusChange * 10,
            infamyChange: infamyChange * 10,
            taintChange: taintChange * 10,
            shadowChange: shadowChange * 10,
            creationTimestamp: null,
            gains: []
        };

        ensureLogModelHasId(moduleCompletionLogModel);
        return moduleCompletionLogModel;
    }

    function makeXpExpenditureLogModel(name) {
        var xpExpenditureLogModel = {
            type: 'XP_EXPENDITURE',
            name: name,
            expenditures: []
        };

        ensureLogModelHasId(xpExpenditureLogModel);
        return xpExpenditureLogModel;
    }

    function processIndividualExpenditure(expenditure, model) {
        var displayText = '';
        switch (expenditure.type) {
            case 'TRAIT':
                var result = ringService.findRingForTrait(expenditure.id, model).purchase(model, expenditure.id);
                displayText = 'Spent ' + result.cost + ' XP to raise trait ' + result.name + ' to ' + result.newValue;
                break;
            case 'SKILL':
                result = skillService[expenditure.id].purchase(model, expenditure.options, expenditure.cost);
                displayText = 'Spent ' + result.cost + ' XP to raise skill ' + result.name + ' to ' + result.newValue;
                break;
            case 'EMPHASIS':
                result = skillService[expenditure.skillId].purchaseEmphasis(model, expenditure.emphasis, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name + ' emphasis for the ' + result.skillName + ' skill';
                break;
            case 'ADVANTAGE':
                result = advantageService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'DISADVANTAGE':
                result = disadvantageService[expenditure.id].purchase(model, expenditure.options);
                displayText ='Gained ' + result.cost + ' XP from ' + result.name;
                break;
            case 'KATA':
                result = kataService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'KIHO':
                result = kihoService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'SPELL':
                result = spellService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
        }

        var invalidReasons = [];
        invalidReasons = invalidReasons.concat(result.invalidReasons);
        if (expenditure.comment) {
            displayText += ' (' + expenditure.comment + ')';
        }
        return { displayText: displayText, invalidReasons: invalidReasons };
    }

    function processCreationLogModel(logModel, model) {
        var clan = clanService[logModel.clan];
        var family = familyService[logModel.family];
        var school = schoolService[logModel.school.id];

        var recordItems = [
            {
                displayText: 'Set initial xp to ' + logModel.initialXp
            }
        ];

        model.characterInfo.xp = logModel.initialXp;
        model.characterInfo.gainedXp = logModel.initialXp;
        recordItems = recordItems.concat(clan.visit(model));
        if (family) {
            recordItems = recordItems.concat(family.visit(model));
        }
        if (school) {
            recordItems = recordItems.concat(school.visit(model, logModel.school.options));
        }

        var n = 0;
        _.forEach(logModel.mandatoryExpenditures, function (expenditure) {
            recordItems.push({
                id: n++,
                displayText: processIndividualExpenditure(expenditure, model)
            });
        });

        return createLogView('Character Building - School and Family', logModel, recordItems);
    }

    function processCharacterInfoLogModel(logModel, model) {
        model.characterInfo.name = logModel.name;
        model.characterInfo.description = logModel.description;

        return createLogView('Character Building - Basic Information', logModel, [{
            displayText: 'Set name to ' + logModel.name
        }]);
    }

    function processXpExpenditureLogModel(logModel, model) {
        var recordItems = [];
        var invalidReasons = [];
        var n = 0;
        _.forEach(logModel.expenditures, function (expenditure) {
            var results = processIndividualExpenditure(expenditure, model);

            recordItems.push({
                id: n++,
                displayText: results.displayText
            });

            invalidReasons = invalidReasons.concat(results.invalidReasons);
        });

        var log = createLogView(logModel.name, logModel, recordItems);
        if (!log.isHouseruled) {
            log.invalidReasons = invalidReasons;
        }
        return log;
    }

    function handleCharInfoType(type, logModel, recordItems, model, displayMult) {
        var reward = logModel[type + 'Reward'] || 0;
        model.characterInfo[type] += reward;

        if (type === 'xp') {
            model.characterInfo.gainedXp += reward;
        }

        if (reward > 0) {
            recordItems.push({displayText: 'Gained ' + reward * displayMult + ' ' + type});
        } else if (reward < 0) {
            recordItems.push({displayText: 'Lost ' + reward * displayMult + ' ' + type});
        }
    }

    function processModuleCompletionLogModel(logModel, model) {
        var recordItems = [];
        var n = 0;

        handleCharInfoType('xp', logModel, recordItems, model, 1);
        handleCharInfoType('status', logModel, recordItems, model, 0.1);
        handleCharInfoType('glory', logModel, recordItems, model, 0.1);
        handleCharInfoType('honor', logModel, recordItems, model, 0.1);
        handleCharInfoType('taint', logModel, recordItems, model, 0.1);
        handleCharInfoType('infamy', logModel, recordItems, model, 0.1);

        _.forEach(logModel.gains, function (expenditure) {
            var displayText = '';
            switch (expenditure.type) {
                case 'TRAIT':
                    var trait = ringService.findRingForTrait(expenditure.id, model).increaseTrait(model, expenditure.id);
                    displayText = 'Spent 0 XP to raise trait ' + trait.name + ' to ' + trait.value;
                    break;
                case 'SKILL':
                    var skill = skillService[expenditure.id].increase(model, expenditure.options);
                    displayText = 'Spent 0 XP to raise skill ' + skill.type.name + ' to ' + skill.rank;
                    break;
                case 'EMPHASIS':
                    skill = skillService[expenditure.skillId].addEmphasis(model, expenditure.emphasis, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + expenditure.emphasis + ' emphasis for the ' + skill.name + ' skill';
                    break;
                case 'ADVANTAGE':
                    var options = expenditure.options;
                    var advantage = advantageService[expenditure.id].gain(model, options);
                    displayText = 'Spent 0 XP to gain ' + advantage.type.name;
                    displayText = (options && options.choosing) ? displayText + ': ' + options.choosing : displayText;
                    break;
                case 'DISADVANTAGE':
                    options = expenditure.options;
                    var disadvantage = disadvantageService[expenditure.id].gain(model, options);
                    displayText ='Gained 0 XP from ' + disadvantage.type.name;
                    displayText = (options && options.choosing) ? displayText + ': ' + options.choosing : displayText;
                    break;
                case 'KATA':
                    var kata = kataService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + kata.name;
                    break;
                case 'KIHO':
                    var kiho = kihoService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + kiho.name;
                    break;
                case 'SPELL':
                    var spell = spellService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + spell.name;
            }

            if (expenditure.comment) {
                displayText += ' (' + expenditure.comment + ')';
            }
            recordItems.push({
                id: n++,
                displayText:displayText
            });
        });

        return createLogView('Completed Module: ' + logModel.name + (logModel.number ? ' (' + logModel.number + ')' : ''), logModel, recordItems);
    }

    var processLogsIntoModel = function(model, logModels) {
        var logViews = [];
        _.forEach(logModels, function (logModel) {
            ensureLogModelHasId(logModel);

            switch (logModel.type) {
                case 'CREATION':
                    logViews.push(processCreationLogModel(logModel, model));
                    break;
                case 'CHARACTER_INFO':
                    logViews.push(processCharacterInfoLogModel(logModel, model));
                    break;
                case 'XP_EXPENDITURE':
                    logViews.push(processXpExpenditureLogModel(logModel, model));
                    break;
                case 'MODULE_COMPLETION':
                    logViews.push(processModuleCompletionLogModel(logModel, model));
            }
        });

        insightService.calculate(model);
        secondaryStatsService.calculate(model);
        model.logViews = model.logViews.concat(logViews);
    };

    return {
        makeCreationLogModel: makeCreationLogModel,
        makeCharacterDetailsLogModel: makeCharacterDetailsLogModel,
        makeModuleCompletionLogModel: makeModuleCompletionLogModel,
        makeXpExpenditureLogModel: makeXpExpenditureLogModel,
        processLogsIntoModel: processLogsIntoModel
    };
});
