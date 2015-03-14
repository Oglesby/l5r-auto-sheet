"use strict";

angular.module("pocketIkoma").service("disadvantageService", function() {
    var Disadvantage = function (id, name, description, xpFetcher) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.xpFetcher = xpFetcher;
    };

    Disadvantage.prototype.gain = function (model, options) {
        options = options || {};
        model.disadvantages = model.disadvantages || [];

        var disadvantage = {
            type: this
        };

        if (options.choosing) {
            disadvantage.choosing = options.choosing;
        }

        if (options.rank) {
            disadvantage.rank = options.rank;
        }

        model.disadvantages.push(disadvantage);
        return disadvantage;
    };
    Disadvantage.prototype.purchase = function (model, options) {
        var disadvantage = this.gain(model, options);
        var xpGain =  this.xpFetcher(model, options);

        if (xpGain > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp + xpGain;
        var description = disadvantage.type.name;
        if (options) {
            if (options.choosing) {
                description += ": " + options.choosing;
            } else if (options.rank) {
                description += " (Rank " + options.rank + ")";
            }
        }
        return {cost: xpGain, name: description};
    };
    return {
        "brash": new Disadvantage("brash", "Brash", "",
            function(model, options) {
                return model.characterInfo.clan === "Lion" ? 4 : 3;
            }),
        "compulsion": new Disadvantage("compulsion", "Compulsion", "",
            function(model, options) {
                return 1 + options.rank;
            }),
        "gullible": new Disadvantage("gullible", "Gullible", "", function () { return 4; })
    };
});
