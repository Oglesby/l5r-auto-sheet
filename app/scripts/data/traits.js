(function () {
    "use strict";

    angular.module("l5rAutoSheetApp").service("traitService", function() {
        var Trait = function (id, name, description) {
            this.id = id;
            this.name = name;
            this.description = description;
        };
        Trait.prototype.purchase = function (model) {
            model.traits[this.id]++;
        };

        var voidTrait = new Trait("void", "Void", "");
        // TODO Probably a better way to do this override
        voidTrait.purchase = function (model) {
            model.rings.void++;
        };

        return {
            "stamina": new Trait("stamina", "Stamina", ""),
            "willpower": new Trait("willpower", "Willpower", ""),
            "strength": new Trait("strength", "Strength", ""),
            "perception": new Trait("perception", "Perception", ""),
            "agility": new Trait("agility", "Agility", ""),
            "intelligence": new Trait("intelligence", "Intelligence", ""),
            "reflexes": new Trait("reflexes", "Reflexes", ""),
            "awareness": new Trait("awareness", "Awareness", ""),
            "void": voidTrait
        };
    });
}());