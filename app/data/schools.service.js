'use strict';

angular.module('pocketIkoma').service('schoolService', function(ringService, skillService, _) {
    return {
        hidaBushi: {
            name: 'Hida Bushi',
            bonusTrait: 'Stamina',
            description: '',
            visit: function (model, options) {
                model.schools = [
                    {
                        type: this,
                        rank: 1,
                        isBushi: true
                    }
                ];
                ringService.earth.increaseTrait(model, 'stamina');

                // Add school skills
                skillService.athletics.increase(model, {schoolSkill: true});
                skillService.defense.increase(model, {schoolSkill: true});
                skillService.heavyWeapons.increase(model, {schoolSkill: true});
                skillService.heavyWeapons.addEmphasis(model, 'Tetsubo');
                skillService.intimidation.increase(model, {schoolSkill: true});
                skillService.kenjutsu.increase(model, {schoolSkill: true});
                skillService.lore.increase(model, {
                    schoolSkill: true,
                    choosing: 'Shadowlands'
                });
                _.each(options.chosenSkills, function (skill) {
                    var options = _.extend({schoolSkill: true}, skill.options);
                    skillService[skill.id].increase(model, options);
                });

                // Set honor
                model.characterInfo.honor = 35;

                // TODO Add outfit

                return [
                    {displayText: 'Spent 0 XP to increase Stamina to ' + ringService.earth.physicalTrait.value},
                    // TODO: Fix this to be dynamic
                    {displayText: 'Spent 0 XP to increase Athletics to 1'},
                    {displayText: 'Spent 0 XP to increase Defense to 1'},
                    {displayText: 'Spent 0 XP to increase Heavy Weapons to 1'},
                    {displayText: 'Spent 0 XP to gain Tetsubo emphasis for the Heavy Weapons skill'},
                    {displayText: 'Spent 0 XP to increase Intimidation to 1'},
                    {displayText: 'Spent 0 XP to increase Kenjutsu to 1'},
                    {displayText: 'Spent 0 XP to increase Lore: Shadowlands to 1'},
                    {displayText: 'Spent 0 XP to increase Battle to 1 (Chosen Skill)'}
                ];
            }
        },
        mirumotoBushi: {
            name: 'Mirumoto Bushi',
            bonusTrait: 'Stamina',
            description: '',
            visit: function (model, options) {
                model.schools = [
                    {
                        type: this,
                        rank: 1,
                        isBushi: true
                    }
                ];
                ringService.earth.increaseTrait(model, 'stamina');

                // Add school skills
                skillService.athletics.increase(model, {schoolSkill: true});
                skillService.defense.increase(model, {schoolSkill: true});
                skillService.theology.increase(model, {schoolSkill: true});
                skillService.meditation.increase(model, {schoolSkill: true});
                skillService.iaijutsu.increase(model, {schoolSkill: true});
                skillService.kenjutsu.increase(model, {schoolSkill: true});
                skillService.kenjutsu.addEmphasis(model, 'Katana');
                skillService.lore.increase(model, {
                    schoolSkill: true,
                    choosing: 'Shugenja'
                });
                _.each(options.chosenSkills, function (skill) {
                    var options = _.extend({schoolSkill: true}, skill.options);
                    skillService[skill.id].increase(model, options);
                });

                // Set honor
                model.characterInfo.honor = 45;

                // TODO Add outfit

                return [
                    {displayText: 'Spent 0 XP to increase Stamina to ' + ringService.earth.physicalTrait.value},
                    // TODO: Fix this to be dynamic
                    {displayText: 'Spent 0 XP to increase Theology to 1'},
                    {displayText: 'Spent 0 XP to increase Defense to 1'},
                    {displayText: 'Spent 0 XP to increase Meditation to 1'},
                    {displayText: 'Spent 0 XP to increase Iaijutsu to 1'},
                    {displayText: 'Spent 0 XP to increase Kenjutsu to 1'},
                    {displayText: 'Spent 0 XP to gain Katana emphasis for the Kenjutsu skill'},
                    {displayText: 'Spent 0 XP to increase Lore: Shugenja to 1'},
                    {displayText: 'Spent 0 XP to increase Athletics to 1 (Chosen Skill)'}
                ];
            }
        }
    };
});