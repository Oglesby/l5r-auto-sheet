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
    .controller("l5rCharacterData", ["$scope", "$http", "$q", "_", function ($scope, $http, $q, _) {
        _.merge($scope, baseModel);
        $scope.log = [];

        $q.all($http.get("data/hida_juzo_logs.json"))
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

                console.log($scope);
            });

        function processCreationEntry(logEntry) {
            var family = window.l5rFamilies[logEntry.family],
                school = window.l5rSchools[logEntry.school];

            $scope.characterInfo.xp = logEntry.initialXp;
            family.visit($scope);
            school.visit($scope);

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
            $scope.characterInfo.name = logEntry.name;

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
                        window.l5rTraits[expenditure.id].purchase($scope);
                        break;
                    case "SKILL":
                        window.l5rSkills[expenditure.id].purchase($scope, expenditure.options);
                        break;
                    case "EMPHASIS":
                        window.l5rSkills[expenditure.skillId].addEmphasis($scope, expenditure.emphasis, expenditure.options);
                        break;
                    case "ADVANTAGE":
                        window.l5rAdvantages[expenditure.id].purchase($scope, expenditure.options);
                        break;
                    case "DISADVANTAGE":
                        window.l5rDisadvantages[expenditure.id].purchase($scope, expenditure.options);
                        break;
                    case "KATA":
                        window.l5rKatas[expenditure.id].purchase($scope, expenditure.options);
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
    }])
    .directive("l5rRingBlock", function () {
        return {
            restrict: "E",
            scope: {
                // TODO These should really be nested objects, but angular vomits on binding that
                ringIcon: "@",
                ringName: "@",
                ringRank: "=",
                spiritualTraitName: "@",
                spiritualTraitRank: "=",
                physicalTraitName: "@",
                physicalTraitRank: "="
            },
            templateUrl: "views/ring.block.html"
        };
    })
    .directive("l5rSkills", function () {
        return {
            restrict: "E",
            templateUrl: "views/skills.html"
        };
    })
    .directive("l5rAdvantages", function () {
        return {
            restrict: "E",
            templateUrl: "views/advantages.html"
        };
    })
    .directive("l5rDisadvantages", function () {
        return {
            restrict: "E",
            templateUrl: "views/disadvantages.html"
        };
    })
    .directive("l5rKatas", function () {
        return {
            restrict: "E",
            templateUrl: "views/katas.html"
        };
    })
    .directive("l5rLog", function () {
        return {
            restrict: "E",
            templateUrl: "views/log.html"
        };
    });
