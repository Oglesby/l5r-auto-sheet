'use strict';

import _ from 'lodash';

class Advantage {
    constructor(id, name, description, xpFetcher) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.xpFetcher = xpFetcher;
    };

    gain(model, options) {
        options = options || {};
        model.advantages = model.advantages || [];

        let advantage = {
            type: this
        };

        if (options.choosing) {
            advantage.choosing = options.choosing;
        }

        if (options.rank) {
            advantage.rank = options.rank;
        }

        model.advantages.push(advantage);
        return advantage;
    };

    purchase(model, options) {
        let advantage = this.gain(model, options);
        let xpCost = this.xpFetcher(model, options);

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        let description = advantage.type.name;
        if (options && options.choosing) {
            description += ': ' + options.choosing;
        }

        let invalidReasons = [];
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }

        return {cost: xpCost, name: description, invalidReasons: invalidReasons};
    };
}

class AdvantageService {
    constructor() {
        // TODO: add a function that gets excuted on purchase
        this.sevenFortunesBlessing = new Advantage('sevenFortunesBlessing', 'Seven Fortune\'s Blessing', '',
            (model, options) => {
                if (options.choosing === 'Bishamon\'s Blessing') {
                    return (model.characterInfo.clan === 'Lion' || model.characterInfo.clan === 'Crab') ? 4 : 5;
                } else {
                    return 4;
                }
            });

        this.crabHands = new Advantage('crabHands', 'Crab Hands', '',
            (model, options) => {
                const isBushi = _(model.schools).some((school) => {
                    return school.isBushi;
                });

                return (isBushi || model.characterInfo.clan === 'Crab') ? 2 : 3;
            });

        this.greatPotential = new Advantage('greatPotential', 'Great Potential', '', () => {
            return 5;
        });

        this.large = new Advantage('large', 'Large', '', (model, options) => {
            return model.characterInfo.clan === 'Crab' ? 3 : 4;
        });

        this.strengthOfEarth = new Advantage('strengthOfEarth', 'Strength of Earth', '', (model, options) => {
            const isBushi = _(model.schools).some((school) => {
                return school.isBushi;
            });

            return isBushi ? 2 : 3;
        });

        this.favor = new Advantage('favor', 'Favor', '', (model, options) => {
            return 0;
        });

        this.ally = new Advantage('ally', 'Ally', '', (model, options) => {
            return 0;
        });

        this.tactician = new Advantage('tactician', 'Tactician', '', (model, options) => {
            return 3;
        });

        this.elementalBlessing = new Advantage('elementalBlessing', 'Elemental Blessing', '', (model, options) => {
            return (model.characterInfo.clan === 'Phoenix') ? 3 : 4;
        });

        this.enlightened = new Advantage('enlightened', 'Enlightened', '', (model, options) => {
            const isMonk = _(model.schools).some((school) => {
                return school.isMonk;
            });

            return (isMonk || model.characterInfo.clan === 'Dragon') ? 5 : 6;
        });

        this.luck = new Advantage('luck', 'Luck', '', (model, options) => {
            return options.rank * 3;
        });

        this.prodigy = new Advantage('prodigy', 'Prodigy', '', (model, options) => {
            return 12;
        });

        this.voice = new Advantage('voice', 'Voice', '', (model, options) => {
            return 3;
        });

        this.friendOfTheBrotherhood = new Advantage('friendOfTheBrotherhood', 'Friend of the Brotherhood', '', (model, options) => {
            return 5;
        });

        this.differentSchool = new Advantage('differentSchool', 'Different School', '', (model, options) => {
            return 5;
        });

        this.handsOfStone = new Advantage('handsOfStone', 'Hands of Stone', '', (model, options) => {
            return 5;
        });

        this.friendOfTheElements = new Advantage('friendOfTheElements', 'Friend of the Elements', '', (model, options) => {
            return 3;
        });
    }
}

export default AdvantageService;