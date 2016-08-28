'use strict';

angular.module('pocketIkoma').service('familyService', function() {
    return {
        'hida': {
            name: 'Hida',
            bonusTrait: 'Strength',
            description: '',
            visit: function (model) {
                model.rings.water.increaseTrait(model, 'strength');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Crab';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.water.physicalTrait.value}];
            }
        },
        'mirumoto': {
            name: 'Mirumoto',
            bonusTrait: 'Agility',
            description: '',
            visit: function (model) {
                model.rings.fire.increaseTrait(model, 'agility');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Dragon';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.fire.physicalTrait.value}];
            }
        },
        'hoshi': {
            name: 'Hoshi',
            bonusTrait: 'Void',
            description: '',
            visit: function (model) {
                model.rings.void.increaseTrait(model, 'void');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Dragon';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.void.voidTrait.value}];
            }
        },
        'doji': {
            name: 'Doji',
            bonusTrait: 'Awareness',
            description: '',
            visit: function (model) {
                model.rings.air.increaseTrait(model, 'awareness');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Crane';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + model.rings.air.physicalTrait.value}];
            }
        }
    };
});
