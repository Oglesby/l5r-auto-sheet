'use strict';

angular.module('pocketIkoma').service('clanService', function() {

    var json = [{
        id: 'none',
        name: 'None',
        description: '',
        families: ['none']
    }, {
        id: 'crab',
        name: 'Crab',
        description: '',
        families: ['hida']
    }, {
        id: 'crane',
        name: 'Crane',
        description: '',
        families: ['asahina']
    }, {
        id: 'dragon',
        name: 'Dragon',
        description: '',
        families: ['hoshi', 'mirumoto']
    }, {
        id: 'imperial',
        name: 'Imperial',
        description: '',
        families: []
    }, {
        id: 'lion',
        name: 'Lion',
        description: '',
        families: []
    }, {
        id: 'mantis',
        name: 'Mantis',
        description: '',
        families: []
    }, {
        id: 'phoenix',
        name: 'Phoenix',
        description: '',
        families: []
    }, {
        id: 'scorpion',
        name: 'Scorpion',
        description: '',
        families: []
    }, {
        id: 'unicorn',
        name: 'Unicorn',
        description: '',
        families: []
    }];

    function processJson(jsonArray) {
        var clans = {};

        jsonArray.forEach(function(clanJson) {
            var clan = clanJson;
            clan.visit = function (model) {
                var logEntries = [];

                model.characterInfo.clan = this;
                logEntries.push({displayText: 'Assigned to the ' + this.name + ' clan.'});

                return logEntries;
            };

            clans[clan.id] = clan;
        });

        return clans;
    }

    return processJson(json);
});
