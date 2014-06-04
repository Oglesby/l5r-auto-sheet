(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    var Advantage = function (id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };
    Advantage.prototype.purchase = function (model, options) {
        options = options || {};
        model.advantages = model.advantages || [];

        var advantage = {
            type: this
        };

        if (options.choosing) {
            advantage.choosing = options.choosing;
        }

        if (options.rank) {
            advantage.rank = options.rank;
        }

        model.advantages.push(advantage);
    };

    window.l5rAdvantages = {
        "bishamons.blessing": new Advantage("bishamons.blessing", "Bishamon's Blessing", ""),
        "crab.hands": new Advantage("crab.hands", "Crab Hands", ""),
        "great.potential": new Advantage("great.potential", "Great Potential", ""),
        "large": new Advantage("large", "Large", ""),
        "strength.of.earth": new Advantage("strength.of.earth", "Strength of Earth", "")
    };
}());