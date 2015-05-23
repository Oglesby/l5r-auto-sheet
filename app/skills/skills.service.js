"use strict";

angular.module("pocketIkoma").service("skillService", function(_) {
    var Skill = function (id, name, description, availableEmphases) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.availableEmphases = availableEmphases;
        this.xpMult = 1;
        this.xpMod = 0;
    };
    Skill.prototype.increase = function (model, options) {
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
        return skill;
    };
    Skill.prototype.purchase = function (model, options, costOverride) {
        var skill = this.increase(model, options);
        var xpCost = _.isUndefined(costOverride) ? skill.rank : costOverride;

        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = skill.type.name;
        if (options && options.choosing) {
            description += ": " + options.choosing;
        }
        return {cost: xpCost, newValue: skill.rank, name: description};
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

        return skill;
    };
    Skill.prototype.purchaseEmphasis = function (model, emphasis, options) {
        var skill = this.addEmphasis(model, emphasis, options);
        var xpCost = 2;

        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var skillName = skill.type.name;
        if (options && options.choosing) {
            skillName += ": " + options.choosing;
        }
        return {cost: xpCost, name: emphasis, skill: skillName};
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
        "lore": new Skill("lore", "Lore", "", []),
        "iaijutsu": new Skill("iaijutsu", "Iaijutsu", "", ["Katana"]),
        "theology": new Skill("theology", "Theology", "", []),
        "meditation": new Skill("meditation", "Meditation", "", []),
        "games": new Skill("games", "Games", "", [])
    };
});