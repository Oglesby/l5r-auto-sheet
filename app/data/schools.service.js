'use strict';

angular.module('pocketIkoma').service('schoolService', function(_, skillService, ringService) {
    var json = [{
        id: 'none',
        name: 'None',
        bonusTrait: '',
        description: '',
        clan: '*',
        startingHonor: 35,
        isBushi: false,
        isShugenja: false,
        isMonk: false,
        schoolSkills: []
    }, {
        id: 'hidaBushi',
        name: 'Hida Bushi',
        bonusTrait: 'Stamina',
        description: '',
        clan: 'Crab',
        startingHonor: 35,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        schoolSkills: [
            { name: 'athletics'},
            { name: 'defense'},
            { name: 'heavyWeapons', emphasis: 'Tetsubo'},
            { name: 'intimidation'},
            { name: 'kenjutsu'},
            { name: 'lore', choosing: 'Shadowlands'}
        ]
    }, {
        id: 'mirumotoBushi',
        name: 'Mirumoto Bushi',
        bonusTrait: 'Stamina',
        description: '',
        clan: 'Dragon',
        startingHonor: 45,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        schoolSkills: [
            { name: 'athletics'},
            { name: 'defense'},
            { name: 'kenjutsu', emphasis: 'Katana'},
            { name: 'meditation'},
            { name: 'iaijutsu'},
            { name: 'theology'},
            { name: 'lore', choosing: 'Shugenja'}
        ]
    }, {
        id: 'togashiMonk',
        name: 'Togashi Tattooed Order',
        bonusTrait: 'Void',
        description: '',
        clan: 'Dragon',
        startingHonor: 45,
        isBushi: false,
        isShugenja: false,
        isMonk: true,
        kihoCostModifier: 1.5,
        canTakeKiho: function(mastery, ringValue) {
            return mastery <= (ringValue + this.rank);
        },
        schoolSkills: [
            { name: 'athletics'},
            { name: 'defense'},
            { name: 'kenjutsu'},
            { name: 'jiujutsu'},
            { name: 'artisan', choosing: 'Tattoo'}
        ]
    }, {
        id: 'asahinaShugenja',
        name: 'Asahina Shugenja',
        bonusTrait: 'Awareness',
        description: '',
        clan: 'Crane',
        startingHonor: 65,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        affinity: 'air',
        deficiency: 'fire',
        schoolSkills: [
            { name: 'etiquette'},
            { name: 'courtier'},
            { name: 'calligraphy', emphasis: 'Cypher'},
            { name: 'meditation'},
            { name: 'spellcraft'},
            { name: 'lore', choosing: 'Theology'}
        ]
    }];

    function processJson(jsonArray) {
        var schools = {};

        jsonArray.forEach(function(schoolJson) {
            var school = schoolJson;
            school.visit = function (model, options) {
                model.schools = [
                    {
                        // TODO: this probably needs refactored somehow
                        type: this,
                        rank: 1,
                        isBushi: this.isBushi,
                        isShugenja: this.isShugenja,
                        isMonk: this.isMonk,
                        kihoCostModifier: this.kihoCostModifier,
                        canTakeKiho: this.canTakeKiho,
                        affinity: this.affinity,
                        deficiency: this.deficiency,
                        getAffinityDeficiencyModifier: function(spell) {
                            if (this.affinity === spell.ring) {
                                return 1;
                            } else if (this.deficiency === spell.ring) {
                                return -1;
                            } else {
                                return 0;
                            }
                        }
                    }
                ];
                var logEntries = [];

                var trait = this.bonusTrait.toLowerCase();
                var traitRing = ringService.findRingForTrait(trait, model);
                if (traitRing) {
                    traitRing.increaseTrait(model, trait);
                    logEntries.push({displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + traitRing.getTrait(trait).value});
                }

                // Add school skills
                this.schoolSkills.forEach(function(skillHolder) {
                    var skill = skillService[skillHolder.name];

                    var options = {schoolSkill: true};
                    var skillName = skill.name;
                    if (skillHolder.choosing) {
                        options.choosing = skillHolder.choosing;
                        skillName += ': ' + skillHolder.choosing;
                    }
                    logEntries.push({displayText: 'Spent 0 XP to increase ' + skillName + ' to 1'});

                    skill.increase(model, options);
                    if (skillHolder.emphasis) {
                        skill.addEmphasis(model, skill.emphasis);
                        logEntries.push({displayText: 'Spent 0 XP to gain ' + skillHolder.emphasis + ' for the ' + skillName + ' skill'});
                    }
                });

                // Add chosen school skills
                // TODO: This code should probably reuse the block above
                _.each(options.chosenSkills, function (skill) {
                    var options = _.extend({schoolSkill: true}, skill.options);
                    skillService[skill.id].increase(model, options);
                    logEntries.push({displayText: 'Spent 0 XP to increase ' + skill.name + ' to 1  (Chosen Skill)'});

                });

                // Set honor
                model.characterInfo.honor = this.startingHonor;

                // TODO Add outfit

                return logEntries;
            };
            schools[school.id] = school;
        });

        return schools;
    }

    return processJson(json);
});