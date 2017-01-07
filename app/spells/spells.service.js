'use strict';

class Spell {
    constructor(id, name, description, mastery, ring, keywords) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mastery = mastery;
        this.ring = ring;
        this.keywords = keywords;
    };

    gain(model) {
        model.spells = model.spells || [];

        const spell = {
            type: this
        };

        model.spells.push(spell);
        return spell;
    };

    purchase(model, options) {
        let validShugenjaSchool = false;
        const mastery = this.mastery;
        const spell = this;
        const ringValue = model.rings[this.ring].getRank();
        _.forEach(model.schools, function(school) {
            if (school.isShugenja && (mastery < (ringValue + school.getAffinityDeficiencyModifier(spell)))) {
                validShugenjaSchool = school;
            }
        });

        const invalidReasons = [];
        const description = spell.name;
        if (!validShugenjaSchool) {
            invalidReasons.push('You have no school that allows you to purchase ' + description + ' at this point.');
        }

        this.gain(model, options);
        return {cost: 0, name: description, invalidReasons: invalidReasons};
    };
}

class SpellService {
    constructor() {
        this.tempestOfAir = new Spell('tempestOfAir', 'Tempest of Air', '', 1, 'air', []);

        this.bentensTouch = new Spell('bentensTouch', 'Benten\'s Touch', '', 2, 'air', []);

        this.kamisWhisper = new Spell('kamisWhisper', 'Kami\'s Whisper', '', 2, 'air', []);

        this.pathToInnerPeace = new Spell('pathToInnerPeace', 'Path to Inner Peace', '', 1, 'water', []);

        this.reversalOfFortunes = new Spell('reversalOfFortunes', 'Reversal of Fortunes', '', 1, 'water', []);

        this.jadeStrike = new Spell('jadeStrike', 'Jade Strike', '', 1, 'earth', []);
    }
}

export default SpellService;