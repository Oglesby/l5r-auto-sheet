'use strict';

class Disadvantage {
    constructor(id, name, description, xpFetcher) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.xpFetcher = xpFetcher;
    };

    gain(model, options) {
        options = options || {};
        model.disadvantages = model.disadvantages || [];

        let disadvantage = {
            type: this
        };

        if (options.choosing) {
            disadvantage.choosing = options.choosing;
        }

        if (options.rank) {
            disadvantage.rank = options.rank;
        }

        model.disadvantages.push(disadvantage);
        return disadvantage;
    };

    purchase(model, options) {
        let disadvantage = this.gain(model, options);
        let xpGain =  this.xpFetcher(model, options);

        let invalidReasons = [];
        let description = disadvantage.type.name;
        if ((xpGain + model.characterInfo.disadXp) > 10) {
            xpGain = 10 - model.characterInfo.disadXp;
            invalidReasons.push('Purchasing ' + description + ' at this point will only grant you ' + xpGain + ' xp.');
        }

        model.characterInfo.xp = model.characterInfo.xp + xpGain;
        model.characterInfo.disadXp = model.characterInfo.disadXp + xpGain;
        if (options) {
            if (options.choosing) {
                description += ': ' + options.choosing;
            } else if (options.rank) {
                description += ' (Rank ' + options.rank + ')';
            }
        }
        return {cost: xpGain, name: description, invalidReasons: invalidReasons};
    };
}

class DisadvantageService {
    constructor() {
        this.brash = new Disadvantage('brash', 'Brash', '',
            function (model, options) {
                return model.characterInfo.clan === 'Lion' ? 4 : 3;
            });

        this.compulsion = new Disadvantage('compulsion', 'Compulsion', '',
            function (model, options) {
                return 1 + options.rank;
            });

        this.gullible = new Disadvantage('gullible', 'Gullible', '', function () {
            return 4;
        });

        this.disturbingCountenance = new Disadvantage('disturbingCountenance', 'Disturbing Countenance', '',
            function (model, options) {
                return model.characterInfo.clan === 'Spider' ? 4 : 3;
            });

        this.jealous = new Disadvantage('jealous', 'Jealous', '', function () {
            return 3;
        });

        this.lechery = new Disadvantage('lechery', 'Lechery', '', function () {
            return 2;
        });

        this.gaijinName = new Disadvantage('gaijinName', 'Gaijin Name', '', function () {
            return 1;
        });

        this.phobia = new Disadvantage('phobia', 'Phobia', '',
            function (model, options) {
                return options.rank;
            });

        this.doubt = new Disadvantage('doubt', 'Doubt', '', function (model, options) {
            return 4;
        });

        this.sevenFortunesCurse = new Disadvantage('sevenFortunesCurse', 'Seven Fortune\'s Curse', '', function () {
            return 3;
        });

        this.softHearted = new Disadvantage('softHearted', 'Soft Hearted', '', function () {
            return 2;
        });

        this.idealistic = new Disadvantage('idealistic', 'Idealistic', '', function () {
            return 2;
        });

        this.swornEnemy = new Disadvantage('swornEnemy', 'Sworn Enemy', '', function (model, options) {
            return 0;
        });
    }
}

export default DisadvantageService;
