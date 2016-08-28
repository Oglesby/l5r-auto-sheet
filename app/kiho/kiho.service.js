'use strict';

angular.module('pocketIkoma').service('kihoService', function(_) {
    var Kiho = function (id, name, description, mastery, ring) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.mastery = mastery;
        this.ring = ring;
    };

    Kiho.prototype.gain = function (model) {
        model.kiho = model.kiho || [];

        var kiho = {
            type: this
        };

        model.kiho.push(kiho);
        return kiho;
    };
    Kiho.prototype.purchase = function (model, options) {
        var minSchool = {
            kihoCostModifier: 99
        };
        var mastery = this.mastery;
        var ringValue = model.rings[this.ring].getRank();
        _.forEach(model.schools, function(school) {
            if (school.isMonk && school.canTakeKiho(mastery, ringValue) && minSchool.kihoCostModifier > school.kihoCostModifier) {
                minSchool = school;
            }
        });

        if (!minSchool) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        var kiho = this.gain(model, options);
        var xpCost = this.mastery * minSchool.kihoCostModifier;
        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = kiho.type.name;
        return {cost: xpCost, name: description};
    };
    return {
        touchTheVoidDragon: new Kiho('touchTheVoidDragon', 'Touch the Void Dragon', '', 4, 'void')
    };
});
