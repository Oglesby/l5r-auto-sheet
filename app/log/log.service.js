"use strict";

angular.module("pocketIkoma").service("logService",
    function($http, _, advantageService, disadvantageService, ringService, familyService,
             schoolService, skillService, kataService) {

    var baseModel = {
        "rings": {
            "earth": ringService.earth,
            "water": ringService.water,
            "fire": ringService.fire,
            "air": ringService.air,
            "void": ringService.void
        },
        "characterInfo": {
            "glory": 10,
            "honor": 10,
            "status": 10,
            "taint": 0,
            "shadowRank": 0
        }
    };

    var getLogs = function(model, log) {
        return $http.get("data/hida_juzo_logs.json")
            .then(function (logEntries) {
                _.forEach(logEntries.data, function (logEntry) {
                    switch (logEntry.type) {
                        case "CREATION":
                            log.push(processCreationEntry(logEntry, model));
                            break;
                        case "CHARACTER_INFO":
                            log.push(processCharacterInfoEntry(logEntry, model));
                            break;
                        case "XP_EXPENDITURE":
                            log.push(processXpExpenditureEntry(logEntry, model));
                            break;
                    }
                });
            });
    };

    var getBaseModel = function() {
        return baseModel;
    };

    function processCreationEntry(logEntry, model) {
        var family = familyService[logEntry.family],
            school = schoolService[logEntry.school.id];

        var logItems = [
            {
                displayText: "Set initial xp to " + logEntry.initialXp
            },
            {
                displayText: "Set family to " + family.name
            },
            {
                displayText: "Set school to " + school.name
            }
        ];

        model.characterInfo.xp = logEntry.initialXp;
        logItems = logItems.concat(family.visit(model));
        logItems = logItems.concat(school.visit(model, logEntry.school.options));

        return {
            title: "Character Building - School and Family",
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: logItems
        };
    }

    function processCharacterInfoEntry(logEntry, model) {
        model.characterInfo.name = logEntry.name;

        return {
            title: "Character Building - Basic Information",
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: [
                {
                    displayText: "Set name to " + logEntry.name
                }
            ]
        };
    }

    function processXpExpenditureEntry(logEntry, model) {
        var logItems = [];
        _.forEach(logEntry.expenditures, function (expenditure) {
            var cost = "???";
            var n = 0;
            switch (expenditure.type) {
                case "TRAIT":
                    var result = ringService.findRingForTrait(expenditure.id).purchase(model, expenditure.id);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + result.cost + " XP to raise trait " + result.name + " to " + result.newValue
                    });
                    break;
                case "SKILL":
                    result = skillService[expenditure.id].purchase(model, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + result.cost + " XP to raise skill " + result.name + " to " + result.newValue
                    });
                    break;
                case "EMPHASIS":
                    skillService[expenditure.skillId].addEmphasis(model, expenditure.emphasis, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + cost + " XP to gain " + expenditure.id
                    });
                    break;
                case "ADVANTAGE":
                    advantageService[expenditure.id].purchase(model, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + cost + " XP to gain " + expenditure.id
                    });
                    break;
                case "DISADVANTAGE":
                    disadvantageService[expenditure.id].purchase(model, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Gained " + cost + " XP from " + expenditure.id
                    });
                    break;
                case "KATA":
                    kataService[expenditure.id].purchase(model, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + cost + " XP to gain " + expenditure.id
                    });
                    break;
            }
        });

        return {
            title: logEntry.title,
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: logItems
        };
    }

    return {
        getLogs: getLogs,
        getBaseModel: getBaseModel
    };
});
