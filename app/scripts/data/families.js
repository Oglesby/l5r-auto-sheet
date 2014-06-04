(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    window.l5rFamilies = {
        "hida": {
            name: "Hida",
            bonusTrait: "Strength",
            description: "",
            visit: function (model) {
                window.l5rTraits.strength.purchase(model);
                model.characterInfo.family = this;
                model.characterInfo.clan = "Crab";
            }
        }
    };
}());