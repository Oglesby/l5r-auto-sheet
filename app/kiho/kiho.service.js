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
        var minSchool = null;
        var mastery = this.mastery;
        var ringValue = model.rings[this.ring].getRank();
        _.forEach(model.schools, function(school) {
            if (school.isMonk && school.canTakeKiho(mastery, ringValue) && (!minSchool || minSchool.kihoCostModifier > school.kihoCostModifier)) {
                minSchool = school;
            }
        });

        var kiho = this.gain(model, options);
        var description = kiho.type.name;
        var invalidReasons = [];
        if (!minSchool) {
            invalidReasons.push('You have no school that allows you to purchase ' + description + ' at this point.');
        }

        var xpCost = this.mastery * (minSchool ? minSchool.kihoCostModifier : 2);
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;

        return {cost: xpCost, name: description, invalidReasons: invalidReasons};
    };
    return {
        touchTheVoidDragon: new Kiho('touchTheVoidDragon', 'Touch the Void Dragon', '', 4, 'void')
    };
});
