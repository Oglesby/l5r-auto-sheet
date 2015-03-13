"use strict";

angular.module("pocketIkoma").service("familyService", function(traitService) {
    return {
        "hida": {
            name: "Hida",
            bonusTrait: "Strength",
            description: "",
            visit: function (model) {
                traitService.strength.purchase(model);
                model.characterInfo.family = this;
                model.characterInfo.clan = "Crab";
            }
        }
    };
});
