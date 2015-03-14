"use strict";

angular.module("pocketIkoma").service("insightService", function(_) {
    var calculate = function(model, countRankOneSkills) {
        var insight = 0;

        // Traits
        _.forEach(model.rings, function (ring) {
            insight += ring.getRank() * 10;
        });

        // Skills
        _.forEach(model.skills, function (skill) {
            var tmpVal = skill.rank;
            if (skill.rank === 1 && !countRankOneSkills) {
                tmpVal = 0;
            }

            insight += tmpVal;
        });

        // Masteries
        if (_.find(model.skills, {id: "etiquette", rank: 3})) {
            insight += 3;
        }

        if (_.find(model.skills, {id: "courtier", rank: 3})) {
            insight += 3;
        }

        model.characterInfo.insight = insight;
        model.characterInfo.insightRank = calculateRank(insight);
    };

    function calculateRank(insight) {
        var difference = insight - 150;
        var rank = 1;

        if (difference > 0) {
            rank += 1 + Math.floor(difference / 50);
        }

        return rank;
    }

    return {
        calculate: calculate
    };
});