'use strict';

class Kata {
    constructor(id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };

    gain(model) {
        model.katas = model.katas || [];

        const kata = {
            type: this,
            rank: 4
        };

        model.katas.push(kata);
        return kata;
    };

    purchase(model) {
        const kata = this.gain(model);
        const xpCost = kata.rank;

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        const description = kata.type.name;
        const invalidReasons = [];
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }
        return {cost: xpCost, name: description, invalidReasons: invalidReasons};
    };
}

class KataService {
    constructor() {
        this.indomitableWarriorStyle = new Kata('indomitableWarriorStyle', 'Indomitable Warrior Style', '');
    }
}

export default KataService;
