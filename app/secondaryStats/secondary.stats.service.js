'use strict';

import _ from 'lodash';

class SecondaryStatsService {
    constructor() {
    }

    calculate(model) {
        const secondaryStats = model.secondaryStats;

        // Calculate TN
        const reflexes = model.rings.air.physicalTrait.value;
        secondaryStats.tn = reflexes * 5 + 5 + secondaryStats.bonusTN;

        // Calculate Initiative
        const totalRank = _.reduce(model.schools, function (accum, item) {
                accum += item.rank;
                return accum;
            }, 0) + secondaryStats.bonusInitiative;
        secondaryStats.initiative = (totalRank + reflexes) + 'k' + reflexes;

        // Calculate Movement
        secondaryStats.movement = model.rings.water.getRank() * 10 + secondaryStats.bonusMovement;

        // Calculate Wound Table
        secondaryStats.woundRanks = [];
        const firstRankWounds = 5 * model.rings.earth.getRank() + secondaryStats.bonusWoundsPerRank;
        const rankWounds = 2 * model.rings.earth.getRank() + secondaryStats.bonusWoundsPerRank;
        const penalties = secondaryStats.woundPenalties;
        secondaryStats.woundRanks.push({name: 'Healthy', penalty: penalties[0], wounds: firstRankWounds, totalWounds: firstRankWounds});
        secondaryStats.woundRanks.push({name: 'Nicked', penalty: penalties[1], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[0].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Grazed', penalty: penalties[2], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[1].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Hurt', penalty: penalties[3], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[2].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Injured', penalty: penalties[4], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[3].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Crippled', penalty: penalties[5], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[4].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Down', penalty: penalties[6], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[5].totalWounds + rankWounds});
        secondaryStats.woundRanks.push({name: 'Out', penalty: penalties[7], wounds: rankWounds, totalWounds: secondaryStats.woundRanks[6].totalWounds + rankWounds});
    };
}

export default SecondaryStatsService;