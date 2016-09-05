'use strict';

angular.module('pocketIkoma').service('logService',
    function($http, _, characterService, advantageService, disadvantageService, ringService, familyService, spellService,
             schoolService, skillService, kataService, kihoService, insightService, secondaryStatsService) {

    var getLogs = function(characterId) {
        var model = createBaseModel();

        return characterService.getLogs(characterId)
            .then(function (logEntries) {
                var log = processLogsIntoModel(model, logEntries.data);
                return {
                    model: model,
                    log: log
                };
            });
    };

    var processLogsIntoModel = function(model, logEntries) {
        var log = [];
        _.forEach(logEntries, function (logEntry) {
            switch (logEntry.type) {
                case 'CREATION':
                    log.push(processCreationEntry(logEntry, model));
                    break;
                case 'CHARACTER_INFO':
                    log.push(processCharacterInfoEntry(logEntry, model));
                    break;
                case 'XP_EXPENDITURE':
                    log.push(processXpExpenditureEntry(logEntry, model));
                    break;
                case 'MODULE_COMPLETION':
                    log.push(processModuleCompletionEntry(logEntry, model));
            }
        });

        insightService.calculate(model);
        secondaryStatsService.calculate(model);
        return log;
    };

    var createBaseModel = function() {
        var baseModel = {
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
            skills: []
        };

        return baseModel;
    };

    function makeCreationEntry(initialXp, familyId, schoolId) {
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

    function makeDifferentSchoolEntry() {
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

    function processCreationEntry(logEntry, model) {
        var family = familyService[logEntry.family],
            school = schoolService[logEntry.school.id];

        var logItems = [
            {
                displayText: 'Set initial xp to ' + logEntry.initialXp
            },
            {
                displayText: 'Set family to ' + family.name
            },
            {
                displayText: 'Set school to ' + school.name
            }
        ];

        model.characterInfo.xp = logEntry.initialXp;
        model.characterInfo.gainedXp = logEntry.initialXp;
        logItems = logItems.concat(family.visit(model));
        logItems = logItems.concat(school.visit(model, logEntry.school.options));

        return {
            title: 'Character Building - School and Family',
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: logItems
        };
    }

    function processCharacterInfoEntry(logEntry, model) {
        model.characterInfo.name = logEntry.name;

        return {
            title: 'Character Building - Basic Information',
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: [
                {
                    displayText: 'Set name to ' + logEntry.name
                }
            ]
        };
    }

    function processXpExpenditureEntry(logEntry, model) {
        var logItems = [];
        var n = 0;
        _.forEach(logEntry.expenditures, function (expenditure) {
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
            logItems.push({
                id: n++,
                displayText:displayText
            });
        });

        return {
            title: logEntry.title,
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: logItems
        };
    }

    function processModuleCompletionEntry(logEntry, model) {
        var logItems = [];
        var n = 0;

        handleCharInfoType('xp', logEntry, logItems, model, 1);
        handleCharInfoType('status', logEntry, logItems, model, 0.1);
        handleCharInfoType('glory', logEntry, logItems, model, 0.1);
        handleCharInfoType('honor', logEntry, logItems, model, 0.1);
        handleCharInfoType('taint', logEntry, logItems, model, 0.1);
        handleCharInfoType('infamy', logEntry, logItems, model, 0.1);

        _.forEach(logEntry.gains, function (expenditure) {
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
            logItems.push({
                id: n++,
                displayText:displayText
            });
        });

        return {
            title: 'Completed Module: ' + logEntry.name,
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: logItems
        };
    }

    function handleCharInfoType(type, logEntry, logItems, model, displayMult) {
        var reward = logEntry[type + 'Reward'] || 0;
        model.characterInfo[type] += reward;

        if (type === 'xp') {
            model.characterInfo.gainedXp += reward;
        }

        if (reward > 0) {
            logItems.push({displayText: 'Gained ' + reward * displayMult + ' ' + type});
        } else if (reward < 0) {
            logItems.push({displayText: 'Lost ' + reward * displayMult + ' ' + type});
        }
    }

    return {
        getLogs: getLogs,
        makeCreationEntry: makeCreationEntry,
        makeDifferentSchoolEntry: makeDifferentSchoolEntry,
        processLogsIntoModel: processLogsIntoModel,
        createBaseModel: createBaseModel
    };
});
