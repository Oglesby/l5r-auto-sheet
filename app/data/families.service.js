"use strict";

angular.module("pocketIkoma").service("familyService", function(ringService) {
    return {
        "hida": {
            name: "Hida",
            bonusTrait: "Strength",
            description: "",
            visit: function (model) {
                ringService.water.purchase(model, "strength");
                model.characterInfo.family = this;
                model.characterInfo.clan = "Crab";
            }
        }
    };
});
