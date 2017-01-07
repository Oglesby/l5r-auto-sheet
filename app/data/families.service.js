'use strict';

let json = [{
    id: 'none',
    name: 'None',
    bonusTrait: '',
    description: ''
}, {
    id: 'hida',
    name: 'Hida',
    bonusTrait: 'Strength',
    description: ''
}, {
    id: 'mirumoto',
    name: 'Mirumoto',
    bonusTrait: 'Agility',
    description: ''
}, {
    id: 'hoshi',
    name: 'Hoshi',
    bonusTrait: 'Void',
    description: ''
}, {
    id: 'doji',
    name: 'Doji',
    bonusTrait: 'Awareness',
    description: ''
}];


class FamilyService {
    constructor(ringService) {
        json.forEach((familyJson) => {
            let family = familyJson;
            family.visit = function (model) {
                let logEntries = [];

                logEntries.push({displayText: 'Assigned to the ' + this.name + ' family.'});
                let trait = this.bonusTrait.toLowerCase();
                let traitRing = ringService.findRingForTrait(trait, model);
                if (traitRing) {
                    traitRing.increaseTrait(model, trait);
                    logEntries.push({displayText: 'Spent 0 XP to increase ' + this.bonusTrait + ' to ' + traitRing.getTrait(trait).value});
                }
                model.characterInfo.family = this;
                return logEntries;
            };

            this[family.id] = family;
        });
    }
}

export default FamilyService;