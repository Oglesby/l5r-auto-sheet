'use strict';

angular.module('pocketIkoma').service('spellService', function(_) {
    var Spell = function (id, name, description, mastery, ring, keywords) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mastery = mastery;
        this.ring = ring;
        this.keywords = keywords;
    };

    Spell.prototype.gain = function (model) {
        model.spells = model.spells || [];

        var spell = {
            type: this
        };

        model.spells.push(spell);
        return spell;
    };
    Spell.prototype.purchase = function (model, options) {
        var validShugenjaSchool = false;
        var mastery = this.mastery;
        var spell = this;
        var ringValue = model.rings[this.ring].getRank();
        _.forEach(model.schools, function(school) {
            if (school.isShugenja && (mastery < (ringValue + school.getAffinityDeficiencyModifier(spell)))) {
                validShugenjaSchool = school;
            }
        });

        if (!validShugenjaSchool) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        this.gain(model, options);
        var description = spell.name;
        return {cost: 0, name: description};
    };
    return {
        tempestOfAir: new Spell('tempestOfAir', 'Tempest of Air', '', 1, 'air', []),
        bentensTouch: new Spell('bentensTouch', 'Benten\'s Touch', '', 2, 'air', []),
        kamisWhisper: new Spell('kamisWhisper', 'Kami\'s Whisper', '', 2, 'air', []),
        pathToInnerPeace: new Spell('pathToInnerPeace', 'Path to Inner Peace', '', 1, 'water', []),
        reversalOfFortunes: new Spell('reversalOfFortunes', 'Reversal of Fortunes', '', 1, 'water', []),
        jadeStrike: new Spell('jadeStrike', 'Jade Strike', '', 1, 'earth', [])
    };
});
