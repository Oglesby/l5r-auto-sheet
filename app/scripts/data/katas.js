(function () {
    "use strict";

    // TODO Figure out how to properly bind this to a service in angular
    var Kata = function (id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };
    Kata.prototype.purchase = function (model) {
        model.katas = model.katas || [];

        var kata = {
            type: this
        };

        model.katas.push(kata);
    };

    window.l5rKatas = {
        "indomitable.warrior.style": new Kata("indomitable.warrior.style", "Indomitable Warrior Style", "")
    };
}());