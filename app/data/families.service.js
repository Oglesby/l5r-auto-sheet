'use strict';

angular.module('pocketIkoma').service('familyService', function(ringService) {

    var json = [{
            id: 'none',
            name: 'None',
            bonusTrait: '',
            description: '',
            clan: 'None'
        },
        {
            id: 'hida',
            name: 'Hida',
            bonusTrait: 'Strength',
            description: '',
            clan: 'Crab'
        },
        {
            id: 'mirumoto',
            name: 'Mirumoto',
            bonusTrait: 'Agility',
            description: '',
            clan: 'Dragon'
        },
        {
            id: 'hoshi',
            name: 'Hoshi',
            bonusTrait: 'Void',
            description: '',
            clan: 'Dragon'
        },
        {
            id: 'doji',
            name: 'Doji',
            bonusTrait: 'Awareness',
            description: ''
        }
    ];

    function processJson(jsonArray) {
        var families = {};

        jsonArray.forEach(function(familyJson) {
            var family = familyJson;
            family.visit = function (model) {
                var logEntries = [];

                var trait = this.bonusTrait.toLowerCase();
                var traitRing = ringService.findRingForTrait(trait, model);
                if (traitRing) {
                    traitRing.increaseTrait(model, trait);
                    logEntries.push({displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + traitRing.getTrait(trait).value});
                }
                model.characterInfo.family = this;
                model.characterInfo.clan = this.clan;
                logEntries.push({displayText: 'Assigned to the ' + this.clan + ' clan.'});

                return logEntries;
            };

            families[family.id] = family;
        });

        return families;
    }

    return processJson(json);
});
