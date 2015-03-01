(function () {
    "use strict";

    angular.module("l5rAutoSheetApp").service("kataService", function() {
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

        return {
            "indomitable.warrior.style": new Kata("indomitable.warrior.style", "Indomitable Warrior Style", "")
        };
    });
}());