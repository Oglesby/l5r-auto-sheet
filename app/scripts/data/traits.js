(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    var Trait = function (id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };
    Trait.prototype.purchase = function (model) {
        model.traits[this.id]++;
    };

    window.l5rTraits = {
        "stamina": new Trait("stamina", "Stamina", ""),
        "willpower": new Trait("willpower", "Willpower", ""),
        "strength": new Trait("strength", "Strength", ""),
        "perception": new Trait("perception", "Perception", ""),
        "agility": new Trait("agility", "Agility", ""),
        "intelligence": new Trait("intelligence", "Intelligence", ""),
        "reflexes": new Trait("reflexes", "Reflexes", ""),
        "awareness": new Trait("awareness", "Awareness", ""),
        "void": new Trait("void", "Void", "")
    };

    // TODO Probably a better way to do this override
    window.l5rTraits.void.purchase = function (model) {
        model.rings.void++;
    };

}());