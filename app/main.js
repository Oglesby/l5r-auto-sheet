"use strict";

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

angular.module("l5rAutoSheetApp")
    .constant("_", window._)
    .controller("L5rCharacterData", ["$scope", "$http", "$q", "_", "advantageService", "disadvantageService", "traitService",
        "familyService", "schoolService", "skillService", "kataService",
        function ($scope, $http, $q, _, advantageService, disadvantageService, traitService, familyService, schoolService, skillService,
                  kataService) {
        $scope.model = _.cloneDeep(baseModel);
        $scope.log = [];

        $http.get("data/hida_juzo_logs.json")
            .then(function (logEntries) {
                _.forEach(logEntries.data, function (logEntry) {
                    switch (logEntry.type) {
                        case "CREATION":
                            processCreationEntry(logEntry);
                            break;
                        case "CHARACTER_INFO":
                            processCharacterInfoEntry(logEntry);
                            break;
                        case "XP_EXPENDITURE":
                            processXpExpenditureEntry(logEntry);
                            break;
                    }
                });

                console.log($scope.model);
            });

        function processCreationEntry(logEntry) {
            var family = familyService[logEntry.family],
                school = schoolService[logEntry.school.id];

            $scope.model.characterInfo.xp = logEntry.initialXp;
            family.visit($scope.model);
            school.visit($scope.model, logEntry.school.options);

            var logEntryModel = {
                title: logEntry.title,
                comment: logEntry.comment,
                creationTimestamp: logEntry.creationTimestamp,
                logItems: [
                    "Set initial xp to " + logEntry.initialXp,
                    "Set family to " + family.name,
                    "Set school to " + school.name
                ]
            };

            $scope.log.push(logEntryModel);
        }

        function processCharacterInfoEntry(logEntry) {
            $scope.model.characterInfo.name = logEntry.name;

            var logEntryModel = {
                title: logEntry.title,
                comment: logEntry.comment,
                creationTimestamp: logEntry.creationTimestamp,
                logItems: [
                    "Set name to " + logEntry.name
                ]
            };

            $scope.log.push(logEntryModel);
        }

        function processXpExpenditureEntry(logEntry) {
            _.forEach(logEntry.expenditures, function (expenditure) {
                switch (expenditure.type) {
                    case "TRAIT":
                        traitService[expenditure.id].purchase($scope.model);
                        break;
                    case "SKILL":
                        skillService[expenditure.id].purchase($scope.model, expenditure.options);
                        break;
                    case "EMPHASIS":
                        skillService[expenditure.skillId].addEmphasis($scope.model, expenditure.emphasis, expenditure.options);
                        break;
                    case "ADVANTAGE":
                        advantageService[expenditure.id].purchase($scope.model, expenditure.options);
                        break;
                    case "DISADVANTAGE":
                        disadvantageService[expenditure.id].purchase($scope.model, expenditure.options);
                        break;
                    case "KATA":
                        kataService[expenditure.id].purchase($scope.model, expenditure.options);
                        break;
                }
            });

            var logEntryModel = {
                title: logEntry.title,
                comment: logEntry.comment,
                creationTimestamp: logEntry.creationTimestamp,
                logItems: [
                ]
            };

            $scope.log.push(logEntryModel);
        }
    }]);
