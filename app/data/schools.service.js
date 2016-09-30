'use strict';

angular.module('pocketIkoma').service('schoolService', function(_, skillService, ringService) {
    var json = [{
        id: 'none',
        name: 'None',
        bonusTrait: '',
        description: '',
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
        startingHonor: 35,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        schoolSkills: [
            { id: 'athletics'},
            { id: 'defense'},
            { id: 'heavyWeapons', options: { emphasis: 'Tetsubo'} },
            { id: 'intimidation'},
            { id: 'kenjutsu'},
            { id: 'lore', options: { choosing: 'Shadowlands'} }
        ],
        choices: [{
            type: 'skill',
            keywords: ['bugei']
        }]
    }, {
        id: 'mirumotoBushi',
        name: 'Mirumoto Bushi',
        bonusTrait: 'Stamina',
        description: '',
        startingHonor: 45,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        schoolSkills: [
            { id: 'athletics'},
            { id: 'defense'},
            { id: 'kenjutsu', options: { emphasis: 'Katana'} },
            { id: 'meditation'},
            { id: 'theology'},
            { id: 'lore', options: {choosing: 'Shugenja'} }
        ],
        choices: [{
            type: 'skill',
            keywords: ['bugei', 'high']
        }]
    }, {
        id: 'togashiMonk',
        name: 'Togashi Tattooed Order',
        bonusTrait: 'Void',
        description: '',
        startingHonor: 45,
        isBushi: false,
        isShugenja: false,
        isMonk: true,
        kihoCostModifier: 1.5,
        canTakeKiho: function(mastery, ringValue) {
            return mastery <= (ringValue + this.rank);
        },
        schoolSkills: [
            { id: 'athletics'},
            { id: 'defense'},
            { id: 'jiujutsu'},
            { id: 'meditation'},
            { id: 'artisan', options: { choosing: 'Tattoo' } }
        ],
        choices: [{
            type: 'skill',
            id: 'lore'
        }, {
            type: 'skill',
            restrictedKeywords: ['low']
        }]
    }, {
        id: 'asahinaShugenja',
        name: 'Asahina Shugenja',
        bonusTrait: 'Awareness',
        description: '',
        startingHonor: 65,
        isBushi: true,
        isShugenja: false,
        isMonk: false,
        affinity: 'air',
        deficiency: 'fire',
        schoolSkills: [
            { id: 'etiquette'},
            { id: 'calligraphy', options: { emphasis: 'Cypher'} },
            { id: 'meditation'},
            { id: 'spellcraft'},
            { id: 'lore', options: { choosing: 'Theology'} }
        ],
        choices: [{
            type: 'skill',
            id: 'artisan'
        }, {
            type: 'skill',
            keywords: ['high']
        }]
    }];

    function processJson(jsonArray) {
        var schools = {};

        jsonArray.forEach(function(schoolJson) {
            var school = schoolJson;

            var processSkillHolder = function(skillHolder, model, logEntries) {
                var skill = skillService[skillHolder.id];

                var options = {schoolSkill: true};
                var skillName = skill.name;
                if (skillHolder.options && skillHolder.options.choosing) {
                    options.choosing = skillHolder.options.choosing;
                    skillName += ': ' + skillHolder.options.choosing;
                }
                logEntries.push({displayText: 'Spent 0 XP to increase ' + skillName + ' to 1'});

                skill.increase(model, options);
                if (skillHolder.options && skillHolder.options.emphasis) {
                    skill.addEmphasis(model, skillHolder.options.emphasis);
                    logEntries.push({displayText: 'Spent 0 XP to gain ' + skillHolder.options.emphasis + ' for the ' + skillName + ' skill'});
                }
            };


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
                    processSkillHolder(skillHolder, model, logEntries);
                });

                // Add chosen school skills
                if (options.chosenSkills) {
                    options.chosenSkills.forEach(function (skillHolder) {
                        processSkillHolder(skillHolder, model, logEntries);
                    });
                }

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