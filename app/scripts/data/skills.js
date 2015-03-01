(function () {
    "use strict";

    angular.module("l5rAutoSheetApp").service("skillService", function(_) {
        var Skill = function (id, name, description, availableEmphases) {
            this.id = id;
            this.name = name;
            this.description = description;
            this.availableEmphases = availableEmphases;
        };
        Skill.prototype.purchase = function (model, options) {
            options = options || {};
            model.skills = model.skills || [];

            var id = this.id,
                skill = _.find(model.skills, function (item) {
                    return item.type && item.type.id === id && item.choosing === options.choosing;
                });

            if (!skill) {
                skill = {
                    "type": this,
                    "rank": 1,
                    "emphases": [],
                    "masteryAbilities": [],
                    "schoolSkill": !!options.schoolSkill
                };

                if (options.choosing) {
                    skill.choosing = options.choosing;
                }

                model.skills.push(skill);
            } else {
                skill.rank++;
            }
        };
        Skill.prototype.addEmphasis = function (model, emphasis, options) {
            options = options || {};
            var id = this.id,
                skill = _.find(model.skills, function (item) {
                    return item.type && item.type.id === id && item.choosing === options.choosing;
                });

            if (!skill) {
                // TODO Throw error
                console.log("couldn't find skill with ID " + id + " for requested emphasis");
            } else {
                skill.emphases.push(emphasis);
            }
        };

        return {
            "athletics": new Skill("athletics", "Athletics", "", []),
            "battle": new Skill("battle", "Battle", "", []),
            "defense": new Skill("defense", "Defense", "", []),
            "etiquette": new Skill("etiquette", "Etiquette", "", []),
            "heavy.weapons": new Skill("heavy.weapons", "Heavy Weapons", "", []),
            "hunting": new Skill("hunting", "Hunting", "", []),
            "intimidation": new Skill("intimidation", "Intimidation", "", []),
            "jiujutsu": new Skill("jiujutsu", "Jiujutsu", "", []),
            "kenjutsu": new Skill("kenjutsu", "Kenjutsu", "", []),
            "knives": new Skill("knives", "Knives", "", []),
            "horsemanship": new Skill("horsemanship", "Horsemanship", "", []),
            "investigation": new Skill("investigation", "Investigation", "", []),
            "lore": new Skill("lore", "Lore", "", [])
        };
    });
}());