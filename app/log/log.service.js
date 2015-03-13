"use strict";

angular.module("pocketIkoma").service("logService",
    function($http, _, advantageService, disadvantageService, traitService, familyService,
             schoolService, skillService, kataService) {

    var baseModel = {
        "rings": {
            "earth": 2,
            "water": 2,
            "fire": 2,
            "air": 2,
            "void": 2
        },
        "traits": {
            "stamina": 2,
            "willpower": 2,
            "strength": 2,
            "perception": 2,
            "agility": 2,
            "intelligence": 2,
            "reflexes": 2,
            "awareness": 2
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

        model.characterInfo.xp = logEntry.initialXp;
        family.visit(model);
        school.visit(model, logEntry.school.options);

        return {
            title: "Character Building - School and Family",
            comment: logEntry.comment,
            creationTimestamp: logEntry.creationTimestamp,
            logItems: [
                {
                    displayText: "Set initial xp to " + logEntry.initialXp
                },
                {
                    displayText: "Set family to " + family.name
                },
                {
                    displayText: "Set school to " + school.name
                }
            ]
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
                    traitService[expenditure.id].purchase(model);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + cost + " XP to raise trait " + expenditure.id + " to ???"
                    });
                    break;
                case "SKILL":
                    skillService[expenditure.id].purchase(model, expenditure.options);
                    logItems.push({
                        id: n++,
                        displayText: "Spent " + cost + " XP to raise skill " + expenditure.id + " to ???"
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
