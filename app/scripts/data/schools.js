(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    window.l5rSchools = {
        "hida.bushi": {
            name: "Hida Bushi",
            bonusTrait: "Stamina",
            description: "",
            visit: function (model/*, options */) {
                model.schools = [
                    {
                        "type": this,
                        "rank": 1
                    }
                ];
                window.l5rTraits.stamina.purchase(model);

                // Add school skills
                window.l5rSkills.athletics.purchase(model, {schoolSkill: true});
                window.l5rSkills.defense.purchase(model, {schoolSkill: true});
                window.l5rSkills["heavy.weapons"].purchase(model, {schoolSkill: true});
                window.l5rSkills["heavy.weapons"].addEmphasis(model, "Tetsubo");
                window.l5rSkills.intimidation.purchase(model, {schoolSkill: true});
                window.l5rSkills.kenjutsu.purchase(model, {schoolSkill: true});
                window.l5rSkills.lore.purchase(model, {
                    schoolSkill: true,
                    choosing: "Shadowlands"
                });
                // TODO Plus one of your choice

                // Set honor
                model.characterInfo.honor = 35;

                // TODO Add outfit
            }
        }
    };
}());