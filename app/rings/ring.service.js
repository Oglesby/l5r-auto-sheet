"use strict";

angular.module("pocketIkoma").service("ringService", function() {
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
        return Math.max(physical, spiritual, voidVal);
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
        return {cost: xpCost, newValue: trait.value};
    };

    var earth = new Ring("earth", "Earth", "images/earth_by_exahyl-d3is114.png", 4,
        new Trait("stamina", "Stamina", "", 2), new Trait("willpower", "Willpower", "", 2));
    var water = new Ring("water", "Water", "images/water_ring_by_exahyl-d3is12g.png", 4,
            new Trait("strength", "Strength", "", 2), new Trait("perception", "Perception", "", 2));
    var fire = new Ring("fire", "Fire", "images/fire_ring_by_exahyl-d3is13z.png", 4,
            new Trait("agility", "Agility", "", 2), new Trait("intelligence", "Intelligence", "", 2));
    var air = new Ring("air", "Air", "images/air_ring_by_exahyl-d3is15c.png", 4,
            new Trait("agility", "Agility", "", 2), new Trait("intelligence", "Intelligence", "", 2));
    var voidRing = new Ring("void", "Void", "images/void_by_exahyl-d3is16h.png", 6, null, null, new Trait("void", "Void", "", 2));

    var ringMap = {
        stamina: earth,
        willpower: earth,
        strength: water,
        perception: water,
        agility: fire,
        intelligence: fire,
        reflexes: air,
        awareness: air,
        void: voidRing
    };

    var findRingForTrait = function (trait) {
        return ringMap[trait];
    };

    return {
        earth: earth,
        water: water,
        fire: fire,
        air: air,
        void: voidRing,
        findRingForTrait: findRingForTrait
    };
});