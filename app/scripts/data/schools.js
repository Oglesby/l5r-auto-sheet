(function () {
    "use strict";

    angular.module("l5rAutoSheetApp").service("schoolService", function(traitService, skillService, _) {
        return {
            "hida.bushi": {
                name: "Hida Bushi",
                bonusTrait: "Stamina",
                description: "",
                visit: function (model, options) {
                    model.schools = [
                        {
                            "type": this,
                            "rank": 1
                        }
                    ];
                    traitService.stamina.purchase(model);

                    // Add school skills
                    skillService.athletics.purchase(model, {schoolSkill: true});
                    skillService.defense.purchase(model, {schoolSkill: true});
                    skillService["heavy.weapons"].purchase(model, {schoolSkill: true});
                    skillService["heavy.weapons"].addEmphasis(model, "Tetsubo");
                    skillService.intimidation.purchase(model, {schoolSkill: true});
                    skillService.kenjutsu.purchase(model, {schoolSkill: true});
                    skillService.lore.purchase(model, {
                        schoolSkill: true,
                        choosing: "Shadowlands"
                    });
                    _.each(options.chosenSkills, function (skill) {
                        var options = _.extend({schoolSkill: true}, skill.options);
                        skillService[skill.id].purchase(model, options);
                    });

                    // Set honor
                    model.characterInfo.honor = 35;

                    // TODO Add outfit
                }
            }
        };
    });
}());