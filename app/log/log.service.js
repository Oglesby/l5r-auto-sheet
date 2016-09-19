'use strict';

angular.module('pocketIkoma').service('logService', function(_, advantageService, disadvantageService, ringService,
    familyService, spellService, schoolService, skillService, kataService, kihoService, insightService,
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

    function makeCreationLogModel(initialXp, familyId, schoolId) {
        return {
            type: 'CREATION',
            initialXp: initialXp,
            family: familyId ? familyId.toLowerCase() : 'none',
            school: {
                id: schoolId ? schoolId : 'none',
                options: {}
            },
            creationTimestamp: null
        };
    }

    function makeDifferentSchoolLogModel() {
        return {
            'type': 'XP_EXPENDITURE',
            'title': 'Character Building - Initial Different School',
            'expenditures': [
                {
                    'type': 'ADVANTAGE',
                    'id': 'differentSchool'
                }
            ],
            'creationTimestamp': null
        };
    }

    function makeModuleCompletionLogModel(moduleName, moduleNumber, xp, honorChange, gloryChange, statusChange, infamyChange, taintChange, shadowChange) {
        return {
            'type': 'MODULE_COMPLETION',
            'name': moduleName,
            'number': moduleNumber,
            'xpReward': xp,
            'gloryReward': gloryChange * 10,
            'honorReward': honorChange * 10,
            'statusChange': statusChange * 10,
            'infamyChange': infamyChange * 10,
            'taintChange': taintChange * 10,
            'shadowChange': shadowChange * 10,
            'creationTimestamp': null,
            'gains': []
        };
    }

    function processCreationLogModel(logModel, model) {
        var family = familyService[logModel.family],
            school = schoolService[logModel.school.id];

        var recordItems = [
            {
                displayText: 'Set initial xp to ' + logModel.initialXp
            },
            {
                displayText: 'Set family to ' + family.name
            },
            {
                displayText: 'Set school to ' + school.name
            }
        ];

        model.characterInfo.xp = logModel.initialXp;
        model.characterInfo.gainedXp = logModel.initialXp;
        recordItems = recordItems.concat(family.visit(model));
        recordItems = recordItems.concat(school.visit(model, logModel.school.options));

        return {
            logModel: logModel,
            title: 'Character Building - School and Family',
            type: 'CREATION',
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: recordItems
        };
    }

    function processCharacterInfoLogModel(logModel, model) {
        model.characterInfo.name = logModel.name;

        return {
            logModel: logModel,
            title: 'Character Building - Basic Information',
            type: 'CHARACTER_INFO',
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: [
                {
                    displayText: 'Set name to ' + logModel.name
                }
            ]
        };
    }

    function processXpExpenditureLogModel(logModel, model) {
        var recordItems = [];
        var n = 0;
        _.forEach(logModel.expenditures, function (expenditure) {
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

            if (expenditure.comment) {
                displayText += ' (' + expenditure.comment + ')';
            }
            recordItems.push({
                id: n++,
                displayText: displayText
            });
        });

        return {
            logModel: logModel,
            title: logModel.title,
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: recordItems
        };
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

        return {
            logModel: logModel,
            title: 'Completed Module: ' + logModel.name + (logModel.number ? ' (' + logModel.number + ')' : ''),
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: recordItems
        };
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
        model.logViews = logViews;
    };

    var createBaseModel = function(modelObj) {
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
    };

    return {
        makeCreationLogModel: makeCreationLogModel,
        makeDifferentSchoolLogModel: makeDifferentSchoolLogModel,
        makeModuleCompletionLogModel: makeModuleCompletionLogModel,
        processLogsIntoModel: processLogsIntoModel,
        createBaseModel: createBaseModel
    };
});
