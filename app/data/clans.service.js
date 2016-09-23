'use strict';

angular.module('pocketIkoma').service('clanService', function() {

    var json = [{
        id: 'none',
        name: 'None',
        description: '',
        families: ['none'],
        schools: ['none']
    }, {
        id: 'crab',
        name: 'Crab',
        description: '',
        families: ['hida'],
        schools: ['hidaBushi']
    }, {
        id: 'crane',
        name: 'Crane',
        description: '',
        families: ['doji'],
        schools: ['asahinaShugenja']
    }, {
        id: 'dragon',
        name: 'Dragon',
        description: '',
        families: ['hoshi', 'mirumoto'],
        schools: ['mirumotoBushi', 'togashiMonk']
    }, {
        id: 'imperial',
        name: 'Imperial',
        description: '',
        families: [],
        schools: []
    }, {
        id: 'lion',
        name: 'Lion',
        description: '',
        families: [],
        schools: []
    }, {
        id: 'mantis',
        name: 'Mantis',
        description: '',
        families: [],
        schools: []
    }, {
        id: 'phoenix',
        name: 'Phoenix',
        description: '',
        families: [],
        schools: []
    }, {
        id: 'scorpion',
        name: 'Scorpion',
        description: '',
        families: [],
        schools: []
    }, {
        id: 'unicorn',
        name: 'Unicorn',
        description: '',
        families: [],
        schools: []
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
