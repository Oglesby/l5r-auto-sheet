'use strict';

import _ from 'lodash';

class LogService {

    constructor(advantageService, disadvantageService, ringService,
                familyService, clanService, spellService, schoolService, skillService, kataService, kihoService, insightService,
                secondaryStatsService) {
        this.advantageService = advantageService;
        this.disadvantageService = disadvantageService;
        this.ringService = ringService;
        this.familyService = familyService;
        this.clanService = clanService;
        this.spellService = spellService;
        this.schoolService = schoolService;
        this.skillService = skillService;
        this.kataService = kataService;
        this.kihoService = kihoService;
        this.insightService = insightService;
        this.secondaryStatsService = secondaryStatsService;
    }

    ensureLogModelHasId(logModel) {
        if (logModel.id) {
            return;
        }

        /*jslint bitwise: true */
        // TODO: Replace this with a better UUID generation than one ripped from SO.
        logModel.id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
            const r = Math.random()*16 | 0, v = c === 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
        /*jslint bitwise: false */
    }

    createLogView(title, logModel, recordItems) {
        return {
            logModel: logModel,
            title: title,
            type: logModel.type,
            comment: logModel.comment,
            creationTimestamp: logModel.creationTimestamp,
            recordItems: recordItems,
            invalidReasons: []
        };
    }

    makeCreationLogModel(initialXp, clanId, familyId, school, differentSchool) {
        const creationLogModel = {
            type: 'CREATION',
            initialXp: initialXp,
            clan: clanId ? clanId.toLowerCase() : 'none',
            family: familyId ? familyId.toLowerCase() : 'none',
            school: school,
            mandatoryExpenditures: [],
            creationTimestamp: null
        };

        if (differentSchool) {
            creationLogModel.mandatoryExpenditures.push({
                type: 'ADVANTAGE',
                id: 'differentSchool'
            });
        }

        this.ensureLogModelHasId(creationLogModel);
        return creationLogModel;
    }

    makeCharacterDetailsLogModel(name, description) {
        const characterDetailLogModel = {
            type: 'CHARACTER_INFO',
            name: name,
            description: description,
            creationTimestamp: null
        };

        this.ensureLogModelHasId(characterDetailLogModel);
        return characterDetailLogModel;
    }

    makeModuleCompletionLogModel(moduleName, moduleNumber, xp, honorChange, gloryChange, statusChange, infamyChange, taintChange, shadowChange) {
        const moduleCompletionLogModel = {
            type: 'MODULE_COMPLETION',
            name: moduleName,
            number: moduleNumber,
            xpReward: xp,
            gloryReward: gloryChange * 10,
            honorReward: honorChange * 10,
            statusChange: statusChange * 10,
            infamyChange: infamyChange * 10,
            taintChange: taintChange * 10,
            shadowChange: shadowChange * 10,
            creationTimestamp: null,
            gains: []
        };

        this.ensureLogModelHasId(moduleCompletionLogModel);
        return moduleCompletionLogModel;
    }

    makeXpExpenditureLogModel(name) {
        const xpExpenditureLogModel = {
            type: 'XP_EXPENDITURE',
            name: name,
            expenditures: []
        };

        this.ensureLogModelHasId(xpExpenditureLogModel);
        return xpExpenditureLogModel;
    }

    processIndividualExpenditure(expenditure, model) {
        let displayText = '';
        let result;
        switch (expenditure.type) {
            case 'TRAIT':
                result = this.ringService.findRingForTrait(expenditure.id, model).purchase(model, expenditure.id);
                displayText = 'Spent ' + result.cost + ' XP to raise trait ' + result.name + ' to ' + result.newValue;
                break;
            case 'SKILL':
                result = this.skillService[expenditure.id].purchase(model, expenditure.options, expenditure.cost);
                displayText = 'Spent ' + result.cost + ' XP to raise skill ' + result.name + ' to ' + result.newValue;
                break;
            case 'EMPHASIS':
                result = this.skillService[expenditure.skillId].purchaseEmphasis(model, expenditure.emphasis, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name + ' emphasis for the ' + result.skillName + ' skill';
                break;
            case 'ADVANTAGE':
                result = this.advantageService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'DISADVANTAGE':
                result = this.disadvantageService[expenditure.id].purchase(model, expenditure.options);
                displayText ='Gained ' + result.cost + ' XP from ' + result.name;
                break;
            case 'KATA':
                result = this.kataService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'KIHO':
                result = this.kihoService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
                break;
            case 'SPELL':
                result = this.spellService[expenditure.id].purchase(model, expenditure.options);
                displayText = 'Spent ' + result.cost + ' XP to gain ' + result.name;
        }

        let invalidReasons = [];
        invalidReasons = invalidReasons.concat(result.invalidReasons);
        if (expenditure.comment) {
            displayText += ' (' + expenditure.comment + ')';
        }
        return { displayText: displayText, invalidReasons: invalidReasons };
    }

    processCreationLogModel(logModel, model) {
        const clan = this.clanService[logModel.clan];
        const family = this.familyService[logModel.family];
        const school = this.schoolService[logModel.school.id];

        let recordItems = [
            {
                displayText: 'Set initial xp to ' + logModel.initialXp
            }
        ];

        model.characterInfo.xp = logModel.initialXp;
        model.characterInfo.gainedXp = logModel.initialXp;
        recordItems = recordItems.concat(clan.visit(model));
        if (family) {
            recordItems = recordItems.concat(family.visit(model));
        }
        if (school) {
            recordItems = recordItems.concat(school.visit(model, logModel.school.options));
        }

        let n = 0;
        _.forEach(logModel.mandatoryExpenditures, (expenditure) => {
            recordItems.push({
                id: n++,
                displayText: this.processIndividualExpenditure(expenditure, model)
            });
        });

        return this.createLogView('Character Building - School and Family', logModel, recordItems);
    }

    processCharacterInfoLogModel(logModel, model) {
        model.characterInfo.name = logModel.name;
        model.characterInfo.description = logModel.description;

        return this.createLogView('Character Building - Basic Information', logModel, [{
            displayText: 'Set name to ' + logModel.name
        }]);
    }

    processXpExpenditureLogModel(logModel, model) {
        const recordItems = [];
        let invalidReasons = [];
        let n = 0;
        _.forEach(logModel.expenditures, (expenditure) => {
            const results = this.processIndividualExpenditure(expenditure, model);

            recordItems.push({
                id: n++,
                displayText: results.displayText
            });

            invalidReasons = invalidReasons.concat(results.invalidReasons);
        });

        const log = this.createLogView(logModel.name, logModel, recordItems);
        if (!log.isHouseruled) {
            log.invalidReasons = invalidReasons;
        }
        return log;
    }

    handleCharInfoType(type, logModel, recordItems, model, displayMult) {
        const reward = logModel[type + 'Reward'] || 0;
        model.characterInfo[type] += reward;

        if (type === 'xp') {
            model.characterInfo.gainedXp += reward;
        }

        if (reward > 0) {
            recordItems.push({displayText: 'Gained ' + reward * displayMult + ' ' + type});
        } else if (reward < 0) {
            recordItems.push({displayText: 'Lost ' + reward * displayMult + ' ' + type});
        }
    }

    processModuleCompletionLogModel(logModel, model) {
        const recordItems = [];
        let n = 0;

        this.handleCharInfoType('xp', logModel, recordItems, model, 1);
        this.handleCharInfoType('status', logModel, recordItems, model, 0.1);
        this.handleCharInfoType('glory', logModel, recordItems, model, 0.1);
        this.handleCharInfoType('honor', logModel, recordItems, model, 0.1);
        this.handleCharInfoType('taint', logModel, recordItems, model, 0.1);
        this.handleCharInfoType('infamy', logModel, recordItems, model, 0.1);

        _.forEach(logModel.gains, (expenditure) => {
            let displayText = '';
            switch (expenditure.type) {
                case 'TRAIT':
                    const trait = this.ringService.findRingForTrait(expenditure.id, model).increaseTrait(model, expenditure.id);
                    displayText = 'Spent 0 XP to raise trait ' + trait.name + ' to ' + trait.value;
                    break;
                case 'SKILL':
                    let skill = this.skillService[expenditure.id].increase(model, expenditure.options);
                    displayText = 'Spent 0 XP to raise skill ' + skill.type.name + ' to ' + skill.rank;
                    break;
                case 'EMPHASIS':
                    skill = this.skillService[expenditure.skillId].addEmphasis(model, expenditure.emphasis, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + expenditure.emphasis + ' emphasis for the ' + skill.name + ' skill';
                    break;
                case 'ADVANTAGE':
                    let options = expenditure.options;
                    const advantage = this.advantageService[expenditure.id].gain(model, options);
                    displayText = 'Spent 0 XP to gain ' + advantage.type.name;
                    displayText = (options && options.choosing) ? displayText + ': ' + options.choosing : displayText;
                    break;
                case 'DISADVANTAGE':
                    options = expenditure.options;
                    const disadvantage = this.disadvantageService[expenditure.id].gain(model, options);
                    displayText ='Gained 0 XP from ' + disadvantage.type.name;
                    displayText = (options && options.choosing) ? displayText + ': ' + options.choosing : displayText;
                    break;
                case 'KATA':
                    const kata = this.kataService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + kata.name;
                    break;
                case 'KIHO':
                    const kiho = this.kihoService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + kiho.name;
                    break;
                case 'SPELL':
                    const spell = this.spellService[expenditure.id].purchase(model, expenditure.options);
                    displayText = 'Spent 0 XP to gain ' + spell.name;
            }

            if (expenditure.comment) {
                displayText += ' (' + expenditure.comment + ')';
            }
            recordItems.push({
                id: n++,
                displayText:displayText
            });
        });

        return this.createLogView('Completed Module: ' + logModel.name + (logModel.number ? ' (' + logModel.number + ')' : ''), logModel, recordItems);
    }

    processLogsIntoModel(model, logModels) {
        const logViews = [];
        _.forEach(logModels, (logModel) => {
            this.ensureLogModelHasId(logModel);

            switch (logModel.type) {
                case 'CREATION':
                    logViews.push(this.processCreationLogModel(logModel, model));
                    break;
                case 'CHARACTER_INFO':
                    logViews.push(this.processCharacterInfoLogModel(logModel, model));
                    break;
                case 'XP_EXPENDITURE':
                    logViews.push(this.processXpExpenditureLogModel(logModel, model));
                    break;
                case 'MODULE_COMPLETION':
                    logViews.push(this.processModuleCompletionLogModel(logModel, model));
            }
        });

        this.insightService.calculate(model);
        this.secondaryStatsService.calculate(model);
        model.logViews = model.logViews.concat(logViews);
    };
}

export default LogService;