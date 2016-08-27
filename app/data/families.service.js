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
        }
    };
});
