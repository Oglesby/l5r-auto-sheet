(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    var Disadvantage = function (id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };
    Disadvantage.prototype.purchase = function (model, options) {
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
    };

    window.l5rDisadvantages = {
        "brash": new Disadvantage("brash", "Brash", ""),
        "compulsion": new Disadvantage("compulsion", "Compulsion", ""),
        "gullible": new Disadvantage("gullible", "Gullible", "")
    };
}());