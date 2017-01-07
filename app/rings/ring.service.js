'use strict';

class Trait {
    constructor(id, name, description, value) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.value = value;
    };
}

class Ring {
    constructor(id, name, icon, xpMult, physicalTrait, spiritualTrait, voidTrait) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.physicalTrait = physicalTrait;
        this.spiritualTrait = spiritualTrait;
        this.voidTrait = voidTrait;
        this.xpMult = xpMult;
    };

    getRank() {
        let physical = -1;
        let spiritual = -1;
        let voidVal = -1;
        if (this.physicalTrait) {
            physical = this.physicalTrait.value;
        }
        if (this.spiritualTrait) {
            spiritual = this.spiritualTrait.value;
        }
        if (this.voidTrait) {
            voidVal = this.voidTrait.value;
        }
        return Math.max(Math.min(physical, spiritual), voidVal);
    }

    increaseTrait(model, traitId) {
        let trait;
        if (this.physicalTrait && this.physicalTrait.id === traitId) {
            trait = this.physicalTrait;
        } else if (this.spiritualTrait && this.spiritualTrait.id === traitId) {
            trait = this.spiritualTrait;
        } else if (this.voidTrait && this.voidTrait.id === traitId) {
            trait = this.voidTrait;
        }

        trait.value++;
        return trait;
    };

    purchase(model, traitId) {
        let trait = this.increaseTrait(model, traitId);
        let xpCost = this.xpMult * trait.value;

        let invalidReasons = [];
        let description = trait.name;
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        return {cost: xpCost, newValue: trait.value, name: description, invalidReasons: invalidReasons};
    };

    getTrait(traitId) {
        if (this.voidTrait && this.voidTrait.id === traitId) {
            return this.voidTrait;
        } else if (this.physicalTrait && this.physicalTrait.id === traitId) {
            return this.physicalTrait;
        } else if (this.spiritualTrait && this.spiritualTrait.id === traitId) {
            return this.spiritualTrait;
        } else {
            return null;
        }
    };
}


class RingService {
    constructor() {
    }

    createEarthRing() {
        return new Ring('earth', 'Earth', 'images/earth_by_exahyl-d3is114.png', 4,
            new Trait('stamina', 'Stamina', '', 2), new Trait('willpower', 'Willpower', '', 2));
    };

    createWaterRing() {
        return new Ring('water', 'Water', 'images/water_ring_by_exahyl-d3is12g.png', 4,
            new Trait('strength', 'Strength', '', 2), new Trait('perception', 'Perception', '', 2));
    };

    createFireRing() {
        return new Ring('fire', 'Fire', 'images/fire_ring_by_exahyl-d3is13z.png', 4,
            new Trait('agility', 'Agility', '', 2), new Trait('intelligence', 'Intelligence', '', 2));
    };

    createAirRing() {
        return new Ring('air', 'Air', 'images/air_ring_by_exahyl-d3is15c.png', 4,
            new Trait('reflexes', 'Reflexes', '', 2), new Trait('awareness', 'Awareness', '', 2));
    };

    createVoidRing() {
        return new Ring('void', 'Void', 'images/void_by_exahyl-d3is16h.png', 6, null, null, new Trait('void', 'Void', '', 2));
    };

    findRingForTrait(traitId, model) {
        const ringMap ={
            stamina: model.rings.earth,
            willpower: model.rings.earth,
            strength: model.rings.water,
            perception: model.rings.water,
            agility: model.rings.fire,
            intelligence: model.rings.fire,
            reflexes: model.rings.air,
            awareness: model.rings.air,
            void: model.rings.void
        };

        return ringMap[traitId];
    };

    findTraitById(traitId, model) {
        return this.findRingForTrait(traitId, model).getTrait(traitId);
    };
}

export default RingService;