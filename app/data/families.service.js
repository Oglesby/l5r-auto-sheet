"use strict";

angular.module("pocketIkoma").service("familyService", function(ringService) {
    return {
        "hida": {
            name: "Hida",
            bonusTrait: "Strength",
            description: "",
            visit: function (model) {
                ringService.water.increaseTrait(model, "strength");
                model.characterInfo.family = this;
                model.characterInfo.clan = "Crab";

                return [{displayText: "Spent 0 XP to increase Strength to " + ringService.water.physicalTrait.value}];
            }
        }
    };
});
