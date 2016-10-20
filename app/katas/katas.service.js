'use strict';

angular.module('pocketIkoma').service('kataService', function() {
    var Kata = function (id, name, description) {
        this.id = id;
        this.name = name;
        this.description = description;
    };
    Kata.prototype.gain = function (model) {
        model.katas = model.katas || [];

        var kata = {
            type: this,
            rank: 4
        };

        model.katas.push(kata);
        return kata;
    };
    Kata.prototype.purchase = function (model) {
        var kata = this.gain(model);
        var xpCost = kata.rank;

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        var description = kata.type.name;
        var invalidReasons = [];
        if (xpCost > model.characterInfo.xp) {
            invalidReasons.push('Insufficient XP to purchase ' + description + ' at this point.');
        }
        return {cost: xpCost, name: description, invalidReasons: invalidReasons};
    };

    return {
        indomitableWarriorStyle: new Kata('indomitableWarriorStyle', 'Indomitable Warrior Style', '')
    };
});