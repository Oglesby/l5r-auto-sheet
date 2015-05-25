'use strict';

angular.module('pocketIkoma').service('familyService', function(ringService) {
    return {
        'hida': {
            name: 'Hida',
            bonusTrait: 'Strength',
            description: '',
            visit: function (model) {
                ringService.water.increaseTrait(model, 'strength');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Crab';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + ringService.water.physicalTrait.value}];
            }
        },
        'mirumoto': {
            name: 'Mirumoto',
            bonusTrait: 'Agility',
            description: '',
            visit: function (model) {
                ringService.fire.increaseTrait(model, 'agility');
                model.characterInfo.family = this;
                model.characterInfo.clan = 'Dragon';

                return [{displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + ringService.fire.physicalTrait.value}];
            }
        }
    };
});
