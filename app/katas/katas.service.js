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

        if (xpCost > model.characterInfo.xp) {
            // TODO: File a warning and/or flag this log as somehow invalid?
        }

        model.characterInfo.xp = model.characterInfo.xp - xpCost;
        return {cost: xpCost, name: kata.type.name};
    };

    return {
        'indomitable.warrior.style': new Kata('indomitable.warrior.style', 'Indomitable Warrior Style', '')
    };
});