"use strict";

angular.module("pocketIkoma").service("advantageService", function(_) {
    var Advantage = function (id, name, description, xpFetcher) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.xpFetcher = xpFetcher;
    };
    Advantage.prototype.gain = function (model, options) {
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
        return advantage;
    };
    Advantage.prototype.purchase = function (model, options) {
        var advantage = this.gain(model, options);
        var xpCost = this.xpFetcher(model, options);

        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = advantage.type.name;
        if (options && options.choosing) {
            description += ": " + options.choosing;
        }
        return {cost: xpCost, name: description};
    };
    return {
        "seven.fortunes.blessing": new Advantage("seven.fortunes.blessing", "Seven Fortune's Blessing", "",
            function(model, options) {
                if (options.choosing === "Bishamon's Blessing") {
                    return (model.characterInfo.clan === "Lion" || model.characterInfo.clan === "Crab") ? 4 : 5;
                } else {
                    return 4;
                }
            }),
        "crab.hands": new Advantage("crab.hands", "Crab Hands", "",
            function(model, options) {
                var isBushi = _.any(model.schools, function (school) {
                    return school.isBushi;
                });

                return (isBushi || model.characterInfo.clan === "Crab") ? 2 : 3;
            }),
        "great.potential": new Advantage("great.potential", "Great Potential", "", function () { return 5; }),
        large: new Advantage("large", "Large", "",function(model, options) {
            return model.characterInfo.clan === "Crab" ? 3 : 4;
        }),
        "strength.of.earth": new Advantage("strength.of.earth", "Strength of Earth", "", function(model, options) {
            var isBushi = _.any(model.schools, function (school) {
                return school.isBushi;
            });

            return isBushi ? 2 : 3;
        }),
        favor: new Advantage("favor", "Favor", "", function(model, options) { return 0; }),
        tactician: new Advantage("tactician", "Tactician", "", function(model, options) { return 3; }),
        "elemental.blessing": new Advantage("elemental.blessing", "Elemental Blessing", "", function(model, options) {
            return (model.characterInfo.clan === "Phoenix") ? 3 : 4;
        }),
        enlightened: new Advantage("enlightened", "Enlightened", "", function(model, options) {
            var isMonk = _.any(model.schools, function (school) {
                return school.isMonk;
            });

            return (isMonk || model.characterInfo.clan === "Dragon") ? 5 : 6;
        }),
        luck: new Advantage("luck", "Luck", "", function(model, options) {
            return options.rank * 3;
        }),
        prodigy: new Advantage("prodigy", "Prodigy", "", function(model, options) { return 12; })
    };
});
