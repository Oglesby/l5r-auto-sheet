"use strict";

angular.module("pocketIkoma").service("ringService", function() {
    var Trait = function (id, name, description, value) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.value = value;
    };

    var Ring = function (id, name, icon, physicalTrait, spiritualTrait, voidTrait) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.physicalTrait = physicalTrait;
        this.spiritualTrait = spiritualTrait;
        this.voidTrait = voidTrait;
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
    Ring.prototype.purchase = function (model, traitId) {
        if (this.physicalTrait && this.physicalTrait.id === traitId) {
            this.physicalTrait.value++;
        } else if (this.spiritualTrait && this.spiritualTrait.id === traitId) {
            this.spiritualTrait.value++;
        } else if (this.voidTrait && this.voidTrait.id === traitId) {
            this.voidTrait.value++;
        }
    };

    var earth = new Ring("earth", "Earth", "images/earth_by_exahyl-d3is114.png",
        new Trait("stamina", "Stamina", "", 2), new Trait("willpower", "Willpower", "", 2));
    var water = new Ring("water", "Water", "images/water_ring_by_exahyl-d3is12g.png",
            new Trait("strength", "Strength", "", 2), new Trait("perception", "Perception", "", 2));
    var fire = new Ring("fire", "Fire", "images/fire_ring_by_exahyl-d3is13z.png",
            new Trait("agility", "Agility", "", 2), new Trait("intelligence", "Intelligence", "", 2));
    var air = new Ring("air", "Air", "images/air_ring_by_exahyl-d3is15c.png",
            new Trait("agility", "Agility", "", 2), new Trait("intelligence", "Intelligence", "", 2));
    var voidRing = new Ring("void", "Void", "images/void_by_exahyl-d3is16h.png", null, null, new Trait("void", "Void", "", 2));

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