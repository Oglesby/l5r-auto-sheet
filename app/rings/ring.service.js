'use strict';

angular.module('pocketIkoma').service('ringService', function() {
    var Trait = function (id, name, description, value) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.value = value;
    };

    var Ring = function (id, name, icon, xpMult, physicalTrait, spiritualTrait, voidTrait) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.physicalTrait = physicalTrait;
        this.spiritualTrait = spiritualTrait;
        this.voidTrait = voidTrait;
        this.xpMult = xpMult;
    };
    Ring.prototype.getRank = function () {
        var physical = -1;
        var spiritual = -1;
        var voidVal = -1;
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
    };
    Ring.prototype.increaseTrait = function (model, traitId) {
        var trait;
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
    Ring.prototype.purchase = function (model, traitId) {
        var trait = this.increaseTrait(model, traitId);
        var xpCost = this.xpMult * trait.value;

        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        return {cost: xpCost, newValue: trait.value, name: trait.name};
    };
    Ring.prototype.getTrait = function(traitName) {
        if (this.voidTrait && this.voidTrait.id === traitName) {
            return this.voidTrait;
        } else if (this.physicalTrait && this.physicalTrait.id === traitName) {
            return this.physicalTrait;
        } else if (this.spiritualTrait && this.spiritualTrait.id === traitName) {
            return this.spiritualTrait;
        } else {
            return null;
        }
    };

    var createEarthRing = function() {
        return new Ring('earth', 'Earth', 'images/earth_by_exahyl-d3is114.png', 4,
            new Trait('stamina', 'Stamina', '', 2), new Trait('willpower', 'Willpower', '', 2));
    };
    var createWaterRing = function() {
        return new Ring('water', 'Water', 'images/water_ring_by_exahyl-d3is12g.png', 4,
            new Trait('strength', 'Strength', '', 2), new Trait('perception', 'Perception', '', 2));
    };
    var createFireRing = function() {
        return new Ring('fire', 'Fire', 'images/fire_ring_by_exahyl-d3is13z.png', 4,
            new Trait('agility', 'Agility', '', 2), new Trait('intelligence', 'Intelligence', '', 2));
    };
    var createAirRing = function() {
        return new Ring('air', 'Air', 'images/air_ring_by_exahyl-d3is15c.png', 4,
            new Trait('reflexes', 'Reflexes', '', 2), new Trait('awareness', 'Awareness', '', 2));
    };
    var createVoidRing = function() {
        return new Ring('void', 'Void', 'images/void_by_exahyl-d3is16h.png', 6, null, null, new Trait('void', 'Void', '', 2));
    };

    var findRingForTrait = function (traitName, model) {
        var ringMap ={
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

        return ringMap[traitName];
    };

    var getTraitFromRingName = function(ringName, traitName, model) {
        return this.findRingForTrait(traitName, model).getTrait(traitName);
    };

    return {
        createEarthRing: createEarthRing,
        createWaterRing: createWaterRing,
        createFireRing: createFireRing,
        createAirRing: createAirRing,
        createVoidRing: createVoidRing,
        findRingForTrait: findRingForTrait,
        getTraitFromRingName: getTraitFromRingName
    };
});