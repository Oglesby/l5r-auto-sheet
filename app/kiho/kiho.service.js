'use strict';

import _ from 'lodash';

class Kiho {
    constructor(id, name, description, mastery, ring) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mastery = mastery;
        this.ring = ring;
    };

    gain(model) {
        model.kiho = model.kiho || [];

        const kiho = {
            type: this
        };

        model.kiho.push(kiho);
        return kiho;
    };

    purchase(model, options) {
        let minSchool = null;
        const mastery = this.mastery;
        const ringValue = model.rings[this.ring].getRank();
        _.forEach(model.schools, function(school) {
            if (school.isMonk && school.canTakeKiho(mastery, ringValue) && (!minSchool || minSchool.kihoCostModifier > school.kihoCostModifier)) {
                minSchool = school;
            }
        });

        const kiho = this.gain(model, options);
        const description = kiho.type.name;
        const invalidReasons = [];
        if (!minSchool) {
            invalidReasons.push('You have no school that allows you to purchase ' + description + ' at this point.');
        }

        const xpCost = this.mastery * (minSchool ? minSchool.kihoCostModifier : 2);
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;

        return {cost: xpCost, name: description, invalidReasons: invalidReasons};
    };
}

class KihoService {
    constructor() {
        this.touchTheVoidDragon = new Kiho('touchTheVoidDragon', 'Touch the Void Dragon', '', 4, 'void');
    }
}

export default KihoService;