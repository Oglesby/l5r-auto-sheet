'use strict';

let json = [{
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

class ClanService {
    constructor() {
        json.forEach((clanJson) => {
            let clan = clanJson;
            clan.visit = (model) => {
                let logEntries = [];

                model.characterInfo.clan = clan;
                logEntries.push({displayText: 'Assigned to the ' + clan.name + ' clan.'});

                return logEntries;
            };

            this[clan.id] = clan;
        });
    }
}

export default ClanService;
