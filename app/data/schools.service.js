'use strict';

angular.module('pocketIkoma').service('schoolService', function(skillService, _) {
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
                        isBushi: true,
                        isShugenja: false,
                        isMonk: false
                    }
                ];
                model.rings.earth.increaseTrait(model, 'stamina');

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
                    {displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.earth.physicalTrait.value},
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
                        isBushi: true,
                        isShugenja: false,
                        isMonk: false
                    }
                ];
                model.rings.earth.increaseTrait(model, 'stamina');

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
                    {displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.earth.physicalTrait.value},
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
        },
        togashiMonk: {
            name: 'Togashi Tattooed Order',
            bonusTrait: 'Void',
            description: '',
            visit: function (model, options) {
                model.schools = [
                    {
                        type: this,
                        rank: 1,
                        isBushi: false,
                        isShugenja: false,
                        isMonk: true,
                        kihoCostModifier: 1.5,
                        canTakeKiho: function(mastery, ringValue) {
                            return mastery <= (ringValue + this.rank);
                        }
                    }
                ];
                model.rings.void.increaseTrait(model, 'void');

                // Add school skills
                skillService.artisan.increase(model, {
                    schoolSkill: true,
                    choosing: 'Tattoo'});
                skillService.athletics.increase(model, {schoolSkill: true});
                skillService.jiujutsu.increase(model, {schoolSkill: true});
                skillService.kenjutsu.increase(model, {schoolSkill: true});
                skillService.perform.increase(model, {
                    schoolSkill: true,
                    choosing: 'Haka'
                });
                skillService.lore.increase(model, {
                    schoolSkill: true,
                    choosing: 'Maori'
                });

                // Set honor
                model.characterInfo.honor = 45;

                // TODO Add outfit

                return [
                    {displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.earth.physicalTrait.value},
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
        },
        asahinaShugenja: {
            name: 'Asahina Shugenja',
            bonusTrait: 'Awareness',
            description: '',
            visit: function (model, options) {
                model.schools = [
                    {
                        type: this,
                        rank: 1,
                        isBushi: false,
                        isShugenja: true,
                        isMonk: false,
                        affinity: 'air',
                        deficiency: 'fire',
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
                model.rings.air.increaseTrait(model, 'awareness');

                // Add school skills
                skillService.calligraphy.increase(model, {schoolSkill: true});
                skillService.calligraphy.addEmphasis(model, 'Cypher');
                skillService.etiquette.increase(model, {schoolSkill: true});
                skillService.courtier.increase(model, {schoolSkill: true});
                skillService.lore.increase(model, {
                    schoolSkill: true,
                    choosing: 'Theology'
                });
                skillService.spellcraft.increase(model, {schoolSkill: true});
                _.each(options.chosenSkills, function (skill) {
                    var options = _.extend({schoolSkill: true}, skill.options);
                    skillService[skill.id].increase(model, options);
                });

                // Set honor
                model.characterInfo.honor = 65;

                // TODO Add outfit

                return [
                    {displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.air.physicalTrait.value},
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